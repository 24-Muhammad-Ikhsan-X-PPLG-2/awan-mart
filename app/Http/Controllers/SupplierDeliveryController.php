<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SupplierDeliveryController extends Controller
{
    public function index(Request $request): Response
    {
        $supplier = $this->courierSupplier($request->user());
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'in:shipped,completed'],
        ]);
        $search = trim($filters['search'] ?? '');
        $baseQuery = Order::query()->where('courier_id', $supplier->courier->id);

        $deliveries = (clone $baseQuery)
            ->with(['user.pelanggan', 'orderItems.product'])
            ->when(
                isset($filters['status']),
                fn (Builder $query) => $query->where('status', $filters['status'])
            )
            ->when($search !== '', fn (Builder $query) => $query
                ->where(fn (Builder $query) => $query
                    ->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user.pelanggan', fn (Builder $query) => $query
                        ->where('name', 'like', "%{$search}%"))))
            ->orderByRaw("CASE WHEN status = 'shipped' THEN 0 ELSE 1 END")
            ->orderByDesc('shipped_at')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Order $order): array => [
                'id' => $order->id,
                'orderNumber' => $order->order_number,
                'customer' => $order->user->pelanggan?->name ?? $order->user->email,
                'phone' => $order->user->pelanggan?->telp,
                'address' => $order->shipping_address,
                'itemsCount' => $order->orderItems->sum('quantity'),
                'status' => $order->status->value,
                'shippedAt' => $order->shipped_at?->toISOString(),
                'completedAt' => $order->completed_at?->toISOString(),
            ]);

        return Inertia::render('supplier/deliveries/index', [
            'supplier' => [
                'id' => $supplier->id,
                'name' => $supplier->name,
                'email' => $request->user()->email,
                'isCourier' => true,
            ],
            'generatedAt' => now()->toISOString(),
            'filters' => [
                'search' => $search,
                'status' => $filters['status'] ?? null,
            ],
            'stats' => [
                'shipped' => (clone $baseQuery)->where('status', OrderStatus::Shipped)->count(),
                'completed' => (clone $baseQuery)->where('status', OrderStatus::Completed)->count(),
            ],
            'deliveries' => $deliveries,
            'success' => $request->session()->get('success'),
        ]);
    }

    public function complete(Request $request, Order $order): RedirectResponse
    {
        $supplier = $this->courierSupplier($request->user());

        DB::transaction(function () use ($order, $supplier): void {
            $lockedOrder = Order::query()
                ->where('courier_id', $supplier->courier->id)
                ->whereKey($order->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedOrder->status !== OrderStatus::Shipped) {
                throw ValidationException::withMessages([
                    'status' => 'Hanya pesanan yang sedang dikirim oleh akun kurir ini dapat diselesaikan.',
                ]);
            }

            $lockedOrder->update([
                'status' => OrderStatus::Completed,
                'completed_at' => now(),
            ]);
        });

        return back()->with('success', 'Pesanan berhasil ditandai selesai.');
    }

    private function courierSupplier(?User $user): Supplier
    {
        abort_if($user === null, 403);

        $supplier = $user->supplier()->with('courier')->firstOrFail();
        abort_unless($supplier->courier?->is_active, 403);

        return $supplier;
    }
}
