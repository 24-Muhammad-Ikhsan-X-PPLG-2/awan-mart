<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;


class HomeController extends Controller
{
    public function index()
    {
        $products = Product::all()->load([
            'category',
            'product_images'
        ]);
        return Inertia::render('home', [
            'products' => $products
        ]);
    }
    public function product(Product $product)
    {
        $product->load([
            'category',
            'product_images'
        ]);
        return Inertia::render('product_detail', [
            'product' => $product
        ]);
    }
}
