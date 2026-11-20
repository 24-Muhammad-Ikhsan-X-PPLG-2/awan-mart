<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Pelanggan;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class AdminCatalogController extends Controller
{
    public function products(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'integer', 'exists:categories,id'],
        ]);
        $search = trim($filters['search'] ?? '');

        $products = Product::query()
            ->with(['category:id,name', 'product_images'])
            ->withCount(['order_items', 'reviews'])
            ->when($search !== '', fn (Builder $query) => $query
                ->where(fn (Builder $query) => $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")))
            ->when(
                $filters['category'] ?? null,
                fn (Builder $query, int $category) => $query->where('category_id', $category)
            )
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Product $product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'categoryId' => $product->category_id,
                'category' => $product->category->name,
                'image' => $this->imageUrl($product->product_images->first()?->image),
                'ordersCount' => $product->order_items_count,
                'reviewsCount' => $product->reviews_count,
            ]);

        return Inertia::render('admin/products/index', [
            ...$this->pageData($request),
            'products' => $products,
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search,
                'category' => $filters['category'] ?? null,
            ],
        ]);
    }

    public function createProduct(Request $request): Response
    {
        return Inertia::render('admin/products/form', [
            ...$this->pageData($request),
            'product' => null,
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function editProduct(Request $request, Product $product): Response
    {
        $product->load('product_images');

        return Inertia::render('admin/products/form', [
            ...$this->pageData($request),
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => (string) $product->price,
                'stock' => (string) $product->stock,
                'category_id' => (string) $product->category_id,
                'images' => $product->product_images
                    ->map(fn (ProductImage $image): array => [
                        'id' => $image->id,
                        'url' => $this->imageUrl($image->image),
                    ])
                    ->values(),
            ],
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function storeProduct(Request $request): RedirectResponse
    {
        $validated = $this->validateProduct($request, false);
        $storedPaths = $this->storeImages($request);

        try {
            $product = DB::transaction(function () use ($validated, $request, $storedPaths): Product {
                $product = Product::query()->create([
                    'user_id' => $request->user()->id,
                    'category_id' => $validated['category_id'],
                    'slug' => $this->uniqueProductSlug($validated['name']),
                    'name' => trim($validated['name']),
                    'description' => trim($validated['description']),
                    'price' => $validated['price'],
                    'stock' => $validated['stock'],
                ]);
                $this->attachImages($product, $storedPaths);

                return $product;
            });
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($storedPaths);
            throw $exception;
        }

        return redirect("/admin/products/{$product->id}/edit")
            ->with('success', 'Produk berhasil dibuat.');
    }

    public function updateProduct(Request $request, Product $product): RedirectResponse
    {
        $validated = $this->validateProduct($request, true);
        $removeIds = $validated['remove_images'] ?? [];
        $availableImages = $product->product_images()->count()
            - $product->product_images()->whereIn('id', $removeIds)->count()
            + count($request->file('images', []));
        if ($availableImages < 1 || $availableImages > 5) {
            throw ValidationException::withMessages([
                'images' => 'Produk harus memiliki 1 sampai 5 foto.',
            ]);
        }

        $storedPaths = $this->storeImages($request);
        $removedPaths = [];

        try {
            DB::transaction(function () use (
                $validated,
                $product,
                $storedPaths,
                &$removedPaths
            ): void {
                $product->update([
                    'category_id' => $validated['category_id'],
                    'slug' => $this->uniqueProductSlug($validated['name'], $product->id),
                    'name' => trim($validated['name']),
                    'description' => trim($validated['description']),
                    'price' => $validated['price'],
                    'stock' => $validated['stock'],
                ]);

                $removeIds = $validated['remove_images'] ?? [];
                if ($removeIds !== []) {
                    $images = $product->product_images()
                        ->whereIn('id', $removeIds)
                        ->get();
                    $removedPaths = $images
                        ->map(fn (ProductImage $image): string => $image->getRawOriginal('image'))
                        ->filter(fn (string $path): bool => ! str_starts_with($path, '/') && ! str_starts_with($path, 'http'))
                        ->values()
                        ->all();
                    $images->each->delete();
                }

                $this->attachImages($product, $storedPaths);
            });
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($storedPaths);
            throw $exception;
        }

        Storage::disk('public')->delete($removedPaths);

        return back()->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroyProduct(Product $product): RedirectResponse
    {
        if (
            $product->order_items()->exists()
            || $product->reviews()->exists()
            || CartItem::query()->where('product_id', $product->id)->exists()
        ) {
            throw ValidationException::withMessages([
                'product' => 'Produk yang digunakan pada keranjang, riwayat pesanan, atau ulasan tidak dapat dihapus.',
            ]);
        }

        $paths = DB::table('product_images')
            ->where('product_id', $product->id)
            ->pluck('image')
            ->filter(fn (string $path): bool => ! str_starts_with($path, '/') && ! str_starts_with($path, 'http'))
            ->values()
            ->all();
        $product->delete();
        Storage::disk('public')->delete($paths);

        return back()->with('success', 'Produk berhasil dihapus.');
    }

    public function categories(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
        ]);
        $search = trim($filters['search'] ?? '');

        $categories = Category::query()
            ->withCount('products')
            ->when($search !== '', fn (Builder $query) => $query
                ->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'icon' => $category->icon,
                'productsCount' => $category->products_count,
            ]);

        return Inertia::render('admin/categories/index', [
            ...$this->pageData($request),
            'categories' => $categories,
            'filters' => ['search' => $search],
        ]);
    }

    public function createCategory(Request $request): Response
    {
        return Inertia::render('admin/categories/form', [
            ...$this->pageData($request),
            'category' => null,
        ]);
    }

    public function editCategory(Request $request, Category $category): Response
    {
        return Inertia::render('admin/categories/form', [
            ...$this->pageData($request),
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description ?? '',
                'icon' => $category->icon ?? '',
            ],
        ]);
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $this->validateCategory($request);
        $category = Category::query()->create($validated);

        return redirect("/admin/categories/{$category->id}/edit")
            ->with('success', 'Kategori berhasil dibuat.');
    }

    public function updateCategory(Request $request, Category $category): RedirectResponse
    {
        $category->update($this->validateCategory($request, $category));

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroyCategory(Category $category): RedirectResponse
    {
        if ($category->products()->exists()) {
            throw ValidationException::withMessages([
                'category' => 'Kategori yang masih memiliki produk tidak dapat dihapus.',
            ]);
        }

        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }

    public function customers(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
        ]);
        $search = trim($filters['search'] ?? '');

        $customers = Pelanggan::query()
            ->with('user:id,email,created_at')
            ->addSelect([
                'orders_count' => DB::table('orders')
                    ->selectRaw('COUNT(*)')
                    ->whereColumn('orders.user_id', 'pelanggan.user_id'),
            ])
            ->when($search !== '', fn (Builder $query) => $query
                ->where('name', 'like', "%{$search}%")
                ->orWhere('telp', 'like', "%{$search}%")
                ->orWhereHas('user', fn (Builder $query) => $query
                    ->where('email', 'like', "%{$search}%")))
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Pelanggan $customer): array => [
                'id' => $customer->id,
                'userId' => $customer->user_id,
                'name' => $customer->name,
                'email' => $customer->user->email,
                'phone' => $customer->telp,
                'ordersCount' => (int) $customer->orders_count,
                'joinedAt' => $customer->user->created_at?->toISOString(),
            ]);

        return Inertia::render('admin/customers/index', [
            ...$this->pageData($request),
            'customers' => $customers,
            'filters' => ['search' => $search],
        ]);
    }

    public function createCustomer(Request $request): Response
    {
        return Inertia::render('admin/customers/form', [
            ...$this->pageData($request),
            'customer' => null,
        ]);
    }

    public function editCustomer(Request $request, Pelanggan $customer): Response
    {
        $customer->load('user:id,email');

        return Inertia::render('admin/customers/form', [
            ...$this->pageData($request),
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->user->email,
                'phone' => $customer->telp ?? '',
            ],
        ]);
    }

    public function storeCustomer(Request $request): RedirectResponse
    {
        $validated = $this->validateCustomer($request);

        $customer = DB::transaction(function () use ($validated): Pelanggan {
            $user = User::query()->create([
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => UserRole::Pelanggan,
            ]);

            return Pelanggan::query()->create([
                'user_id' => $user->id,
                'name' => trim($validated['name']),
                'telp' => $validated['phone'] ?? null,
            ]);
        });

        return redirect("/admin/customers/{$customer->id}/edit")
            ->with('success', 'Akun pelanggan berhasil dibuat.');
    }

    public function updateCustomer(Request $request, Pelanggan $customer): RedirectResponse
    {
        $validated = $this->validateCustomer($request, $customer);

        DB::transaction(function () use ($validated, $customer): void {
            $customer->update([
                'name' => trim($validated['name']),
                'telp' => $validated['phone'] ?? null,
            ]);
            $customer->user->update([
                'email' => $validated['email'],
                ...(! empty($validated['password'])
                    ? ['password' => Hash::make($validated['password'])]
                    : []),
            ]);
        });

        return back()->with('success', 'Akun pelanggan berhasil diperbarui.');
    }

    public function destroyCustomer(Pelanggan $customer): RedirectResponse
    {
        if ($customer->user->orders()->exists() || $customer->user->products()->exists()) {
            throw ValidationException::withMessages([
                'customer' => 'Akun pelanggan dengan riwayat pesanan atau produk tidak dapat dihapus.',
            ]);
        }

        $customer->user->delete();

        return back()->with('success', 'Akun pelanggan berhasil dihapus.');
    }

    private function validateProduct(Request $request, bool $updating): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'max:10000'],
            'price' => ['required', 'numeric', 'gt:0', 'decimal:0,2', 'max:99999999.99'],
            'stock' => ['required', 'integer', 'min:0', 'max:2147483647'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'images' => [$updating ? 'nullable' : 'required', 'array', $updating ? 'max:5' : 'min:1', 'max:5'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'remove_images' => ['nullable', 'array', 'max:5'],
            'remove_images.*' => ['integer', 'distinct'],
        ]);
    }

    private function validateCategory(Request $request, ?Category $category = null): array
    {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('categories', 'name')->ignore($category?->id),
            ],
            'description' => ['required', 'string', 'max:2000'],
            'icon' => ['nullable', 'string', 'max:255'],
        ]);
    }

    private function validateCustomer(Request $request, ?Pelanggan $customer = null): array
    {
        $userId = $customer?->user_id;

        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('pelanggan', 'name')->ignore($customer?->id),
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => [
                $customer ? 'nullable' : 'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);
    }

    private function storeImages(Request $request): array
    {
        $paths = [];

        try {
            foreach ($request->file('images', []) as $image) {
                $path = $image->store('products', 'public');

                if ($path === false) {
                    throw new RuntimeException('Gagal menyimpan gambar produk.');
                }

                $paths[] = $path;
            }
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($paths);
            throw $exception;
        }

        return $paths;
    }

    private function attachImages(Product $product, array $paths): void
    {
        foreach ($paths as $path) {
            $product->product_images()->getRelated()->forceCreate([
                'product_id' => $product->id,
                'image' => $path,
            ]);
        }
    }

    private function uniqueProductSlug(string $name, ?int $exceptId = null): string
    {
        $base = Str::slug($name);
        $base = $base !== '' ? $base : 'produk';
        $slug = $base;
        $suffix = 2;

        while (Product::query()
            ->where('slug', $slug)
            ->when($exceptId !== null, fn (Builder $query) => $query->whereKeyNot($exceptId))
            ->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    private function imageUrl(?string $image): ?string
    {
        if ($image === null || $image === '') {
            return null;
        }

        return str_starts_with($image, '/') || str_starts_with($image, 'http')
            ? $image
            : asset('storage/'.$image);
    }

    private function pageData(Request $request): array
    {
        return [
            'admin' => [
                'name' => $request->user()->admin?->name ?: $request->user()->email,
                'email' => $request->user()->email,
            ],
            'generatedAt' => now()->toISOString(),
        ];
    }
}
