<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controller untuk katalog produk pelanggan.
 */
class ProductsController extends Controller
{
    /**
     * Menampilkan daftar produk dengan filter dan pagination.
     *
     * Query dibangun secara dinamis berdasarkan search, kategori, rentang harga,
     * dan sort order. Semua filter ini dipertahankan di URL via withQueryString().
     */
    public function index(Request $request)
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'integer', 'exists:categories,id'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'gte:min_price'],
            'sort' => ['nullable', 'in:latest,price_asc,price_desc,name_asc'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $products = Product::query()
            ->with(['category', 'product_images'])
            ->when($filters['q'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(
                $filters['category'] ?? null,
                fn($query, $categoryId) => $query->where('category_id', $categoryId)
            )
            ->when(
                $filters['min_price'] ?? null,
                fn($query, $minPrice) => $query->where('price', '>=', $minPrice)
            )
            ->when(
                $filters['max_price'] ?? null,
                fn($query, $maxPrice) => $query->where('price', '<=', $maxPrice)
            );

        match ($filters['sort'] ?? 'latest') {
            'price_asc' => $products->orderBy('price')->orderBy('id'),
            'price_desc' => $products->orderByDesc('price')->orderByDesc('id'),
            'name_asc' => $products->orderBy('name')->orderBy('id'),
            default => $products->latest(),
        };

        return Inertia::render('products', [
            'products' => $products
                ->paginate(12)
                ->withQueryString()
                ->through(function (Product $product): Product {
                    $product->product_images->each(function (ProductImage $image): void {
                        $image->setAttribute(
                            'image',
                            $this->imageUrl($image->getRawOriginal('image'))
                        );
                    });

                    return $product;
                }),
            'categories' => Category::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'filters' => [
                'q' => $filters['q'] ?? '',
                'category' => $filters['category'] ?? '',
                'min_price' => $filters['min_price'] ?? '',
                'max_price' => $filters['max_price'] ?? '',
                'sort' => $filters['sort'] ?? 'latest',
            ],
        ]);
    }

    /**
     * Endpoint pencarian cepat produk untuk autocomplete di UI.
     */
    public function search(Request $req)
    {
        $keyword = $req->string('keyword')->trim()->toString();

        if (mb_strlen($keyword) < 2) {
            return response()->json([]);
        }

        // Search dilakukan di nama produk dan kategori agar user lebih mudah mencari.
        $products = Product::query()
            ->with(['category', 'product_images'])
            ->where('name', 'like', "%{$keyword}%")
            ->orWhereHas('category', function ($query) use ($keyword) {
                $query->where('name', 'like', "%{$keyword}%");
            })
            ->limit(5)
            ->get();

        return response()->json($products->map(fn($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => $product->price,
            'image' => $this->imageUrl($product->product_images->first()?->image),
            'category' => $product->category?->name
        ]));
    }

    private function imageUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        return str_starts_with($path, '/') || str_starts_with($path, 'http')
            ? $path
            : asset('storage/'.$path);
    }
}
