<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\MidtransPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

/**
 * Endpoint callback dari Midtrans untuk sinkronisasi status pembayaran.
 *
 * Endpoint ini dipanggil oleh server Midtrans setelah transaksi berubah status,
 * sehingga aplikasi perlu memvalidasi signature, membuka data order terkait,
 * lalu memperbarui status pembayaran dan order sesuai hasil validasi.
 */
class MidtransNotificationController extends Controller
{
    /**
     * Memproses notifikasi Midtrans dan menyinkronkan status pembayaran ke local app.
     */
    public function __invoke(Request $request, MidtransPaymentService $payments): JsonResponse
    {
        // Payload JSON dari Midtrans tidak bisa diandalkan jika belum diverifikasi.
        $payload = $request->json()->all();

        try {
            // Pertama: validasi signature agar notifikasi tidak dipalsukan.
            if (! $payments->hasValidNotificationSignature($payload)) {
                return response()->json(['message' => 'Invalid notification signature.'], 403);
            }

            $orderId = $payload['order_id'];
            $payment = Payment::query()
                ->where('provider', 'midtrans')
                ->where('provider_order_id', $orderId)
                ->with('order')
                ->first();

            // Jika order tidak ditemukan, botol notifikasi tidak bisa diproses lebih lanjut.
            if ($payment === null || $payment->order === null) {
                return response()->json(['message' => 'Payment not found.'], 404);
            }

            // Lanjutkan verifikasi transaksi dan sinkronisasi status local.
            $transaction = $payments->verifyTransaction($payment);
            $payments->synchronize($payment->order, $payment, $transaction);

            return response()->json(['message' => 'Notification processed.']);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json(['message' => 'Unable to process notification.'], 502);
        }
    }
}
