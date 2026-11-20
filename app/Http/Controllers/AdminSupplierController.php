<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminSupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
        ]);
        $search = trim($filters['search'] ?? '');

        $suppliers = Supplier::query()
            ->whereHas('user', fn (Builder $query) => $query->where('role', UserRole::Supplier))
            ->with(['user:id,email,created_at', 'courier'])
            ->withCount('procurements')
            ->addSelect([
                'products_count' => DB::table('products')
                    ->selectRaw('COUNT(*)')
                    ->whereColumn('products.user_id', 'supplier.user_id'),
            ])
            ->when($search !== '', fn (Builder $query) => $query
                ->where(fn (Builder $query) => $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('telp', 'like', "%{$search}%")
                    ->orWhereHas('user', fn (Builder $userQuery) => $userQuery
                        ->where('email', 'like', "%{$search}%"))))
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Supplier $supplier): array => [
                'id' => $supplier->id,
                'userId' => $supplier->user_id,
                'name' => $supplier->name,
                'email' => $supplier->user->email,
                'phone' => $supplier->telp,
                'address' => $supplier->alamat,
                'productsCount' => (int) $supplier->products_count,
                'procurementsCount' => $supplier->procurements_count,
                'isCourier' => $supplier->courier !== null,
                'courierActive' => $supplier->courier?->is_active ?? false,
                'joinedAt' => $supplier->user->created_at?->toISOString(),
            ]);

        return Inertia::render('admin/suppliers/index', [
            ...$this->pageData($request),
            'suppliers' => $suppliers,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('admin/suppliers/form', [
            ...$this->pageData($request),
            'supplier' => null,
        ]);
    }

    public function edit(Request $request, Supplier $supplier): Response
    {
        $supplier->load('user:id,email');
        abort_unless($supplier->user->role === UserRole::Supplier, 404);

        return Inertia::render('admin/suppliers/form', [
            ...$this->pageData($request),
            'supplier' => [
                'id' => $supplier->id,
                'name' => $supplier->name,
                'email' => $supplier->user->email,
                'phone' => $supplier->telp ?? '',
                'address' => $supplier->alamat ?? '',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateSupplier($request);

        $supplier = DB::transaction(function () use ($validated): Supplier {
            $user = User::query()->create([
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => UserRole::Supplier,
            ]);

            return Supplier::query()->create([
                'user_id' => $user->id,
                'name' => trim($validated['name']),
                'telp' => $validated['phone'] ?? null,
                'alamat' => $validated['address'] ?? null,
            ]);
        });

        return redirect("/admin/suppliers/{$supplier->id}/edit")
            ->with('success', 'Akun supplier berhasil dibuat.');
    }

    public function update(Request $request, Supplier $supplier): RedirectResponse
    {
        abort_unless($supplier->user->role === UserRole::Supplier, 404);
        $validated = $this->validateSupplier($request, $supplier);

        DB::transaction(function () use ($validated, $supplier): void {
            $supplier->update([
                'name' => trim($validated['name']),
                'telp' => $validated['phone'] ?? null,
                'alamat' => $validated['address'] ?? null,
            ]);
            $supplier->user->update([
                'email' => $validated['email'],
                ...(! empty($validated['password'])
                    ? ['password' => Hash::make($validated['password'])]
                    : []),
            ]);
        });

        return back()->with('success', 'Akun supplier berhasil diperbarui.');
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        $user = $supplier->user;
        if (
            $user->products()->exists()
            || $user->orders()->exists()
            || $supplier->procurements()->exists()
            || $supplier->courier()->whereHas('orders')->exists()
        ) {
            throw ValidationException::withMessages([
                'supplier' => 'Akun supplier dengan produk, pesanan, pengadaan, atau pengiriman terkait tidak dapat dihapus.',
            ]);
        }

        $user->delete();

        return back()->with('success', 'Akun supplier berhasil dihapus.');
    }

    private function validateSupplier(Request $request, ?Supplier $supplier = null): array
    {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('supplier', 'name')->ignore($supplier?->id),
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($supplier?->user_id),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:1000'],
            'password' => [
                $supplier ? 'nullable' : 'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);
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
