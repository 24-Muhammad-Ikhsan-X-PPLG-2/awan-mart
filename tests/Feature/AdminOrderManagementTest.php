<?php

use App\Models\Admin;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\PaymentStatus;
use App\Models\Pelanggan;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

test('admin can list and search orders with global status statistics', function () {
    [$adminUser] = createAdminOrderManagementAdmin();
    [$customer, $product] = createAdminOrderManagementCustomerAndProduct('Rina Pelanggan');
    $processingOrder = createAdminOrderManagementOrder(
        $customer,
        $product,
        OrderStatus::Processing,
        'AWM-ADMIN-ORDER-001'
    );
    createAdminOrderManagementOrder(
        $customer,
        $product,
        OrderStatus::Shipped,
        'AWM-ADMIN-ORDER-002'
    );
    createAdminOrderManagementOrder(
        $customer,
        $product,
        OrderStatus::Completed,
        'AWM-ADMIN-ORDER-003'
    );

    $this->actingAs($adminUser)
        ->get('/admin/orders?search=Rina&status=processing')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/index')
            ->where('filters.search', 'Rina')
            ->where('filters.status', 'processing')
            ->where('stats.total', 3)
            ->where('stats.processing', 1)
            ->where('stats.shipped', 1)
            ->where('stats.completed', 1)
            ->where('orders.total', 1)
            ->where('orders.data.0.id', $processingOrder->id)
            ->where('orders.data.0.customer', 'Rina Pelanggan')
            ->where('orders.data.0.paymentStatus', 'success')
            ->where('statusCounts.0.value', 'pending_payment')
            ->where('statusCounts.1.value', 'processing'));
});

test('admin order list uses server-side pagination and preserves filters', function () {
    [$adminUser] = createAdminOrderManagementAdmin();
    [$customer, $product] = createAdminOrderManagementCustomerAndProduct();

    foreach (range(1, 11) as $index) {
        createAdminOrderManagementOrder(
            $customer,
            $product,
            OrderStatus::Processing,
            sprintf('AWM-PAGINATION-%03d', $index)
        );
    }

    $this->actingAs($adminUser)
        ->get('/admin/orders?status=processing&search=PAGINATION')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('orders.total', 11)
            ->where('orders.current_page', 1)
            ->has('orders.data', 10)
            ->where('orders.next_page_url', fn (string $url) => str_contains($url, 'status=processing')
                && str_contains($url, 'search=PAGINATION'))
            ->where('filters.status', 'processing')
            ->where('filters.search', 'PAGINATION'));
});

test('admin can view order customer, item, payment, and shipping summary', function () {
    [$adminUser] = createAdminOrderManagementAdmin();
    [$customer, $product] = createAdminOrderManagementCustomerAndProduct('Dian Pelanggan');
    ProductImage::query()->forceCreate([
        'product_id' => $product->id,
        'image' => '/storage/products/headphone.jpg',
    ]);
    $order = createAdminOrderManagementOrder(
        $customer,
        $product,
        OrderStatus::Processing,
        'AWM-ADMIN-DETAIL-001'
    );

    $this->actingAs($adminUser)
        ->get("/admin/orders/{$order->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/show')
            ->where('order.orderNumber', 'AWM-ADMIN-DETAIL-001')
            ->where('order.customer.name', 'Dian Pelanggan')
            ->where('order.customer.email', $customer->email)
            ->where('order.customer.phone', '08123456789')
            ->where('order.shippingAddress', 'Jl. Anggrek No. 12')
            ->where('order.items.0.productName', 'Headphone Uji')
            ->where('order.items.0.image', '/storage/products/headphone.jpg')
            ->where('order.items.0.quantity', 2)
            ->where('order.items.0.unitPrice', 2000)
            ->where('order.items.0.subtotal', 4000)
            ->where('order.payment.status', 'success')
            ->where('order.payment.method', 'bank_transfer')
            ->where('order.summary.subtotal', 4000)
            ->where('order.summary.shipping', 15000)
            ->where('order.summary.total', 19000)
            ->where('order.canMarkAsShipped', true));
});

