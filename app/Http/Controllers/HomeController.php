<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Inertia\Inertia;

/**
 * Controller yang menangani halaman depan dan detail produk publik.
 */
class HomeController extends Controller
{
    /**
     * Menampilkan produk utama dan kategori unggulan di landing page.
     */
    public function index()
    {
        // Ambil produk paling relevan di landing page: product + kategori + gambar.
        $products = Product::with([
            'category',
            'product_images'
        ])->limit(4)->get();

        // Kategori ini dipakai untuk navigasi cepat di halaman depan.
        $categories = Category::limit(7)->get();

        return Inertia::render('home', [
            'products' => $products,
            'categories' => $categories
        ]);
    }

    /**
     * Menampilkan halaman detail satu produk yang dipilih.
     */
    public function product(Product $product)
    {
        // Load relasi yang diperlukan supaya frontend bisa menampilkan data lengkap.
        $product->load([
            'category',
            'product_images',
        ]);

        $reviews = $product->reviews()
            ->with('user.pelanggan')
            ->latest()
            ->get()
            ->map(function (Review $review) {
                $name = $review->user->pelanggan?->name ?? 'Pelanggan';
                $initials = collect(preg_split('/\s+/', trim($name)) ?: [])
                    ->filter()
                    ->take(2)
                    ->map(fn (string $part) => mb_substr($part, 0, 1))
                    ->implode('');

                return [
                    'id' => (string) $review->id,
                    'name' => $name,
                    'initials' => mb_strtoupper($initials),
                    'avatarColor' => 'bg-[#526B91]',
                    'rating' => $review->rating,
                    'date' => $review->created_at?->toISOString() ?? '',
                    'title' => $review->title,
                    'content' => $review->content,
                    'images' => collect($review->images ?? [])
                        ->map(fn (string $path) => asset('storage/'.$path))
                        ->all(),
                ];
            });
        $totalReviews = $reviews->count();
        $distribution = collect(range(1, 5))
            ->mapWithKeys(fn (int $rating) => [
                $rating => $reviews->where('rating', $rating)->count(),
            ])
            ->all();

        return Inertia::render('product_detail', [
            'product' => $product,
            'reviews' => $reviews,
            'reviewSummary' => [
                'total' => $totalReviews,
                'average' => $totalReviews
                    ? $reviews->sum('rating') / $totalReviews
                    : 0,
                'distribution' => $distribution,
            ],
        ]);
    }
}
