<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/**
 * Controller yang mengelola keranjang belanja user.
 *
 * Logika di sini fokus pada satu hal: memastikan keranjang selalu ada untuk user,
 * lalu menambah, mengubah, dan menghapus item dengan validasi yang aman.
 */
class CartController extends Controller
{
    /**
     * Menampilkan isi keranjang aktif user dengan relasi produk dan gambar.
     */
    public function cart_view()
    {
        $user = Auth::user();

        // Pastikan cart ada, karena user baru bisa saja belum punya record cart.
        $checkCart = Cart::query()->where('user_id', '=', $user->id)->first();
        if (!$checkCart) {
            $checkCart = Cart::query()->create([
                'user_id' => $user->id
            ]);
        }

        // Mengambil cart beserta item dan relasi produk yang dibutuhkan oleh frontend.
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

    /**
     * Mengembalikan jumlah item di keranjang untuk badge navbar.
     */
    public function cart_count(): string
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return redirect()->to('/auth/login');
            }

            $count = $user->cart->cart_items()->sum('quantity');

            return $count > 99 ? '99+' : (string) $count;
        } catch (\Exception $e) {
            report($e);

            return "0";
        }
    }

    /**
     * Hapus beberapa item keranjang milik user yang sedang login.
     */
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

        // Pastikan item yang dihapus memang milik cart user yang sama.
        CartItem::whereIn('id', $validated['ids'])->whereHas('cart', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->delete();

        return redirect()->back();
    }

    /**
     * Memperbarui jumlah satu item di keranjang.
     */
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

        // Pastikan item yang diedit benar-benar berasal dari cart user login.
        $cartItem = $cart->cart_items()->whereKey($cartItem->id)->firstOrFail();
        $validated = $req->validate([
            'quantity' => 'required|integer|min:1|max:' . $cartItem->product->stock
        ]);

        $cartItem->update([
            'quantity' => $validated['quantity']
        ]);

        return redirect()->back();
    }

    /**
     * Menambah satu item ke keranjang user.
     */
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

        // Jika produk sudah ada di cart, cukup tambah quantity; jika belum, buat item baru.
        $cartItem = $cart->cart_items()->where('product_id', '=', $validated['product_id'])->lockForUpdate()->first();
        if ($cartItem) {
            $cartItem->increment('quantity', $validated['quantity']);
        } else {
            $cart->cart_items()->create($validated);
        }

        return redirect()->back();
    }

    /**
     * Menambah beberapa item sekaligus dengan lock transaksi untuk mencegah race condition.
     */
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
                // Untuk setiap produk, lock satu row item cart agar tidak terjadi double increment.
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
