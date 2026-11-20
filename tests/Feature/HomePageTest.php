<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

test('homepage calculates review count and average rating per featured product', function () {
    $owner = User::factory()->create(['role' => UserRole::Admin]);
    $customer = User::factory()->create(['role' => UserRole::Pelanggan]);
    $category = Category::query()->create([
        'name' => 'Kategori Beranda '.Str::random(8),
        'description' => 'Kategori homepage test.',
    ]);
    $product = Product::query()->create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'slug' => Str::uuid()->toString(),
        'name' => 'Produk Beranda',
        'description' => 'Produk untuk menguji ringkasan ulasan.',
        'price' => 10000,
        'stock' => 5,
    ]);

    foreach ([4, 5] as $rating) {
        $order = Order::query()->create([
            'order_number' => 'HOME-'.Str::upper(Str::random(12)),
            'user_id' => $customer->id,
            'total_price' => 10000,
            'shipping_address' => 'Alamat pengujian',
            'status' => OrderStatus::Completed,
        ]);
        Review::query()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'order_id' => $order->id,
            'rating' => $rating,
            'title' => 'Ulasan produk',
            'content' => 'Produk sesuai deskripsi dan diterima dengan baik.',
        ]);
    }

    $unreviewedProduct = Product::query()->create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'slug' => Str::uuid()->toString(),
        'name' => 'Produk Tanpa Ulasan',
        'description' => 'Produk yang belum mendapat ulasan.',
        'price' => 15000,
        'stock' => 3,
    ]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->where('products.0.id', $product->id)
            ->where('products.0.reviews_count', 2)
            ->where('products.0.reviews_avg_rating', 4.5)
            ->where('products.1.id', $unreviewedProduct->id)
            ->where('products.1.reviews_count', 0)
            ->where('products.1.reviews_avg_rating', null)
            ->missing('review'));
});

test('homepage returns empty review aggregates for products without reviews', function () {
    $owner = User::factory()->create(['role' => UserRole::Admin]);
    $category = Category::query()->create([
        'name' => 'Kategori Tanpa Ulasan',
        'description' => 'Kategori homepage test.',
    ]);
    $product = Product::query()->create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'slug' => Str::uuid()->toString(),
        'name' => 'Produk Belum Diulas',
        'description' => 'Belum ada ulasan.',
        'price' => 15000,
        'stock' => 3,
    ]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->where('products.0.id', $product->id)
            ->where('products.0.reviews_count', 0)
            ->where('products.0.reviews_avg_rating', null));
});
