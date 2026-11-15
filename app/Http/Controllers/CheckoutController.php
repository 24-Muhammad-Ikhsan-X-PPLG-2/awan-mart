<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Payment;
use App\Models\PaymentStatus;
use App\Models\Pelanggan;
use App\Models\Product;
use App\Models\User;
use App\Services\MidtransPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;
use Throwable;

/**
 * Controller yang mengurus alur checkout dan pembayaran pelanggan.
 *
 * Di sini ada logika penting untuk validasi stok, pembuatan order, pemulihan order pending,
 * pemanggilan Midtrans, dan sinkronisasi status pembayaran ke order lokal.
 */
class CheckoutController extends Controller
{
    private const SHIPPING_COST = 15000;

    /**
     * Menyiapkan halaman checkout dari produk yang dipilih, mengecek ketersediaan stok,
     * dan mengirimkan alamat pelanggan beserta rincian belanja ke frontend.
     */
    public function index(Request $req)
    {
        $user = Auth::user();
        $validated = $req->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|distinct',
            'items.*.quantity' => 'required|integer|min:1',
        ]);
        $products = Product::query()->with([
            'category',
            'product_images',
        ])->whereIn('id', collect($validated['items'])->pluck('product_id'))->get();
        if ($products->count() !== count($validated['items'])) {
            return redirect()->to('/cart')->withErrors([
                'message' => 'Beberapa produk tidak ditemukan.',
            ]);
        }

        $items = collect($validated['items'])->map(function ($item) use ($products) {
            $product = $products->firstWhere('id', $item['product_id']);

            if ($item['quantity'] > $product->stock) {
                return redirect()->to('/cart')->withErrors([
                    'message' => "Stok {$product->name} tidak mencukupi.",
                ]);
            }

            return [
                'product' => $product,
                'quantity' => $item['quantity'],
                'subtotal' => $product->price * $item['quantity'],
            ];
        });

        $address = null;
        if ($user->role->value === 'pelanggan') {
            $address = Pelanggan::query()->where('user_id', '=', $user->id)->first()->alamat;
        }

        return Inertia::render('checkout', [
            'items' => $items->values(),
            'shippingCost' => $products->isEmpty() ? 0 : self::SHIPPING_COST,
            'address' => $address,
        ]);
    }

    /**
     * Membuat order dan payment, atau memakai ulang transaksi pending yang cocok.
     * Setelah Snap siap, item yang ikut checkout dihapus dari keranjang.
     */
    public function store(Request $req)
    {
        $validated = $req->validate([
            'shipping_address' => ['required', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => [
                'required',
                'integer',
                'distinct',
                'exists:products,id',
            ],
            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);
        $user = Auth::user();

        try {
            [$order, $payment, $itemDetails] = DB::transaction(
                function () use ($validated, $user) {
                    // Jaga stok tetap konsisten saat beberapa checkout berjalan bersamaan.
                    User::query()
                        ->whereKey($user->id)
                        ->lockForUpdate()
                        ->firstOrFail();

                    $items = collect($validated['items']);

                    $products = Product::query()
                        ->whereIn('id', $items->pluck('product_id'))
                        ->lockForUpdate()
                        ->get()
                        ->keyBy('id');

                    if ($products->count() !== $items->count()) {
                        throw ValidationException::withMessages([
                            'items' => 'Some products are unavailable.',
                        ]);
                    }

                    $subtotal = 0;
                    $orderItems = [];
                    $itemDetails = [];

                    foreach ($items as $item) {
                        $product = $products->get(
                            $item['product_id']
                        );

                        $quantity = (int) $item['quantity'];

                        $price = (int) round((float) $product->price);
                        $lineTotal = $price * $quantity;

                        $orderItems[] = [
                            'product_id' => $product->id,
                            'price' => $price,
                            'quantity' => $quantity,
                        ];

                        $subtotal += $lineTotal;

                        $itemDetails[] = [
                            'id' => (string) $product->id,
                            'price' => $price,
                            'quantity' => $quantity,
                            'name' => Str::limit(
                                $product->name,
                                50,
                                ''
                            ),
                        ];
                    }

                    $shippingCost = self::SHIPPING_COST;
                    $totalPrice = $subtotal + $shippingCost;
                    $itemDetails[] = [
                        'id' => 'shipping',
                        'price' => $shippingCost,
                        'quantity' => 1,
                        'name' => 'Ongkos Kirim',
                    ];

                    // Jika user sudah punya order pending dengan barang dan total yang sama,
                    // gunakan kembali order lama agar tidak membuat duplikasi transaksi.
                    $existingOrder = Order::query()
                        ->with(['payment', 'orderItems'])
                        ->where('user_id', $user->id)
                        ->where('shipping_address', $validated['shipping_address'])
                        ->where('status', OrderStatus::PendingPayment)
                        ->whereHas('payment', function ($query) {
                            $query
                                ->where('status', PaymentStatus::Pending)
                                ->where(function ($query) {
                                    $query
                                        ->whereNull('expired_at')
                                        ->orWhere('expired_at', '>', now());
                                });
                        })
                        ->orderByDesc('id')
                        ->lockForUpdate()
                        ->get()
                        ->first(function (Order $order) use ($orderItems, $totalPrice) {
                            if ((float) $order->total_price !== (float) $totalPrice) {
                                return false;
                            }

                            $storedItems = $order->orderItems->keyBy('product_id');

                            if ($storedItems->count() !== count($orderItems)) {
                                return false;
                            }

                            foreach ($orderItems as $item) {
                                $storedItem = $storedItems->get($item['product_id']);

                                if (
                                    $storedItem === null
                                    || $storedItem->quantity !== $item['quantity']
                                    || (float) $storedItem->price !== (float) $item['price']
                                ) {
                                    return false;
                                }
                            }

                            return true;
                        });

                    if ($existingOrder !== null) {
                        $existingPayment = $existingOrder->payment;
                        if ($existingPayment === null) {
                            throw new \LogicException('Pending order is missing its payment record.');
                        }

                        return [
                            $existingOrder,
                            $existingPayment,
                            $itemDetails,
                        ];
                    }

                    foreach ($items as $item) {
                        $product = $products->get($item['product_id']);

                        if ((int) $item['quantity'] > $product->stock) {
                            throw ValidationException::withMessages([
                                'items' => "Insufficient stock for {$product->name}.",
                            ]);
                        }
                    }

                    $orderNumber = 'AWM-'.
                        strtoupper(str_replace('-', '', (string) Str::uuid()));

                    $order = Order::create([
                        'order_number' => $orderNumber,
                        'user_id' => $user->id,
                        'total_price' => $totalPrice,
                        'shipping_address' => $validated['shipping_address'],
                        'status' => OrderStatus::PendingPayment,
                    ]);

                    foreach ($orderItems as $item) {
                        $order->orderItems()->create($item);
                    }

                    $payment = $order->payment()->create([
                        'provider' => 'midtrans',
                        'provider_order_id' => $orderNumber,
                        'amount' => $totalPrice,
                        'status' => PaymentStatus::Pending,
                    ]);

                    return [
                        $order,
                        $payment,
                        $itemDetails,
                    ];
                }
            );

            // Midtrans configuration
            Config::$serverKey = config('services.midtrans.server_key');
            Config::$isProduction = config('services.midtrans.is_production');
            Config::$isSanitized = true;
            Config::$is3ds = true;

            // Buat token Snap sekali agar percobaan ulang tidak membuat transaksi baru.
            $payment = DB::transaction(function () use ($payment, $itemDetails, $user) {
                $payment = Payment::query()
                    ->whereKey($payment->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($payment->snap_token !== null) {
                    return $payment;
                }

                $snapResponse = Snap::createTransaction([
                    'transaction_details' => [
                        'order_id' => $payment->provider_order_id,
                        'gross_amount' => (int) $payment->amount,
                    ],
                    'item_details' => $itemDetails,
                    'customer_details' => [
                        'first_name' => $user->name,
                        'email' => $user->email,
                    ],
                ]);

                $snapData = get_object_vars($snapResponse);
                $snapToken = $snapData['token'] ?? null;
                $redirectUrl = $snapData['redirect_url'] ?? null;

                if (! is_string($snapToken) || $snapToken === '') {
                    throw new \UnexpectedValueException('Midtrans did not return a Snap token.');
                }

                if ($redirectUrl !== null && ! is_string($redirectUrl)) {
                    throw new \UnexpectedValueException('Midtrans returned an invalid redirect URL.');
                }

                $payment->update([
                    'snap_token' => $snapToken,
                    'redirect_url' => $redirectUrl,
                ]);

                return $payment;
            });

            // Setelah transaksi berhasil dibuat, bersihkan item yang baru saja dipindahkan ke checkout.
            DB::transaction(function () use ($user, $validated) {
                $cart = Cart::query()
                    ->where('user_id', $user->id)
                    ->lockForUpdate()
                    ->first();

                if ($cart === null) {
                    return;
                }

                $cart->cart_items()
                    ->whereIn(
                        'product_id',
                        collect($validated['items'])->pluck('product_id')
                    )
                    ->delete();
            });

            return response()->json([
                'message' => 'Checkout initialized successfully.',
                'data' => [
                    'order_number' => $order->order_number,
                    'snap_token' => $payment->snap_token,
                    'redirect_url' => $payment->redirect_url,
                ],
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Unable to initialize checkout.',
            ], 500);
        }
    }

    /**
     * Memeriksa status transaksi langsung ke Midtrans untuk order milik pengguna aktif,
     * lalu menyimpan status pembayaran dan order jika hasilnya sudah terverifikasi.
     */
    public function confirmPayment(Request $req, MidtransPaymentService $payments): JsonResponse
    {
        $validated = $req->validate([
            'order_number' => ['required', 'string'],
        ]);
        $user = Auth::user();

        $order = Order::query()
            ->where('order_number', $validated['order_number'])
            ->where('user_id', $user->id)
            ->with('payment')
            ->firstOrFail();
        $payment = $order->payment;

        if ($payment === null) {
            return response()->json([
                'message' => 'Payment record not found.',
            ], 404);
        }

        if ($payment->status === PaymentStatus::Success) {
            return response()->json([
                'message' => 'Payment already confirmed.',
                'data' => ['status' => $payment->status->value],
            ]);
        }

        try {
            $transaction = $payments->verifyTransaction($payment);
            $status = $payments->synchronize($order, $payment, $transaction);

            if ($status !== PaymentStatus::Success) {
                return response()->json([
                    'message' => 'Midtrans has not confirmed a successful payment.',
                    'data' => [
                        'status' => $status->value ?? ($transaction['transaction_status'] ?? null),
                    ],
                ], 409);
            }

            return response()->json([
                'message' => 'Payment confirmed successfully.',
                'data' => ['status' => PaymentStatus::Success->value],
            ]);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Unable to verify payment with Midtrans.',
            ], 502);
        }
    }

    /**
     * Menampilkan halaman untuk melanjutkan pembayaran pada order milik pengguna aktif,
     * termasuk token Snap dan status pembayaran terakhir yang tersimpan.
     */
    public function pendingPayment(string $orderNumber)
    {
        $order = Order::query()
            ->where('order_number', $orderNumber)
            ->where('user_id', Auth::id())
            ->with('payment')
            ->firstOrFail();
        $payment = $order->payment;

        if ($payment === null) {
            abort(404);
        }

        return Inertia::render('checkout/pending-payment', [
            'orderNumber' => $order->order_number,
            'amount' => (float) $payment->amount,
            'snapToken' => $payment->snap_token,
            'paymentStatus' => $payment->status->value,
        ]);
    }

    /**
     * Menangani redirect selesai dari Midtrans. Parameter URL hanya dipakai untuk mencari
     * order milik pengguna; statusnya tetap diverifikasi ke Midtrans sebelum ditampilkan.
     */
    public function finish(Request $request, MidtransPaymentService $payments): InertiaResponse
    {
        $orderNumber = $request->query('order_id');

        if (
            ! is_string($orderNumber)
            || strlen($orderNumber) > 50
            || preg_match('/^[A-Za-z0-9-]+$/', $orderNumber) !== 1
        ) {
            return Inertia::render('payment/finish', [
                'result' => $this->unknownPaymentResult(),
            ]);
        }

        $order = Order::query()
            ->where('order_number', $orderNumber)
            ->where('user_id', Auth::id())
            ->with('payment')
            ->first();

        if ($order === null || $order->payment === null) {
            return Inertia::render('payment/finish', [
                'result' => $this->unknownPaymentResult(),
            ]);
        }

        $payment = $order->payment;
        $verified = false;

        try {
            // Status di URL berasal dari browser; hasil Midtrans diambil ulang di server.
            $transaction = $payments->verifyTransaction($payment);
            $synchronizedStatus = $payments->synchronize($order, $payment, $transaction);
            $payment->refresh();
            $verified = $synchronizedStatus !== null;
        } catch (Throwable $exception) {
            report($exception);
        }

        return Inertia::render('payment/finish', [
            'result' => $this->paymentResult($order, $payment, $verified),
        ]);
    }

    /**
     * Membatalkan transaksi pending setelah memastikan status terbaru ke Midtrans.
     * Jika pembayaran ternyata sudah berhasil, order dipertahankan dan tidak dibatalkan.
     */
    public function cancelPayment(string $orderNumber, MidtransPaymentService $payments): JsonResponse
    {
        $order = Order::query()
            ->where('order_number', $orderNumber)
            ->where('user_id', Auth::id())
            ->with('payment')
            ->firstOrFail();
        $payment = $order->payment;

        if ($payment === null) {
            return response()->json(['message' => 'Payment record not found.'], 404);
        }

        if ($payment->status === PaymentStatus::Success) {
            return response()->json([
                'message' => 'Pesanan ini sudah dibayar dan tidak dapat dibatalkan.',
                'status' => 'success',
            ], 409);
        }

        if ($payment->status !== PaymentStatus::Pending) {
            return response()->json([
                'message' => 'Transaksi ini sudah tidak dapat dibatalkan.',
                'status' => $payment->status->value,
            ], 409);
        }

        try {
            $transaction = $payments->verifyTransaction($payment);

            if ($payments->isPaidTransaction($transaction)) {
                $payments->synchronize($order, $payment, $transaction);

                return response()->json([
                    'message' => 'Pembayaran sudah berhasil. Pesanan tidak dibatalkan.',
                    'status' => 'success',
                ], 409);
            }

            if (! in_array($transaction['transaction_status'] ?? null, ['cancel', 'expire', 'deny', 'failure'], true)) {
                // Permintaan cancel belum membuktikan transaksi batal; cek statusnya lagi.
                Transaction::cancel($payment->provider_order_id);
                $transaction = $payments->verifyTransaction($payment);
            }

            if ($payments->isPaidTransaction($transaction)) {
                $payments->synchronize($order, $payment, $transaction);

                return response()->json([
                    'message' => 'Pembayaran sudah berhasil. Pesanan tidak dibatalkan.',
                    'status' => 'success',
                ], 409);
            }

            $transactionStatus = $transaction['transaction_status'] ?? null;
            if (! in_array($transactionStatus, ['cancel', 'expire', 'deny', 'failure'], true)) {
                return response()->json([
                    'message' => 'Midtrans belum mengonfirmasi pembatalan. Silakan coba lagi.',
                ], 502);
            }

            $paymentStatus = $payments->synchronize($order, $payment, $transaction);

            return response()->json([
                'message' => $paymentStatus === PaymentStatus::Canceled
                    ? 'Transaksi berhasil dibatalkan.'
                    : 'Status pembayaran telah diperbarui.',
                'status' => $paymentStatus->value ?? $transactionStatus,
            ]);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Transaksi gagal dibatalkan. Silakan coba lagi.',
            ], 502);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function paymentResult(Order $order, Payment $payment, bool $verified): array
    {
        $status = ! $verified && $payment->status !== PaymentStatus::Success
            ? 'unknown'
            : $payment->status->value;

        return [
            'order_id' => $order->order_number,
            'status' => $status,
            'status_label' => match ($status) {
                'success' => 'Pembayaran berhasil',
                'pending' => 'Menunggu pembayaran',
                'failed' => 'Pembayaran gagal',
                'canceled' => 'Pembayaran dibatalkan',
                'expired' => 'Pembayaran kedaluwarsa',
                default => 'Status pembayaran sedang diperiksa',
            },
            'amount' => (float) $payment->amount,
            'payment_method' => $payment->method,
            'paid_at' => $payment->paid_at?->toISOString(),
            'order_url' => $payment->status === PaymentStatus::Pending
                ? '/checkout/payment/'.rawurlencode($order->order_number)
                : '/profile#orders',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function unknownPaymentResult(): array
    {
        return [
            'order_id' => null,
            'status' => 'unknown',
            'status_label' => 'Status pembayaran sedang diperiksa',
            'amount' => null,
            'payment_method' => null,
            'paid_at' => null,
            'order_url' => null,
        ];
    }
}
