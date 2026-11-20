<?php

use App\Models\Admin;
use App\Models\Category;
use App\Models\Courier;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Pelanggan;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use App\Models\UserRole;
use App\Services\MidtransPaymentService;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery\MockInterface;

test('checkout lists active couriers and stores server-calculated delivery cost', function () {
    [$customer, $product, $courier] = courierCheckoutFixture();

    $this->actingAs($customer)
        ->post('/checkout', [
            'items' => [['product_id' => $product->id, 'quantity' => 2]],
        ])
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('checkout')
            ->where('couriers.0.id', $courier->id)
            ->where('couriers.0.shippingCost', 18000));

    $payments = Mockery::mock(MidtransPaymentService::class, function (MockInterface $mock) {
        $mock->shouldReceive('createSnapTransaction')
            ->once()
            ->withArgs(fn (array $parameters): bool => $parameters['transaction_details']['gross_amount'] === 42000
                && collect($parameters['item_details'])->contains(
                    fn (array $item): bool => $item['id'] === 'shipping'
                        && $item['price'] === 18000
                        && $item['name'] === 'Ongkir Kurir Hemat'
                ))
            ->andReturn((object) [
                'token' => 'snap-token-for-courier-test',
                'redirect_url' => 'https://example.test/snap',
            ]);
    });
    $this->app->instance(MidtransPaymentService::class, $payments);

    $this->actingAs($customer)
        ->postJson('/checkout/store', [
            'shipping_address' => 'Jl. Uji No. 1',
            'courier_id' => $courier->id,
            'shipping_cost' => 1,
            'items' => [['product_id' => $product->id, 'quantity' => 2]],
        ])
        ->assertCreated()
        ->assertJsonPath('data.snap_token', 'snap-token-for-courier-test');

    $order = Order::query()->firstOrFail();
    expect((int) $order->total_price)->toBe(42000)
        ->and($order->courier_id)->toBe($courier->id)
        ->and($order->courier_name)->toBe('Kurir Hemat')
        ->and($order->shipping_cost)->toBe(18000);
});

test('checkout rejects an inactive courier without creating an order', function () {
    [$customer, $product, $courier] = courierCheckoutFixture();
    $courier->update(['is_active' => false]);

    $this->actingAs($customer)
        ->postJson('/checkout/store', [
            'shipping_address' => 'Jl. Uji No. 1',
            'courier_id' => $courier->id,
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('courier_id');

    expect(Order::query()->count())->toBe(0);
});

test('admin can manage courier rates and only supplier accounts are eligible', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    Admin::query()->create(['user_id' => $admin->id, 'name' => 'Admin Kurir']);
    [$supplierUser, $supplier] = courierSupplierFixture();

    $this->actingAs($admin)
        ->post('/admin/couriers', [
            'name' => 'Kurir Hemat',
            'supplier_id' => $supplier->id,
            'shipping_cost' => 18000,
            'is_active' => true,
        ])
        ->assertRedirect();

    $courier = Courier::query()->firstOrFail();
    expect($courier->supplier_id)->toBe($supplier->id)
        ->and($courier->shipping_cost)->toBe(18000)
        ->and($supplierUser->role)->toBe(UserRole::Supplier);

    $this->actingAs($admin)
        ->get('/admin/couriers')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/couriers/index')
            ->where('couriers.data.0.name', 'Kurir Hemat')
            ->where('couriers.data.0.shippingCost', 18000));

    $customer = User::factory()->create(['role' => UserRole::Pelanggan]);
    Pelanggan::query()->create(['user_id' => $customer->id, 'name' => 'Bukan Supplier']);
    $this->actingAs($admin)
        ->put("/admin/couriers/{$courier->id}", [
            'name' => 'Kurir Hemat',
            'supplier_id' => $supplier->id,
            'shipping_cost' => 18000.5,
            'is_active' => true,
        ])
        ->assertSessionHasErrors('shipping_cost');
});

test('supplier courier can complete only assigned shipped orders', function () {
    [$supplierUser, , $courier] = courierDeliveryFixture('Kurir Penguji');
    [$otherSupplierUser, , $otherCourier] = courierDeliveryFixture('Kurir Lain');
    [$customer, $product] = courierCustomerAndProductFixture();
    $assignedOrder = courierOrderFixture($customer, $product, $courier, OrderStatus::Shipped);
    $otherOrder = courierOrderFixture($customer, $product, $otherCourier, OrderStatus::Shipped);

    $this->actingAs($supplierUser)
        ->get('/supplier/deliveries?search=AWM-NO-MATCH')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('supplier/deliveries/index')
            ->where('deliveries.total', 0));

    $this->actingAs($supplierUser)
        ->patch("/supplier/deliveries/{$otherOrder->id}/complete")
        ->assertNotFound();

    $this->patch("/supplier/deliveries/{$assignedOrder->id}/complete")
        ->assertRedirect();

    expect($assignedOrder->fresh()->status)->toBe(OrderStatus::Completed)
        ->and($assignedOrder->fresh()->completed_at)->not->toBeNull()
        ->and($otherOrder->fresh()->status)->toBe(OrderStatus::Shipped)
        ->and($otherSupplierUser->role)->toBe(UserRole::Supplier);
});

