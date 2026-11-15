<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;

/**
 * Controller yang menangani data kategori untuk halaman pelanggan maupun AJAX.
 */
class CategoryController extends Controller
{
    /**
     * Mengambil daftar kategori singkat untuk kebutuhan API ringan.
     *
     * Biasanya dipakai saat halaman lain butuh daftar kategori dengan jumlah
     * terbatas tanpa harus memuat seluruh halaman Inertia.
     */
    public function get()
    {
        $categories = Category::limit(6)->get();

        return response()->json([
            'categories' => $categories,
            'message' => 'Success',
        ]);
    }

    /**
     * Menampilkan halaman list kategori yang sudah dihitung jumlah produknya.
     */
    public function view()
    {
        $categories = Category::query()
            ->withCount('products')
            ->orderBy('name')
            ->get();

        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }
}
