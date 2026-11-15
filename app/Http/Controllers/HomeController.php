<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
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
            'product_images'
        ]);

        return Inertia::render('product_detail', [
            'product' => $product
        ]);
    }
}
