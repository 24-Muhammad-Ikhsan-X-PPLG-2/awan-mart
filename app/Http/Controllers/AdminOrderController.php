<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\PaymentStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk monitoring dan update order dari sisi admin.
 *
 * Fokus utamanya adalah menampilkan daftar order, detail item, dan mengizinkan
 * transisi status yang valid seperti processing -> shipped.
 */
class AdminOrderController extends Controller
{
    /**
     * Menampilkan daftar order admin dengan filter search dan status.
     */
    public function index(Request $request): Response
    {
        // Validasi filter yang masuk dari query string.
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', Rule::in(
                array_map(fn (OrderStatus $status): string => $status->value, OrderStatus::cases())
            )],
        ]);
        $search = trim($filters['search'] ?? '');
        $status = $filters['status'] ?? null;

        // Hitung jumlah per status agar badge/filter summary bisa ditampilkan.
        $statusCounts = Order::query()
            ->select('status')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        // Agregat ringkas untuk stat card utama: total, diproses, dikirim, selesai.
        $aggregate = DB::table('orders')
            ->selectRaw(
                'COUNT(*) as total, '.
                'SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as processing, '.
                'SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as shipped, '.
                'SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as completed',
                [
                    OrderStatus::Processing->value,
                    OrderStatus::Shipped->value,
                    OrderStatus::Completed->value,
                ]
            )
            ->first();

        $orders = Order::query()
            ->with(['user:id,email', 'user.pelanggan:id,user_id,name', 'payment'])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('order_number', 'like', "%{$search}%")
                        ->orWhereHas('user.pelanggan', function ($query) use ($search): void {
                            $query->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status !== null, fn ($query) => $query->where('status', $status))
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Order $order): array => [
                'id' => $order->id,
                'orderNumber' => $order->order_number,
                'customer' => $order->user->pelanggan->name ?? $order->user->email,
                'date' => $order->created_at?->toISOString(),
                'total' => (float) $order->total_price,
                'paymentStatus' => $order->payment?->status->value,
                'status' => $order->status->value,
            ]);

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'statusCounts' => collect(OrderStatus::cases())
                ->map(fn (OrderStatus $orderStatus): array => [
                    'value' => $orderStatus->value,
                    'label' => $this->orderStatusLabel($orderStatus),
                    'count' => (int) $statusCounts->get($orderStatus->value, 0),
                ])
                ->values(),
            'stats' => [
                'total' => (int) $aggregate->total,
                'processing' => (int) $aggregate->processing,
                'shipped' => (int) $aggregate->shipped,
                'completed' => (int) $aggregate->completed,
            ],
            'admin' => [
                'name' => $request->user()->admin?->name ?: $request->user()->email,
                'email' => $request->user()->email,
            ],
            'generatedAt' => now()->toISOString(),
        ]);
    }

    /**
     * Menampilkan detail order lengkap untuk admin, termasuk item, customer, dan summary payment.
     */
    public function show(Request $request, Order $order): Response
    {
        $order->load([
            'user.pelanggan',
            'payment',
            'orderItems.product.product_images',
        ]);

        // Transform item ke format yang mudah dipakai frontend: nama produk, qty, harga, subtotal.
        $items = $order->orderItems
            ->map(fn (OrderItem $item): array => [
                'id' => $item->id,
                'productName' => $item->product->name,
                'image' => $item->product->product_images->first()?->image,
                'quantity' => $item->quantity,
                'unitPrice' => (float) $item->price,
                'subtotal' => (float) $item->price * $item->quantity,
            ])
            ->values();
        $subtotal = (float) $items->sum('subtotal');
        $total = (float) $order->total_price;

        return Inertia::render('admin/orders/show', [
            'order' => [
                'id' => $order->id,
                'orderNumber' => $order->order_number,
                'date' => $order->created_at?->toISOString(),
                'status' => $order->status->value,
                'canMarkAsShipped' => $order->status === OrderStatus::Processing,
                'shippingAddress' => $order->shipping_address,
                'customer' => [
                    'name' => $order->user->pelanggan->name ?? $order->user->email,
                    'email' => $order->user->email,
                    'phone' => $order->user->pelanggan?->telp,
                ],
                'items' => $items,
                'payment' => [
                    'status' => $order->payment?->status->value,
                    'statusLabel' => $order->payment
                        ? $this->paymentStatusLabel($order->payment->status)
                        : 'Belum tersedia',
                    'method' => $order->payment?->method,
                    'transactionId' => $order->payment?->transaction_id,
                    'amount' => $order->payment === null
                        ? null
                        : (float) $order->payment->amount,
                ],
                'summary' => [
                    'subtotal' => $subtotal,
                    'shipping' => max(0, $total - $subtotal),
                    'total' => $total,
                ],
            ],
            'admin' => [
                'name' => $request->user()->admin?->name ?: $request->user()->email,
                'email' => $request->user()->email,
            ],
            'generatedAt' => now()->toISOString(),
        ]);
    }

    /**
     * Mengizinkan transisi status order yang sah: diproses -> dikirim.
     *
     * Logika validasi tetap dijalankan di backend, bukan hanya di frontend.
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in([OrderStatus::Shipped->value])],
        ]);

        DB::transaction(function () use ($order, $validated): void {
            // Kunci baris order agar tidak terjadi dua admin mengubah status secara bersamaan.
            $lockedOrder = Order::query()
                ->lockForUpdate()
                ->findOrFail($order->id);

            if ($lockedOrder->status !== OrderStatus::Processing) {
                throw ValidationException::withMessages([
                    'status' => 'Hanya pesanan yang sedang diproses dapat ditandai sebagai dikirim.',
                ]);
            }

            $lockedOrder->update(['status' => $validated['status']]);
        });

        return back()->with('success', 'Pesanan berhasil ditandai sebagai dikirim.');
    }

    /**
     * Mengubah enum order status menjadi label yang lebih manusiawi.
     */
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

    /**
     * Mengubah enum payment status menjadi label yang lebih manusiawi.
     */
    private function paymentStatusLabel(PaymentStatus $status): string
    {
        return match ($status) {
            PaymentStatus::Pending => 'Menunggu pembayaran',
            PaymentStatus::Success => 'Berhasil',
            PaymentStatus::Failed => 'Gagal',
            PaymentStatus::Expired => 'Kedaluwarsa',
            PaymentStatus::Canceled => 'Dibatalkan',
        };
    }
}