test('admin can mark a processing order as shipped without changing payment status', function () {
    [$adminUser] = createAdminOrderManagementAdmin();
    [$customer, $product] = createAdminOrderManagementCustomerAndProduct();
    $order = createAdminOrderManagementOrder(
        $customer,
        $product,
        OrderStatus::Processing,
        'AWM-ADMIN-SHIP-001'
    );
    $payment = $order->payment;

    $this->actingAs($adminUser)
        ->patch("/admin/orders/{$order->id}/status", ['status' => OrderStatus::Shipped->value])
        ->assertRedirect();

    expect($order->fresh()->status)->toBe(OrderStatus::Shipped)
        ->and($payment->fresh()->status)->toBe(PaymentStatus::Success);
});

test('admin cannot ship an order that is not processing or request another transition', function () {
    [$adminUser] = createAdminOrderManagementAdmin();
    [$customer, $product] = createAdminOrderManagementCustomerAndProduct();
    $pendingOrder = createAdminOrderManagementOrder(
        $customer,
        $product,
        OrderStatus::PendingPayment,
        'AWM-ADMIN-PENDING-001'
    );
    $processingOrder = createAdminOrderManagementOrder(
        $customer,
        $product,
        OrderStatus::Processing,
        'AWM-ADMIN-INVALID-001'
    );

    $this->actingAs($adminUser)
        ->patch("/admin/orders/{$pendingOrder->id}/status", [
            'status' => OrderStatus::Shipped->value,
        ])
        ->assertSessionHasErrors('status');

    $this->patch("/admin/orders/{$processingOrder->id}/status", [
        'status' => OrderStatus::Completed->value,
    ])->assertSessionHasErrors('status');

    expect($pendingOrder->fresh()->status)->toBe(OrderStatus::PendingPayment)
        ->and($processingOrder->fresh()->status)->toBe(OrderStatus::Processing);
});

test('non-admin users cannot list, view, or update admin orders', function () {
    [$customer, $product] = createAdminOrderManagementCustomerAndProduct();
    $order = createAdminOrderManagementOrder(
        $customer,
        $product,
        OrderStatus::Processing,
        'AWM-ADMIN-FORBIDDEN-001'
    );

    $this->actingAs($customer)
        ->get('/admin/orders')
        ->assertForbidden();

    $this->get("/admin/orders/{$order->id}")
        ->assertForbidden();

    $this->patch("/admin/orders/{$order->id}/status", [
        'status' => OrderStatus::Shipped->value,
    ])->assertForbidden();

    expect($order->fresh()->status)->toBe(OrderStatus::Processing);
});

function createAdminOrderManagementAdmin(): array
{
    $user = User::factory()->create(['role' => UserRole::Admin]);
    $admin = Admin::query()->create([
        'user_id' => $user->id,
        'name' => 'Admin Pengujian Pesanan',
    ]);

    return [$user, $admin];
}

function createAdminOrderManagementCustomerAndProduct(string $customerName = 'Pelanggan Uji'): array
{
    $customer = User::factory()->create(['role' => UserRole::Pelanggan]);
    Pelanggan::query()->create([
        'user_id' => $customer->id,
        'name' => $customerName,
        'telp' => '08123456789',
        'alamat' => ['jalan' => 'Jl. Anggrek No. 12'],
    ]);
    $category = Category::query()->create([
        'name' => 'Kategori '.Str::random(8),
        'description' => 'Kategori untuk pengujian admin order.',
    ]);
    $product = Product::query()->create([
        'user_id' => $customer->id,
        'category_id' => $category->id,
        'slug' => Str::uuid()->toString(),
        'name' => 'Headphone Uji',
        'description' => 'Produk untuk pengujian admin order.',
        'price' => 2000,
        'stock' => 10,
    ]);

    return [$customer, $product];
}

function createAdminOrderManagementOrder(
    User $customer,
    Product $product,
    OrderStatus $status,
    string $orderNumber
): Order {
    $order = Order::query()->create([
        'order_number' => $orderNumber,
        'user_id' => $customer->id,
        'total_price' => 19000,
        'shipping_address' => 'Jl. Anggrek No. 12',
        'status' => $status,
    ]);
    OrderItem::query()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'price' => 2000,
    ]);
    $order->payment()->create([
        'provider' => 'midtrans',
        'provider_order_id' => $orderNumber,
        'amount' => 19000,
        'method' => 'bank_transfer',
        'status' => PaymentStatus::Success,
        'paid_at' => now(),
    ]);

    return $order;
}
