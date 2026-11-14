<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\MidtransPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class MidtransNotificationController extends Controller
{
    public function __invoke(Request $request, MidtransPaymentService $payments): JsonResponse
    {
        $payload = $request->json()->all();

        try {
            if (! $payments->hasValidNotificationSignature($payload)) {
                return response()->json(['message' => 'Invalid notification signature.'], 403);
            }

            $orderId = $payload['order_id'];
            $payment = Payment::query()
                ->where('provider', 'midtrans')
                ->where('provider_order_id', $orderId)
                ->with('order')
                ->first();

            if ($payment === null || $payment->order === null) {
                return response()->json(['message' => 'Payment not found.'], 404);
            }

            $transaction = $payments->verifyTransaction($payment);
            $payments->synchronize($payment->order, $payment, $transaction);

            return response()->json(['message' => 'Notification processed.']);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json(['message' => 'Unable to process notification.'], 502);
        }
    }
}
