<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\PaymentStatus;
use App\Models\Pelanggan;
use App\Models\Product;
use App\Models\User;
use App\Models\UserRole;
use App\Services\MidtransPaymentService;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery\MockInterface;

test('finish page does not trust a successful status in the redirect query', function () {
    $user = createProfileCustomer();
    $order = createPendingMidtransOrder($user);

    $payments = Mockery::mock(MidtransPaymentService::class, function (MockInterface $mock) {
        $mock->shouldReceive('verifyTransaction')
            ->once()
            ->andThrow(new RuntimeException('Midtrans unavailable'));
        $mock->shouldNotReceive('synchronize');
    });
    $this->app->instance(MidtransPaymentService::class, $payments);

    $this->actingAs($user)
        ->get('/payment/finish?order_id='.$order->order_number.'&status_code=200&transaction_status=settlement')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('payment/finish')
            ->where('result.status', 'unknown')
            ->where('result.amount', 1000));
});

test('finish page displays success only after Midtrans status is verified', function () {
    $user = createProfileCustomer();
    $order = createPendingMidtransOrder($user);
    $payment = $order->payment;

    $payments = Mockery::mock(MidtransPaymentService::class)->makePartial();
    $payments->shouldReceive('verifyTransaction')
        ->once()
        ->andReturn([
            'order_id' => $payment->provider_order_id,
            'gross_amount' => '1000.00',
            'transaction_status' => 'settlement',
            'transaction_id' => 'midtrans-tx-success',
            'payment_type' => 'bank_transfer',
        ]);
    $this->app->instance(MidtransPaymentService::class, $payments);

    $this->actingAs($user)
        ->get('/payment/finish?order_id='.$order->order_number.'&transaction_status=pending')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('payment/finish')
            ->where('result.status', 'success')
            ->where('result.order_id', $order->order_number));

    expect($payment->fresh()->status)->toBe(PaymentStatus::Success)
        ->and($order->fresh()->status)->toBe(OrderStatus::Processing);
});

test('finish page does not reveal another customer order', function () {
    $owner = createProfileCustomer();
    $visitor = createProfileCustomer();
    $order = createPendingMidtransOrder($owner);

    $payments = Mockery::mock(MidtransPaymentService::class);
    $payments->shouldNotReceive('verifyTransaction');
    $this->app->instance(MidtransPaymentService::class, $payments);

    $this->actingAs($visitor)
        ->get('/payment/finish?order_id='.$order->order_number.'&transaction_status=settlement')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('payment/finish')
            ->where('result.status', 'unknown')
            ->where('result.amount', null));
});

test('midtrans notification signatures are verified using the server key', function () {
    config(['services.midtrans.server_key' => 'test-server-key']);

    $payload = [
        'order_id' => 'AWM-123',
        'status_code' => '200',
        'gross_amount' => '1000.00',
    ];
    $payload['signature_key'] = hash(
        'sha512',
        $payload['order_id'].$payload['status_code'].$payload['gross_amount'].'test-server-key'
    );

    $service = app(MidtransPaymentService::class);

    expect($service->hasValidNotificationSignature($payload))->toBeTrue()
        ->and($service->hasValidNotificationSignature([
            ...$payload,
            'status_code' => '201',
        ]))->toBeFalse();
});

test('verified payment statuses update order and payment once without downgrading success', function () {
    $user = createProfileCustomer();
    $order = createPendingMidtransOrder($user);
    $payment = $order->payment;
    $product = $order->orderItems()->firstOrFail()->product;
    $service = app(MidtransPaymentService::class);
    $settlement = [
        'order_id' => $payment->provider_order_id,
        'gross_amount' => '1000.00',
        'transaction_status' => 'settlement',
        'transaction_id' => 'midtrans-tx-1',
        'payment_type' => 'bank_transfer',
    ];

    expect($service->synchronize($order, $payment, $settlement))
        ->toBe(PaymentStatus::Success);

    $payment->refresh();
    $order->refresh();
    expect($payment->status)->toBe(PaymentStatus::Success)
        ->and($payment->transaction_id)->toBe('midtrans-tx-1')
        ->and($payment->paid_at)->not->toBeNull()
        ->and($order->status)->toBe(OrderStatus::Processing)
        ->and($product->fresh()->stock)->toBe(8);

    expect($service->synchronize($order, $payment, [
        ...$settlement,
        'transaction_status' => 'pending',
    ]))->toBe(PaymentStatus::Success);

    $payment->refresh();
    $order->refresh();
    expect($payment->status)->toBe(PaymentStatus::Success)
        ->and($order->status)->toBe(OrderStatus::Processing)
        ->and($product->fresh()->stock)->toBe(8);
});

