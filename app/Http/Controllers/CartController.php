<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function cart_view()
    {
        $user = Auth::user();
        $checkCart = Cart::query()->where('user_id', '=', $user->id)->first();
        if (!$checkCart) {
            $checkCart = Cart::query()->create([
                'user_id' => $user->id
            ]);
        }
        $cart = $checkCart->with([
            'cart_items' => [
                'product' => [
                    'category',
                    'product_images',
                ]
            ]
        ])->get()->where('user_id', '=', $user->id)->first();
        if (!$cart) {
            $cart = Cart::query()->create([
                'user_id' => $user->id
            ])->with([
                'cart_items' => [
                    'product' => [
                        'product_images',
                        'category'
                    ]
                ]
            ])->get()->first();
        }
        return Inertia::render('cart', [
            'dataCart' => $cart->cart_items
        ]);
    }
    public function cart_count(): string
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->to('/auth/login');
        }
        $count = $user->cart->cart_items()->sum('quantity');
        return $count > 99 ? '99+' : (string) $count;
    }
    public function cart_delete(Request $req)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->to('/auth/login');
        }
        $validated = $req->validate([
            'ids' => 'array|required',
            'ids.*' => 'required|integer|exists:cart_items,id'
        ]);
        CartItem::whereIn('id', $validated['ids'])->whereHas('cart', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->delete();
        return redirect()->back();
    }
    public function cart_update(Request $req, CartItem $cartItem)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->to('/auth/login');
        }
        $cart = Cart::query()->where('user_id', '=', $user->id)->first();
        if (!$cart) {
            $cart = Cart::query()->create([
                'user_id' => $user->id
            ]);
        }
        $cartItem = $cart->cart_items()->whereKey($cartItem->id)->firstOrFail();
        $validated = $req->validate([
            'quantity' => 'required|integer|min:1|max:' . $cartItem->product->stock
        ]);
        $cartItem->update([
            'quantity' => $validated['quantity']
        ]);
        return redirect()->back();
    }
    public function cart_add(Request $req)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->to('/auth/login');
        }
        $validated = $req->validate([
            'product_id' => 'required|integer|distinct|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);
        $cart = Cart::query()->where('user_id', '=', $user->id)->first();
        if (!$cart) {
            $cart = Cart::query()->create([
                'user_id' => $user->id
            ]);
        }
        $cartItem = $cart->cart_items()->where('product_id', '=', $validated['product_id'])->lockForUpdate()->first();
        if ($cartItem) {
            $cartItem->increment('quantity', $validated['quantity']);
        } else {
            $cart->cart_items()->create($validated);
        }
        return redirect()->back();
    }
    public function cart_add_bulk(Request $req)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->to('/auth/login');
        }
        $validated = $req->validate([
            'items' => 'array|required|min:1',
            'items.*.product_id' => 'required|integer|distinct|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);
        $cart = Cart::query()->where('user_id', '=', $user->id)->first();
        if (!$cart) {
            $cart = Cart::query()->create([
                'user_id' => $user->id
            ]);
        }
        DB::transaction(function () use ($cart, $validated) {
            foreach ($validated['items'] as $item) {
                $cartItem = $cart->cart_items()->where('product_id', '=', $item['product_id'])->lockForUpdate()->first();
                if ($cartItem) {
                    $cartItem->increment('quantity', $item['quantity']);
                } else {
                    $cart->cart_items()->create($item);
                }
            }
        });
        return redirect()->back();
    }
}