test('courier search cannot expose deliveries assigned to another supplier', function () {
    [$supplierUser, , $courier] = courierDeliveryFixture('Kurir Pemilik');
    [, , $otherCourier] = courierDeliveryFixture('Kurir Lainnya');
    [$customer, $product] = courierCustomerAndProductFixture('Pelanggan Bersama');
    courierOrderFixture($customer, $product, $otherCourier, OrderStatus::Shipped, 'AWM-OTHER-ORDER');

    $this->actingAs($supplierUser)
        ->get('/supplier/deliveries?search=Bersama')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('deliveries.total', 0));
});

test('customer profile includes courier and delivery milestones for each order', function () {
    [$supplierUser, , $courier] = courierDeliveryFixture('Kurir Pelacakan');
    [$customer, $product] = courierCustomerAndProductFixture();
    $order = courierOrderFixture($customer, $product, $courier, OrderStatus::Shipped);

    $this->actingAs($customer)
        ->get('/profile')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('orders.data.0.id', $order->id)
            ->where('orders.data.0.courier_name', $courier->name)
            ->where('orders.data.0.shipping_cost', 15000)
            ->where('orders.data.0.shipped_at', fn (?string $value) => $value !== null));

    expect($supplierUser->role)->toBe(UserRole::Supplier);
});

function courierCheckoutFixture(): array
{
    [$supplierUser, $supplier] = courierSupplierFixture();
    $courier = Courier::query()->create([
        'supplier_id' => $supplier->id,
        'name' => 'Kurir Hemat',
        'shipping_cost' => 18000,
        'is_active' => true,
    ]);
    $customer = User::factory()->create(['role' => UserRole::Pelanggan]);
    Pelanggan::query()->create([
        'user_id' => $customer->id,
        'name' => 'Pelanggan Checkout',
        'alamat' => ['address' => 'Jl. Checkout No. 1'],
    ]);
    $category = Category::query()->create([
        'name' => 'Kategori Checkout '.Str::random(8),
        'description' => 'Kategori checkout test.',
    ]);
    $product = Product::query()->create([
        'user_id' => $supplierUser->id,
        'category_id' => $category->id,
        'slug' => Str::uuid()->toString(),
        'name' => 'Produk Checkout',
        'description' => 'Produk untuk uji ongkir.',
        'price' => 12000,
        'stock' => 10,
    ]);

    return [$customer, $product, $courier];
}

function courierSupplierFixture(string $name = 'Supplier Penguji'): array
{
    $user = User::factory()->create(['role' => UserRole::Supplier]);
    $supplier = Supplier::query()->create([
        'user_id' => $user->id,
        'name' => $name.' '.Str::random(6),
        'alamat' => 'Alamat supplier',
        'telp' => '08123456789',
    ]);

    return [$user, $supplier];
}

function courierDeliveryFixture(string $name): array
{
    [$user, $supplier] = courierSupplierFixture($name);
    $courier = Courier::query()->create([
        'supplier_id' => $supplier->id,
        'name' => $name,
        'shipping_cost' => 15000,
        'is_active' => true,
    ]);

    return [$user, $supplier, $courier];
}

function courierCustomerAndProductFixture(string $customerName = 'Pelanggan Pengiriman'): array
{
    $customer = User::factory()->create(['role' => UserRole::Pelanggan]);
    Pelanggan::query()->create([
        'user_id' => $customer->id,
        'name' => $customerName,
        'telp' => '08123456789',
    ]);
    [$supplierUser] = courierSupplierFixture('Supplier Produk');
    $category = Category::query()->create([
        'name' => 'Kategori Pengiriman '.Str::random(8),
        'description' => 'Kategori pengiriman test.',
    ]);
    $product = Product::query()->create([
        'user_id' => $supplierUser->id,
        'category_id' => $category->id,
        'slug' => Str::uuid()->toString(),
        'name' => 'Produk Pengiriman',
        'description' => 'Produk untuk uji pengiriman.',
        'price' => 5000,
        'stock' => 5,
    ]);

    return [$customer, $product];
}

function courierOrderFixture(
    User $customer,
    Product $product,
    Courier $courier,
    OrderStatus $status,
    string $orderNumber = 'AWM-DELIVERY-TEST',
): Order {
    $order = Order::query()->create([
        'order_number' => $orderNumber.'-'.Str::random(5),
        'user_id' => $customer->id,
        'courier_id' => $courier->id,
        'courier_name' => $courier->name,
        'shipping_cost' => $courier->shipping_cost,
        'total_price' => 10000,
        'shipping_address' => 'Jl. Pengiriman No. 1',
        'status' => $status,
        'shipped_at' => $status === OrderStatus::Shipped ? now() : null,
    ]);
    $order->orderItems()->create([
        'product_id' => $product->id,
        'quantity' => 1,
        'price' => $product->price,
    ]);

    return $order;
}
