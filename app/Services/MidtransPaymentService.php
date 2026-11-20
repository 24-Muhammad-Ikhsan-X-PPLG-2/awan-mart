<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Payment;
use App\Models\PaymentStatus;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;
use RuntimeException;
use UnexpectedValueException;

class MidtransPaymentService
{
    /**
     * @param  array<string, mixed>  $parameters
     */
    public function createSnapTransaction(array $parameters): object
    {
        $this->configure();
        Config::$isSanitized = true;
        Config::$is3ds = true;

        return Snap::createTransaction($parameters);
    }

    /**
     * @return array<string, mixed>
     */
    public function verifyTransaction(Payment $payment): array
    {
        $this->configure();

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
            throw new UnexpectedValueException('Midtrans transaction details do not match this order.');
        }

        return $data;
    }

    /**
     * Apply a status returned by Midtrans to the related payment and order.
     *
     * @param  array<string, mixed>  $transaction
     */
    public function synchronize(Order $order, Payment $payment, array $transaction): ?PaymentStatus
    {
        $paymentStatus = $this->mapStatus(
            $transaction['transaction_status'] ?? null,
            $transaction['fraud_status'] ?? null
        );

        if ($paymentStatus === null) {
            return $payment->status === PaymentStatus::Success
                ? PaymentStatus::Success
                : null;
        }

        return DB::transaction(function () use ($order, $payment, $paymentStatus, $transaction) {
            $lockedPayment = Payment::query()
                ->whereKey($payment->id)
                ->lockForUpdate()
                ->firstOrFail();
            $lockedOrder = Order::query()
                ->whereKey($order->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedPayment->status === PaymentStatus::Success) {
                return PaymentStatus::Success;
            }

            if (
                $paymentStatus === PaymentStatus::Pending
                && in_array($lockedPayment->status, [
                    PaymentStatus::Failed,
                    PaymentStatus::Expired,
                    PaymentStatus::Canceled,
                ], true)
            ) {
                return $lockedPayment->status;
            }

            $attributes = [
                'status' => $paymentStatus,
                'transaction_status' => $transaction['transaction_status'] ?? null,
                'fraud_status' => $transaction['fraud_status'] ?? null,
            ];

            foreach ([
                'transaction_id' => 'transaction_id',
                'method' => 'payment_type',
            ] as $attribute => $transactionKey) {
                if (isset($transaction[$transactionKey]) && is_string($transaction[$transactionKey])) {
                    $attributes[$attribute] = $transaction[$transactionKey];
                }
            }

            if ($paymentStatus === PaymentStatus::Success) {
                $this->deductOrderStock($lockedOrder);
                $attributes['paid_at'] = $lockedPayment->paid_at ?? now();
            }

            if ($paymentStatus === PaymentStatus::Expired) {
                $attributes['expired_at'] = $lockedPayment->expired_at ?? now();
            }

            $lockedPayment->update($attributes);

            if (
                $paymentStatus === PaymentStatus::Success
                && in_array($lockedOrder->status, [
                    OrderStatus::PendingPayment,
                    OrderStatus::Canceled,
                ], true)
            ) {
                $lockedOrder->update(['status' => OrderStatus::Processing]);
            } elseif (
                in_array($paymentStatus, [
                    PaymentStatus::Failed,
                    PaymentStatus::Expired,
                    PaymentStatus::Canceled,
                ], true)
                && $lockedOrder->status === OrderStatus::PendingPayment
            ) {
                $lockedOrder->update(['status' => OrderStatus::Canceled]);
            }

            return $paymentStatus;
        });
    }

    private function deductOrderStock(Order $order): void
    {
        $items = $order->orderItems()
            ->select('product_id')
            ->selectRaw('SUM(quantity) as quantity')
            ->groupBy('product_id')
            ->orderBy('product_id')
            ->lockForUpdate()
            ->get();

        if ($items->isEmpty()) {
            throw new RuntimeException("Cannot deduct stock for order {$order->order_number}: no order items found.");
        }

        foreach ($items as $item) {
            $product = Product::query()
                ->whereKey($item->product_id)
                ->lockForUpdate()
                ->firstOrFail();
            $quantity = (int) $item->quantity;

            if ($product->stock < $quantity) {
                throw new RuntimeException(
                    "Insufficient stock to fulfill order {$order->order_number} for product {$product->id}."
                );
            }

            $product->decrement('stock', $quantity);
        }
    }

    /**
     * Validate the signature key sent by a Midtrans notification.
     *
     * @param  array<string, mixed>  $payload
     */
    public function hasValidNotificationSignature(array $payload): bool
    {
        $orderId = $payload['order_id'] ?? null;
        $statusCode = $payload['status_code'] ?? null;
        $grossAmount = $payload['gross_amount'] ?? null;
        $signature = $payload['signature_key'] ?? null;
        $serverKey = config('services.midtrans.server_key');

        if (! is_string($serverKey) || $serverKey === '') {
            throw new RuntimeException('Midtrans server key is not configured.');
        }

        if (
            ! is_string($orderId)
            || ! is_string($statusCode)
            || ! is_string($grossAmount)
            || ! is_string($signature)
        ) {
            return false;
        }

        $expected = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

        return hash_equals($expected, $signature);
    }

    /**
     * @param  array<string, mixed>  $transaction
     */
    public function isPaidTransaction(array $transaction): bool
    {
        return ($transaction['transaction_status'] ?? null) === 'settlement'
            || (
                ($transaction['transaction_status'] ?? null) === 'capture'
                && ($transaction['fraud_status'] ?? null) === 'accept'
            );
    }

    private function configure(): void
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
    }

    private function mapStatus(mixed $transactionStatus, mixed $fraudStatus): ?PaymentStatus
    {
        if ($transactionStatus === 'settlement') {
            return PaymentStatus::Success;
        }

        if ($transactionStatus === 'capture') {
            return match ($fraudStatus) {
                'accept' => PaymentStatus::Success,
                'deny' => PaymentStatus::Failed,
                default => PaymentStatus::Pending,
            };
        }

        return match ($transactionStatus) {
            'pending' => PaymentStatus::Pending,
            'deny', 'failure' => PaymentStatus::Failed,
            'cancel' => PaymentStatus::Canceled,
            'expire' => PaymentStatus::Expired,
            default => null,
        };
    }
}
