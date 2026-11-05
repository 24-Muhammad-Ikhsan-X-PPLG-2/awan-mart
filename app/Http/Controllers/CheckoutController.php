<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index(Request $req)
    {
        $validated = $req->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|distinct',
            'items.*.quantity' => 'required|integer|min:1'
        ]);
        $products = Product::query()->with([
            'category',
            'product_images'
        ])->whereIn('id', collect($validated['items'])->pluck('product_id'))->get();
        if ($products->count() !== count($validated['items'])) {
            return redirect()->to('/cart')->withErrors([
                'message' => 'Beberapa produk tidak ditemukan.'
            ]);
        }

        $items = collect($validated['items'])->map(function ($item) use ($products) {
            $product = $products->firstWhere('id', $item['product_id']);

            if ($item['quantity'] > $product->stock) {
                return redirect()->to('/cart')->withErrors([
                    'message' => "Stok {$product->name} tidak mencukupi."
                ]);
            }

            return [
                'product' => $product,
                'quantity' => $item['quantity'],
                'subtotal' => $product->price * $item['quantity'],
            ];
        });
        return Inertia::render('checkout', [
            'items' => $items->values()
        ]);
    }
}
