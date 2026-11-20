<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Throwable;

class ReviewController extends Controller
{
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'integer'],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'title' => ['required', 'string', 'min:4', 'max:150'],
            'content' => ['required', 'string', 'min:20', 'max:2000'],
            'images' => ['nullable', 'array', 'max:3'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $user = $request->user();
        abort_unless($user instanceof User, 403);

        $storedImages = [];

        try {
            $review = DB::transaction(function () use (
                $validated,
                $user,
                $request,
                &$storedImages
            ) {
                $order = Order::query()
                    ->whereKey($validated['order_id'])
                    ->where('user_id', $user->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($order->status !== OrderStatus::Completed) {
                    throw ValidationException::withMessages([
                        'order_id' => 'Ulasan hanya dapat diberikan untuk pesanan yang sudah selesai.',
                    ]);
                }

                $containsProduct = $order->orderItems()
                    ->where('product_id', $validated['product_id'])
                    ->exists();

                if (! $containsProduct) {
                    throw ValidationException::withMessages([
                        'product_id' => 'Produk ini tidak ditemukan dalam pesanan tersebut.',
                    ]);
                }

                if ($order->reviews()
                    ->where('product_id', $validated['product_id'])
                    ->exists()) {
                    throw ValidationException::withMessages([
                        'product_id' => 'Produk pada pesanan ini sudah pernah diulas.',
                    ]);
                }

                foreach ($request->file('images', []) as $image) {
                    $path = $image->store('reviews', 'public');

                    if ($path === false) {
                        throw new RuntimeException('Gagal menyimpan gambar ulasan.');
                    }

                    $storedImages[] = $path;
                }

                return Review::query()->create([
                    'user_id' => $user->id,
                    'product_id' => $validated['product_id'],
                    'order_id' => $order->id,
                    'rating' => $validated['rating'],
                    'title' => trim($validated['title']),
                    'content' => trim($validated['content']),
                    'images' => $storedImages,
                ])->load('user.pelanggan');
            });
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($storedImages);
            throw $exception;
        }

        $reviewData = [
            'id' => $review->id,
            'name' => $review->user->pelanggan?->name ?? 'Pelanggan',
            'rating' => $review->rating,
            'title' => $review->title,
            'content' => $review->content,
            'images' => collect($review->images ?? [])
                ->map(fn (string $path) => asset('storage/'.$path))
                ->all(),
            'date' => $review->created_at?->toISOString() ?? '',
        ];

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Ulasan berhasil dikirim.',
                'review' => $reviewData,
            ], 201);
        }

        return back()->with('success', 'Ulasan berhasil dikirim.');
    }
}
