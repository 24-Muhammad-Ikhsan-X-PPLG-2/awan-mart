<?php

use App\Models\Admin;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\Payment;
use App\Models\PaymentStatus;
use App\Models\Pelanggan;
use App\Models\Procurement;
use App\Models\ProcurementStatus;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

test('admin dashboard aggregates actual orders, successful payments, inventory, and procurement', function () {
    config(['dashboard.low_stock_threshold' => 3]);

    $adminUser = User::factory()->create(['role' => UserRole::Admin]);
    $admin = Admin::query()->create([
        'user_id' => $adminUser->id,
        'name' => 'AwanMart Admin',
    ]);
    $customer = User::factory()->create(['role' => UserRole::Pelanggan]);
    Pelanggan::query()->create([
        'user_id' => $customer->id,
        'name' => 'Pelanggan Uji',
    ]);
    $category = Category::query()->create([
        'name' => 'Elektronik',
        'description' => 'Kategori untuk pengujian.',
    ]);
    $product = Product::query()->create([
        'user_id' => $adminUser->id,
        'category_id' => $category->id,
        'slug' => Str::uuid()->toString(),
        'name' => 'Headphone Uji',
        'description' => 'Produk untuk pengujian dashboard.',
        'price' => 500,
        'stock' => 2,
    ]);
    Product::query()->create([
        'user_id' => $adminUser->id,
        'category_id' => $category->id,
        'slug' => Str::uuid()->toString(),
        'name' => 'Stok Habis',
        'description' => 'Produk tanpa stok.',
        'price' => 100,
        'stock' => 0,
    ]);

    $paidOrder = Order::query()->create([
        'order_number' => 'AWM-PAID-'.Str::upper(Str::random(8)),
        'user_id' => $customer->id,
        'total_price' => 1250,
        'shipping_address' => 'Alamat pengujian',
        'status' => OrderStatus::Completed,
        'created_at' => now()->subDays(2),
    ]);
    OrderItem::query()->create([
        'order_id' => $paidOrder->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'price' => 500,
    ]);
    Payment::query()->create([
        'order_id' => $paidOrder->id,
        'provider' => 'midtrans',
        'provider_order_id' => $paidOrder->order_number,
        'amount' => 1250,
        'status' => PaymentStatus::Success,
        'paid_at' => now()->subDays(2),
    ]);

    $pendingOrder = Order::query()->create([
        'order_number' => 'AWM-PENDING-'.Str::upper(Str::random(8)),
        'user_id' => $customer->id,
        'total_price' => 9000,
        'shipping_address' => 'Alamat pengujian',
        'status' => OrderStatus::PendingPayment,
    ]);
    OrderItem::query()->create([
        'order_id' => $pendingOrder->id,
        'product_id' => $product->id,
        'quantity' => 5,
        'price' => 500,
    ]);
    Payment::query()->create([
        'order_id' => $pendingOrder->id,
        'provider' => 'midtrans',
        'provider_order_id' => $pendingOrder->order_number,
        'amount' => 9000,
        'status' => PaymentStatus::Pending,
    ]);

    $supplierUser = User::factory()->create(['role' => UserRole::Supplier]);
    $supplier = Supplier::query()->create([
        'user_id' => $supplierUser->id,
        'name' => 'Supplier Uji',
    ]);
    Procurement::query()->forceCreate([
        'supplier_id' => $supplier->id,
        'admin_id' => $admin->id,
        'tanggal_pengadaan' => now()->subDay(),
        'status' => ProcurementStatus::Pending,
    ]);

    $this->actingAs($adminUser)
        ->get('/admin?range=7d')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('admin.name', 'AwanMart Admin')
            ->where('filters.range', '7d')
            ->where('stats.revenue', 1250)
            ->where('stats.orders', 2)
            ->where('stats.products', 2)
            ->where('stats.customers', 1)
            ->where('revenueTrend', fn ($trend) => $trend->contains(
                fn (array $point) => (float) $point['revenue'] === 1250.0
            ))
            ->where('recentOrders.0.orderNumber', $pendingOrder->order_number)
            ->where('recentOrders.0.status', OrderStatus::PendingPayment->value)
            ->where('inventory.lowStockThreshold', 3)
            ->where('inventory.lowStockCount', 1)
            ->where('inventory.outOfStockCount', 1)
            ->where('topProducts.0.id', $product->id)
            ->where('topProducts.0.quantity', 2)
            ->where('topProducts.0.revenue', 1000)
            ->where('procurements.total', 1)
            ->where('procurements.pending', 1)
            ->where('procurements.recent.0.supplier', 'Supplier Uji'));
});

test('admin dashboard supports the twelve month chart range', function () {
    $adminUser = User::factory()->create(['role' => UserRole::Admin]);
    Admin::query()->create([
        'user_id' => $adminUser->id,
        'name' => 'AwanMart Admin',
    ]);

    $this->actingAs($adminUser)
        ->get('/admin?range=12m')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.range', '12m')
            ->has('revenueTrend', 12));
});

test('admin dashboard rejects unsupported chart ranges', function () {
    $adminUser = User::factory()->create(['role' => UserRole::Admin]);
    Admin::query()->create([
        'user_id' => $adminUser->id,
        'name' => 'AwanMart Admin',
    ]);

    $this->actingAs($adminUser)
        ->get('/admin?range=all')
        ->assertRedirect()
        ->assertSessionHasErrors('range');
});

test('admin dashboard is only available to admins', function () {
    $customer = User::factory()->create(['role' => UserRole::Pelanggan]);
    Pelanggan::query()->create([
        'user_id' => $customer->id,
        'name' => 'Pelanggan Uji',
    ]);

    $this->actingAs($customer)
        ->get('/admin')
        ->assertForbidden();
});
