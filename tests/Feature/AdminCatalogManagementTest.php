<?php

use App\Models\Admin;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Pelanggan;
use App\Models\Product;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function createCatalogAdmin(): User
{
    $user = User::factory()->create(['role' => UserRole::Admin]);
    Admin::query()->create([
        'user_id' => $user->id,
        'name' => 'Admin Katalog',
    ]);

    return $user;
}

function createCatalogCategory(string $name = 'Kategori Katalog'): Category
{
    return Category::query()->create([
        'name' => $name.' '.Str::random(6),
        'description' => 'Kategori untuk pengujian pengelolaan katalog.',
    ]);
}

test('admin can manage products including uploading product photos', function () {
    Storage::fake('public');
    $admin = createCatalogAdmin();
    $category = createCatalogCategory();

    $this->actingAs($admin)
        ->post('/admin/products', [
            'name' => 'Produk Admin Uji',
            'description' => 'Deskripsi produk yang cukup lengkap untuk diuji.',
            'price' => '125000',
            'stock' => '8',
            'category_id' => (string) $category->id,
            'images' => [
                UploadedFile::fake()->createWithContent(
                    'produk.png',
                    base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jds8AAAAASUVORK5CYII=')
                ),
            ],
        ])
        ->assertRedirect();

    $product = Product::query()->where('name', 'Produk Admin Uji')->firstOrFail();
    expect($product->user_id)->toBe($admin->id)
        ->and($product->product_images()->count())->toBe(1);
    Storage::disk('public')->assertExists(
        $product->product_images()->firstOrFail()->getRawOriginal('image')
    );

    $this->actingAs($admin)
        ->get('/admin/products')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/index')
            ->where('products.data.0.name', 'Produk Admin Uji'));

    $this->actingAs($admin)
        ->put("/admin/products/{$product->id}", [
            'name' => 'Produk Admin Diperbarui',
            'description' => 'Deskripsi produk yang diperbarui dan cukup lengkap.',
            'price' => '150000',
            'stock' => '12',
            'category_id' => (string) $category->id,
            'images' => [],
            'remove_images' => [],
        ])
        ->assertRedirect();

    expect($product->fresh()->name)->toBe('Produk Admin Diperbarui')
        ->and($product->fresh()->price)->toBe('150000.00');

    $imagePath = $product->product_images()->firstOrFail()->getRawOriginal('image');
    $this->actingAs($admin)
        ->delete("/admin/products/{$product->id}")
        ->assertRedirect();

    expect(Product::query()->find($product->id))->toBeNull();
    Storage::disk('public')->assertMissing($imagePath);
});

test('admin can manage categories and cannot delete categories that contain products', function () {
    $admin = createCatalogAdmin();
    $category = createCatalogCategory('Kategori Lama');

    $this->actingAs($admin)
        ->post('/admin/categories', [
            'name' => 'Kategori Baru',
            'description' => 'Deskripsi kategori baru.',
            'icon' => 'package',
        ])
        ->assertRedirect();

    $created = Category::query()->where('name', 'Kategori Baru')->firstOrFail();
    $this->actingAs($admin)
        ->put("/admin/categories/{$created->id}", [
            'name' => 'Kategori Diperbarui',
            'description' => 'Deskripsi kategori yang diperbarui.',
            'icon' => 'tag',
        ])
        ->assertRedirect();

    $owner = User::factory()->create(['role' => UserRole::Admin]);
    $product = Product::query()->create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'slug' => Str::uuid()->toString(),
        'name' => 'Produk Dalam Kategori',
        'description' => 'Produk ini digunakan untuk pengujian kategori.',
        'price' => 10000,
        'stock' => 2,
    ]);

    $this->actingAs($admin)
        ->from('/admin/categories')
        ->delete("/admin/categories/{$category->id}")
        ->assertRedirect('/admin/categories')
        ->assertSessionHasErrors('category');

    expect($product->fresh())->not->toBeNull()
        ->and($created->fresh()->name)->toBe('Kategori Diperbarui');
});

test('admin can manage customer accounts but cannot delete accounts with order history', function () {
    $admin = createCatalogAdmin();

    $this->actingAs($admin)
        ->post('/admin/customers', [
            'name' => 'Pelanggan Baru',
            'email' => 'pelanggan-baru@example.test',
            'phone' => '081234567890',
            'password' => 'password-rahasia',
            'password_confirmation' => 'password-rahasia',
        ])
        ->assertRedirect();

    $customer = Pelanggan::query()->where('name', 'Pelanggan Baru')->firstOrFail();
    $this->actingAs($admin)
        ->get('/admin/customers')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/customers/index')
            ->where('customers.data.0.email', 'pelanggan-baru@example.test'));

    $this->actingAs($admin)
        ->put("/admin/customers/{$customer->id}", [
            'name' => 'Pelanggan Diperbarui',
            'email' => 'pelanggan-update@example.test',
            'phone' => '081111111111',
            'password' => '',
            'password_confirmation' => '',
        ])
        ->assertRedirect();

    expect($customer->fresh()->name)->toBe('Pelanggan Diperbarui')
        ->and($customer->user->fresh()->email)->toBe('pelanggan-update@example.test');

    $order = Order::query()->create([
        'order_number' => 'CATALOG-'.Str::upper(Str::random(8)),
        'user_id' => $customer->user_id,
        'total_price' => 10000,
        'shipping_address' => 'Jl. Katalog No. 1',
        'status' => OrderStatus::Completed,
    ]);

    $this->actingAs($admin)
        ->from('/admin/customers')
        ->delete("/admin/customers/{$customer->id}")
        ->assertRedirect('/admin/customers')
        ->assertSessionHasErrors('customer');

    expect($order->fresh())->not->toBeNull();
});

test('non-admin users cannot access catalog management', function () {
    $customer = User::factory()->create(['role' => UserRole::Pelanggan]);

    $this->actingAs($customer)
        ->get('/admin/products')
        ->assertForbidden();
});
