<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\Pelanggan;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function createReviewSubmissionFixture(OrderStatus $status = OrderStatus::Completed): array
{
    $customer = User::factory()->create(['role' => UserRole::Pelanggan]);
    Pelanggan::query()->create([
        'user_id' => $customer->id,
        'name' => 'Pelanggan Ulasan',
    ]);

    $category = Category::query()->create([
        'name' => 'Kategori Ulasan '.Str::random(8),
        'description' => 'Kategori pengujian ulasan.',
    ]);
    $product = Product::query()->create([
        'user_id' => $customer->id,
        'category_id' => $category->id,
        'slug' => Str::uuid()->toString(),
        'name' => 'Produk Ulasan',
        'description' => 'Produk untuk pengujian ulasan.',
        'price' => 10000,
        'stock' => 5,
    ]);
    $order = Order::query()->create([
        'order_number' => 'REVIEW-'.Str::upper(Str::random(10)),
        'user_id' => $customer->id,
        'total_price' => 10000,
        'shipping_address' => 'Jl. Pengujian No. 1',
        'status' => $status,
    ]);
    OrderItem::query()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'price' => 10000,
    ]);

    return [$customer, $product, $order];
}

test('a customer can submit one review for a product in a completed order', function () {
    [$customer, $product, $order] = createReviewSubmissionFixture();

    $this->actingAs($customer)
        ->postJson('/reviews', [
            'order_id' => $order->id,
            'product_id' => $product->id,
            'rating' => 5,
            'title' => 'Kualitas sangat baik',
            'content' => 'Produk diterima dengan baik dan kualitasnya sesuai deskripsi.',
        ])
        ->assertCreated()
        ->assertJsonPath('review.name', 'Pelanggan Ulasan')
        ->assertJsonPath('review.rating', 5)
        ->assertJsonMissingPath('review.verified');

    expect(Review::query()->count())->toBe(1);
});

test('a customer cannot review a product before the order is completed', function () {
    [$customer, $product, $order] = createReviewSubmissionFixture(OrderStatus::Shipped);

    $this->actingAs($customer)
        ->from('/profile')
        ->post('/reviews', [
            'order_id' => $order->id,
            'product_id' => $product->id,
            'rating' => 4,
            'title' => 'Produk cukup bagus',
            'content' => 'Saya akan memberikan ulasan setelah pesanan selesai.',
        ])
        ->assertRedirect('/profile')
        ->assertSessionHasErrors('order_id');

    expect(Review::query()->count())->toBe(0);
});

test('a customer cannot review a product that was not included in the order', function () {
    [$customer, , $order] = createReviewSubmissionFixture();
    $otherProduct = Product::query()->create([
        'user_id' => $customer->id,
        'category_id' => Category::query()->firstOrFail()->id,
        'slug' => Str::uuid()->toString(),
        'name' => 'Produk Lain',
        'description' => 'Produk lain untuk pengujian ulasan.',
        'price' => 10000,
        'stock' => 5,
    ]);

    $this->actingAs($customer)
        ->postJson('/reviews', [
            'order_id' => $order->id,
            'product_id' => $otherProduct->id,
            'rating' => 4,
            'title' => 'Produk cukup bagus',
            'content' => 'Produk ini tidak termasuk dalam pesanan tersebut.',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('product_id');

    expect(Review::query()->count())->toBe(0);
});

test('a customer cannot submit a second review for the same product and order', function () {
    [$customer, $product, $order] = createReviewSubmissionFixture();
    Review::query()->create([
        'user_id' => $customer->id,
        'product_id' => $product->id,
        'order_id' => $order->id,
        'rating' => 4,
        'title' => 'Ulasan pertama',
        'content' => 'Ulasan pertama yang sudah tersimpan.',
    ]);

    $this->actingAs($customer)
        ->postJson('/reviews', [
            'order_id' => $order->id,
            'product_id' => $product->id,
            'rating' => 5,
            'title' => 'Ulasan berikutnya',
            'content' => 'Ulasan kedua untuk produk pada pesanan yang sama.',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('product_id');

    expect(Review::query()->count())->toBe(1);
});
