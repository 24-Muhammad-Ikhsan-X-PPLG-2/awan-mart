<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Payment;
use App\Models\PaymentStatus;
use App\Models\Procurement;
use App\Models\ProcurementStatus;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $range = $request->validate([
            'range' => ['sometimes', 'string', Rule::in(['7d', '30d', '12m'])],
        ])['range'] ?? '7d';
        $today = now()->startOfDay();
        $from = match ($range) {
            '30d' => $today->copy()->subDays(29),
            '12m' => $today->copy()->startOfMonth()->subMonths(11),
            default => $today->copy()->subDays(6),
        };
        $until = now()->endOfDay();

        $revenueByDate = Payment::query()
            ->where('status', PaymentStatus::Success)
            ->whereNotNull('paid_at')
            ->whereBetween('paid_at', [$from, $until])
            ->selectRaw('DATE(paid_at) as paid_date, SUM(amount) as revenue')
            ->groupBy('paid_date')
            ->orderBy('paid_date')
            ->pluck('revenue', 'paid_date');

        $chartDates = $range === '12m'
            ? collect(range(0, 11))->map(fn (int $offset) => $from->copy()->addMonths($offset)->format('Y-m'))
            : collect(range(0, $range === '30d' ? 29 : 6))->map(
                fn (int $offset) => $from->copy()->addDays($offset)->format('Y-m-d')
            );
        $revenueTrend = $chartDates
            ->map(function (string $date) use ($range, $revenueByDate): array {
                $revenue = $range === '12m'
                    ? $revenueByDate->filter(fn ($value, $paidDate) => str_starts_with($paidDate, $date))->sum()
                    : $revenueByDate->get($date, 0);

                return [
                    'date' => $date,
                    'revenue' => (float) $revenue,
                ];
            })
            ->values();

        $orderCounts = Order::query()
            ->select('status')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');
        $orderStatuses = collect(OrderStatus::cases())
            ->map(fn (OrderStatus $status): array => [
                'value' => $status->value,
                'label' => $this->orderStatusLabel($status),
                'count' => (int) $orderCounts->get($status->value, 0),
            ])
            ->values();

        $procurementCounts = Procurement::query()
            ->select('status')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');
        $recentProcurements = Procurement::query()
            ->with('supplier:id,name')
            ->latest('updated_at')
            ->limit(4)
            ->get(['id', 'supplier_id', 'status', 'tanggal_pengadaan', 'updated_at'])
            ->map(fn (Procurement $procurement): array => [
                'id' => $procurement->id,
                'supplier' => $procurement->supplier->name,
                'status' => ProcurementStatus::from(
                    (string) $procurement->getRawOriginal('status')
                )->value,
                'date' => $procurement->updated_at?->toISOString(),
            ]);

        $lowStockThreshold = (int) config('dashboard.low_stock_threshold');

        return Inertia::render('admin/dashboard', [
            'admin' => [
                'name' => $request->user()->admin?->name ?: $request->user()->email,
                'email' => $request->user()->email,
            ],
            'generatedAt' => now()->toISOString(),
            'filters' => ['range' => $range],
            'stats' => [
                'revenue' => (float) Payment::query()
                    ->where('status', PaymentStatus::Success)
                    ->sum('amount'),
                'orders' => Order::query()->count(),
                'products' => Product::query()->count(),
                'customers' => User::query()->where('role', UserRole::Pelanggan)->count(),
            ],
            'revenueTrend' => $revenueTrend,
            'orderStatuses' => $orderStatuses,
            'recentOrders' => Order::query()
                ->with(['user:id,email', 'user.pelanggan:id,user_id,name'])
                ->latest()
                ->orderByDesc('id')
                ->limit(7)
                ->get(['id', 'order_number', 'user_id', 'total_price', 'status', 'created_at'])
                ->map(fn (Order $order): array => [
                    'id' => $order->id,
                    'orderNumber' => $order->order_number,
                    'customer' => $order->user->pelanggan->name ?? $order->user->email ?? 'Pelanggan tidak tersedia',
                    'date' => $order->created_at?->toISOString(),
                    'total' => (float) $order->total_price,
                    'status' => $order->status->value,
                ]),
            'inventory' => [
                'lowStockThreshold' => $lowStockThreshold,
                'lowStockCount' => Product::query()
                    ->where('stock', '>', 0)
                    ->where('stock', '<=', $lowStockThreshold)
                    ->count(),
                'outOfStockCount' => Product::query()->where('stock', '<=', 0)->count(),
                'products' => Product::query()
                    ->where('stock', '<=', $lowStockThreshold)
                    ->orderBy('stock')
                    ->orderBy('name')
                    ->limit(6)
                    ->get(['id', 'name', 'stock'])
                    ->map(fn (Product $product): array => [
                        'id' => $product->id,
                        'name' => $product->name,
                        'stock' => $product->stock,
                    ]),
            ],
            'topProducts' => $this->topProducts(),
            'procurements' => [
                'total' => Procurement::query()->count(),
                'pending' => (int) $procurementCounts->get(ProcurementStatus::Pending->value, 0),
                'approved' => (int) $procurementCounts->get(ProcurementStatus::Approved->value, 0),
                'completed' => (int) $procurementCounts->get(ProcurementStatus::Completed->value, 0),
                'recent' => $recentProcurements,
            ],
        ]);
    }

    /**
     * @return Collection<int, array{id: int, name: string, image: string|null, quantity: int, revenue: float}>
     */
    private function topProducts(): Collection
    {
        return Product::query()
            ->select(['products.id', 'products.name'])
            ->selectSub(
                ProductImage::query()
                    ->select('image')
                    ->whereColumn('product_id', 'products.id')
                    ->orderBy('id')
                    ->limit(1),
                'image'
            )
            ->join('order_items', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->whereExists(function (QueryBuilder $query): void {
                $query->selectRaw('1')
                    ->from('payments')
                    ->whereColumn('payments.order_id', 'orders.id')
                    ->where('payments.status', PaymentStatus::Success);
            })
            ->selectRaw('SUM(order_items.quantity) as quantity_sold')
            ->selectRaw('SUM(order_items.quantity * order_items.price) as revenue')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('quantity_sold')
            ->limit(5)
            ->get()
            ->map(function (Product $product): array {
                $image = $product->getAttribute('image');

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => is_string($image) ? $image : null,
                    'quantity' => (int) $product->getAttribute('quantity_sold'),
                    'revenue' => (float) $product->getAttribute('revenue'),
                ];
            });
    }

    private function orderStatusLabel(OrderStatus $status): string
    {
        return match ($status) {
            OrderStatus::PendingPayment => 'Menunggu pembayaran',
            OrderStatus::Processing => 'Diproses',
            OrderStatus::Shipped => 'Dikirim',
            OrderStatus::Completed => 'Selesai',
            OrderStatus::Canceled => 'Dibatalkan',
        };
    }
}
