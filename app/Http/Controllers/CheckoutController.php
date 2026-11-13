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
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;
use Throwable;

class CheckoutController extends Controller
{
    private const SHIPPING_COST = 15000;

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

                    // Gunakan kembali order pending dengan alamat dan item yang sama.
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

            // Hapus hanya produk yang berhasil masuk ke checkout ini.
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

    public function confirmPayment(Request $req): JsonResponse
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
            Config::$serverKey = config('services.midtrans.server_key');
            Config::$isProduction = config('services.midtrans.is_production');

            // Verifikasi status ke Midtrans; callback browser tidak dijadikan sumber kebenaran.
            $statusResponse = Transaction::status($payment->provider_order_id);
            $statusData = json_decode(
                json_encode($statusResponse, JSON_THROW_ON_ERROR),
                true,
                flags: JSON_THROW_ON_ERROR
            );

            if (! is_array($statusData)) {
                throw new \UnexpectedValueException('Midtrans returned an invalid transaction status.');
            }

            if (
                ($statusData['order_id'] ?? null) !== $payment->provider_order_id
                || ! is_numeric($statusData['gross_amount'] ?? null)
                || (int) round((float) $statusData['gross_amount']) !== (int) round((float) $payment->amount)
            ) {
                return response()->json([
                    'message' => 'Midtrans transaction details do not match this order.',
                ], 422);
            }

            $transactionStatus = $statusData['transaction_status'] ?? null;
            $fraudStatus = $statusData['fraud_status'] ?? null;
            $isPaid = $transactionStatus === 'settlement'
                || ($transactionStatus === 'capture' && $fraudStatus === 'accept');

            if (! $isPaid) {
                return response()->json([
                    'message' => 'Midtrans has not confirmed a successful payment.',
                    'data' => ['status' => $transactionStatus],
                ], 409);
            }

            // Simpan status pembayaran dan order secara atomik.
            DB::transaction(function () use ($order, $payment, $statusData, $transactionStatus, $fraudStatus) {
                $lockedPayment = Payment::query()
                    ->whereKey($payment->id)
                    ->lockForUpdate()
                    ->firstOrFail();
                $lockedOrder = Order::query()
                    ->whereKey($order->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($lockedPayment->status === PaymentStatus::Success) {
                    return;
                }

                $lockedPayment->update([
                    'status' => PaymentStatus::Success,
                    'transaction_id' => $statusData['transaction_id'] ?? null,
                    'method' => $statusData['payment_type'] ?? null,
                    'transaction_status' => $transactionStatus,
                    'fraud_status' => $fraudStatus,
                    'paid_at' => now(),
                ]);
                if ($lockedOrder->status === OrderStatus::PendingPayment) {
                    $lockedOrder->update([
                        'status' => OrderStatus::Processing,
                    ]);
                }
            });

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

    public function cancelPayment(string $orderNumber): JsonResponse
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
            Config::$serverKey = config('services.midtrans.server_key');
            Config::$isProduction = config('services.midtrans.is_production');

            $transaction = $this->getVerifiedMidtransStatus($payment);

            if ($this->isPaidTransaction($transaction)) {
                $this->markPaymentSuccessful($order, $payment, $transaction);

                return response()->json([
                    'message' => 'Pembayaran sudah berhasil. Pesanan tidak dibatalkan.',
                    'status' => 'success',
                ], 409);
            }

            if (! in_array($transaction['transaction_status'] ?? null, ['cancel', 'expire', 'deny'], true)) {
                Transaction::cancel($payment->provider_order_id);
                $transaction = $this->getVerifiedMidtransStatus($payment);
            }

            if ($this->isPaidTransaction($transaction)) {
                $this->markPaymentSuccessful($order, $payment, $transaction);

                return response()->json([
                    'message' => 'Pembayaran sudah berhasil. Pesanan tidak dibatalkan.',
                    'status' => 'success',
                ], 409);
            }

            $transactionStatus = $transaction['transaction_status'] ?? null;
            if (! in_array($transactionStatus, ['cancel', 'expire', 'deny'], true)) {
                return response()->json([
                    'message' => 'Midtrans belum mengonfirmasi pembatalan. Silakan coba lagi.',
                ], 502);
            }

            $paymentStatus = match ($transactionStatus) {
                'expire' => PaymentStatus::Expired,
                'deny' => PaymentStatus::Failed,
                default => PaymentStatus::Canceled,
            };

            DB::transaction(function () use ($order, $payment, $paymentStatus, $transaction) {
                $lockedPayment = Payment::query()
                    ->whereKey($payment->id)
                    ->lockForUpdate()
                    ->firstOrFail();
                $lockedOrder = Order::query()
                    ->whereKey($order->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($lockedPayment->status === PaymentStatus::Success) {
                    return;
                }

                $lockedPayment->update([
                    'status' => $paymentStatus,
                    'transaction_status' => $transaction['transaction_status'],
                    'fraud_status' => $transaction['fraud_status'] ?? null,
                ]);
                if ($lockedOrder->status === OrderStatus::PendingPayment) {
                    $lockedOrder->update(['status' => OrderStatus::Canceled]);
                }
            });

            return response()->json([
                'message' => 'Transaksi berhasil dibatalkan.',
                'status' => $paymentStatus->value,
            ]);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Transaksi gagal dibatalkan. Silakan coba lagi.',
            ], 502);
        }
    }

    private function getVerifiedMidtransStatus(Payment $payment): array
    {
        $response = Transaction::status($payment->provider_order_id);
        $data = json_decode(
            json_encode($response, JSON_THROW_ON_ERROR),
            true,
            flags: JSON_THROW_ON_ERROR
        );

        if (
            ! is_array($data)
            || ($data['order_id'] ?? null) !== $payment->provider_order_id
            || ! is_numeric($data['gross_amount'] ?? null)
            || (int) round((float) $data['gross_amount']) !== (int) round((float) $payment->amount)
        ) {
            throw new \UnexpectedValueException('Midtrans transaction details do not match this order.');
        }

        return $data;
    }

    private function isPaidTransaction(array $transaction): bool
    {
        return ($transaction['transaction_status'] ?? null) === 'settlement'
            || (
                ($transaction['transaction_status'] ?? null) === 'capture'
                && ($transaction['fraud_status'] ?? null) === 'accept'
            );
    }

    private function markPaymentSuccessful(Order $order, Payment $payment, array $transaction): void
    {
        DB::transaction(function () use ($order, $payment, $transaction) {
            $lockedPayment = Payment::query()
                ->whereKey($payment->id)
                ->lockForUpdate()
                ->firstOrFail();
            $lockedOrder = Order::query()
                ->whereKey($order->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedPayment->status === PaymentStatus::Success) {
                return;
            }

            $lockedPayment->update([
                'status' => PaymentStatus::Success,
                'transaction_id' => $transaction['transaction_id'] ?? null,
                'method' => $transaction['payment_type'] ?? null,
                'transaction_status' => $transaction['transaction_status'],
                'fraud_status' => $transaction['fraud_status'] ?? null,
                'paid_at' => now(),
            ]);
            if ($lockedOrder->status === OrderStatus::PendingPayment) {
                $lockedOrder->update(['status' => OrderStatus::Processing]);
            }
        });
    }
}
