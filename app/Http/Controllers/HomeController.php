<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;


class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('home');
    }
    public function product(Product $product)
    {
        return Inertia::render('product_detail', [
            'product' => $product->with([
                'category',
                'product_images'
            ])->first()
        ]);
    }
}