test('payment status is not marked successful when there is not enough stock', function () {
    $user = createProfileCustomer();
    $order = createPendingMidtransOrder($user);
    $payment = $order->payment;
    $product = $order->orderItems()->firstOrFail()->product;
    $product->update(['stock' => 1]);

    expect(fn () => app(MidtransPaymentService::class)->synchronize(
        $order,
        $payment,
        [
            'transaction_status' => 'settlement',
            'gross_amount' => '1000.00',
        ],
    ))->toThrow(RuntimeException::class, 'Insufficient stock');

    expect($payment->fresh()->status)->toBe(PaymentStatus::Pending)
        ->and($order->fresh()->status)->toBe(OrderStatus::PendingPayment)
        ->and($product->fresh()->stock)->toBe(1);
});

test('capture transactions require an accepted fraud status before payment succeeds', function () {
    $user = createProfileCustomer();
    $order = createPendingMidtransOrder($user);
    $payment = $order->payment;
    $service = app(MidtransPaymentService::class);
    $transaction = [
        'order_id' => $payment->provider_order_id,
        'gross_amount' => '1000.00',
        'transaction_status' => 'capture',
        'fraud_status' => 'challenge',
    ];

    expect($service->synchronize($order, $payment, $transaction))
        ->toBe(PaymentStatus::Pending);
    expect($payment->fresh()->status)->toBe(PaymentStatus::Pending);

    $transaction['fraud_status'] = 'accept';
    expect($service->synchronize($order, $payment, $transaction))
        ->toBe(PaymentStatus::Success);
    expect($payment->fresh()->status)->toBe(PaymentStatus::Success);
});

test('notification endpoint verifies signature and synchronizes the server-verified status', function () {
    config(['services.midtrans.server_key' => 'test-server-key']);
    $user = createProfileCustomer();
    $order = createPendingMidtransOrder($user);
    $payment = $order->payment;
    $payload = [
        'order_id' => $payment->provider_order_id,
        'status_code' => '200',
        'gross_amount' => '1000.00',
        'transaction_id' => 'midtrans-tx-2',
    ];
    $payload['signature_key'] = hash(
        'sha512',
        $payload['order_id'].$payload['status_code'].$payload['gross_amount'].'test-server-key'
    );

    $payments = Mockery::mock(MidtransPaymentService::class)->makePartial();
    $payments->shouldReceive('verifyTransaction')
        ->once()
        ->andReturn([
            'order_id' => $payment->provider_order_id,
            'gross_amount' => '1000.00',
            'transaction_status' => 'settlement',
            'transaction_id' => 'midtrans-tx-2',
            'payment_type' => 'bank_transfer',
        ]);
    $this->app->instance(MidtransPaymentService::class, $payments);

    $this->postJson('/payment/notification', $payload)
        ->assertOk()
        ->assertJson(['message' => 'Notification processed.']);

    expect($payment->fresh()->status)->toBe(PaymentStatus::Success)
        ->and($order->fresh()->status)->toBe(OrderStatus::Processing);
});

function createPendingMidtransOrder(User $user): Order
{
    $category = Category::query()->create([
        'name' => fake()->unique()->word(),
        'description' => 'Test category',
    ]);
    $product = Product::query()->create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'slug' => Str::uuid()->toString(),
        'name' => 'Test product',
        'description' => 'Product used in payment flow tests.',
        'price' => 500,
        'stock' => 10,
    ]);

    $order = Order::query()->create([
        'order_number' => 'AWM-'.strtoupper(str_replace('-', '', (string) Str::uuid())),
        'user_id' => $user->id,
        'total_price' => 1000,
        'shipping_address' => 'Test shipping address',
        'status' => OrderStatus::PendingPayment,
    ]);

    $order->orderItems()->create([
        'product_id' => $product->id,
        'quantity' => 2,
        'price' => 500,
    ]);

    $order->payment()->create([
        'provider' => 'midtrans',
        'provider_order_id' => $order->order_number,
        'amount' => 1000,
        'status' => PaymentStatus::Pending,
    ]);

    return $order;
}

function createProfileCustomer(): User
{
    $user = User::factory()->create(['role' => UserRole::Pelanggan]);
    Pelanggan::query()->create([
        'user_id' => $user->id,
        'name' => fake()->unique()->name(),
    ]);

    return $user;
}
