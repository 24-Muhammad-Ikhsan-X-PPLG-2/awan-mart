<?php

namespace App\Http\Controllers;

use App\Models\Courier;
use App\Models\Supplier;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminCourierController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);
        $search = trim($filters['search'] ?? '');

        $couriers = Courier::query()
            ->with('supplier.user:id,email')
            ->withCount('orders')
            ->when($search !== '', fn (Builder $query) => $query
                ->where(fn (Builder $query) => $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhereHas('supplier', fn (Builder $query) => $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhereHas('user', fn (Builder $query) => $query
                            ->where('email', 'like', "%{$search}%")))))
            ->when(
                isset($filters['status']),
                fn (Builder $query) => $query->where(
                    'is_active',
                    $filters['status'] === 'active'
                )
            )
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Courier $courier): array => [
                'id' => $courier->id,
                'name' => $courier->name,
                'supplierId' => $courier->supplier_id,
                'supplierName' => $courier->supplier->name,
                'supplierEmail' => $courier->supplier->user->email,
                'shippingCost' => (int) $courier->shipping_cost,
                'isActive' => $courier->is_active,
                'ordersCount' => $courier->orders_count,
            ]);

        return Inertia::render('admin/couriers/index', [
            ...$this->pageData($request),
            'couriers' => $couriers,
            'filters' => [
                'search' => $search,
                'status' => $filters['status'] ?? '',
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('admin/couriers/form', [
            ...$this->pageData($request),
            'courier' => null,
            'suppliers' => $this->supplierOptions(),
        ]);
    }

    public function edit(Request $request, Courier $courier): Response
    {
        $courier->load('supplier.user:id,email');

        return Inertia::render('admin/couriers/form', [
            ...$this->pageData($request),
            'courier' => [
                'id' => $courier->id,
                'name' => $courier->name,
                'supplier_id' => (string) $courier->supplier_id,
                'shipping_cost' => (string) $courier->shipping_cost,
                'is_active' => $courier->is_active,
            ],
            'suppliers' => $this->supplierOptions($courier->supplier_id),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $courier = Courier::query()->create($this->validateCourier($request));

        return redirect("/admin/couriers/{$courier->id}/edit")
            ->with('success', 'Kurir berhasil ditambahkan.');
    }

    public function update(Request $request, Courier $courier): RedirectResponse
    {
        $courier->update($this->validateCourier($request, $courier));

        return back()->with('success', 'Kurir berhasil diperbarui.');
    }

    public function destroy(Courier $courier): RedirectResponse
    {
        if ($courier->orders()->exists()) {
            throw ValidationException::withMessages([
                'courier' => 'Kurir yang memiliki riwayat pesanan tidak dapat dihapus. Nonaktifkan kurir sebagai gantinya.',
            ]);
        }

        $courier->delete();

        return back()->with('success', 'Kurir berhasil dihapus.');
    }

    private function validateCourier(Request $request, ?Courier $courier = null): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'supplier_id' => [
                'required',
                'integer',
                Rule::exists('supplier', 'id'),
                Rule::unique('couriers', 'supplier_id')->ignore($courier?->id),
            ],
            'shipping_cost' => ['required', 'integer', 'min:0', 'max:999999999'],
            'is_active' => ['required', 'boolean'],
        ]);

        $supplier = Supplier::query()->whereKey($validated['supplier_id'])->firstOrFail();
        if ($supplier->user?->role !== UserRole::Supplier) {
            throw ValidationException::withMessages([
                'supplier_id' => 'Akun yang dipilih harus memiliki role supplier.',
            ]);
        }

        return $validated;
    }

    private function supplierOptions(?int $selectedSupplierId = null): array
    {
        return Supplier::query()
            ->with('user:id,email,role')
            ->whereHas('user', fn (Builder $query) => $query->where('role', UserRole::Supplier))
            ->where(function (Builder $query) use ($selectedSupplierId): void {
                $query->whereDoesntHave('courier');
                if ($selectedSupplierId !== null) {
                    $query->orWhereKey($selectedSupplierId);
                }
            })
            ->orderBy('name')
            ->get()
            ->map(fn (Supplier $supplier): array => [
                'id' => $supplier->id,
                'name' => $supplier->name,
                'email' => $supplier->user->email,
            ])
            ->all();
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
