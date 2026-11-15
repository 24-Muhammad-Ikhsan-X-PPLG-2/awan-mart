<?php

use App\Models\Admin;
use App\Models\Category;
use App\Models\Procurement;
use App\Models\ProcurementItem;
use App\Models\ProcurementStatus;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use App\Models\UserRole;
use Inertia\Testing\AssertableInertia as Assert;

test('supplier sees only its own procurements and status summaries', function () {
    [$supplierUser, $supplier] = createSupplierPortalSupplier();
    [$adminUser] = createSupplierPortalAdmin();
    [$otherUser, $otherSupplier] = createSupplierPortalSupplier();

    $pending = createSupplierPortalProcurement($adminUser, $supplier, ProcurementStatus::Pending);
    createSupplierPortalProcurement($adminUser, $supplier, ProcurementStatus::Approved);
    createSupplierPortalProcurement($adminUser, $supplier, ProcurementStatus::Shipped);
    createSupplierPortalProcurement($adminUser, $otherSupplier, ProcurementStatus::Pending);

    $this->actingAs($supplierUser)
        ->get('/supplier/procurements?search=PG-'.str_pad((string) $pending->id, 6, '0', STR_PAD_LEFT))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('supplier/procurements/index')
            ->where('stats.total', 3)
            ->where('stats.pending', 1)
            ->where('stats.approved', 1)
            ->where('stats.shipped', 1)
            ->where('procurements.total', 1)
            ->where('procurements.data.0.id', $pending->id));
});

test('supplier can view only its own procurement details', function () {
    [$supplierUser, $supplier] = createSupplierPortalSupplier();
    [$otherUser, $otherSupplier] = createSupplierPortalSupplier();
    [$adminUser] = createSupplierPortalAdmin();
    $ownProcurement = createSupplierPortalProcurement(
        $adminUser,
        $supplier,
        ProcurementStatus::Pending
    );
    $otherProcurement = createSupplierPortalProcurement(
        $adminUser,
        $otherSupplier,
        ProcurementStatus::Pending
    );
    $product = createSupplierPortalProduct($adminUser);
    ProcurementItem::query()->create([
        'procurement_id' => $ownProcurement->id,
        'product_id' => $product->id,
        'quantity' => 4,
        'price' => 1250,
    ]);

    $this->actingAs($supplierUser)
        ->get("/supplier/procurements/{$ownProcurement->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('supplier/procurements/show')
            ->where('procurement.number', 'PG-'.str_pad((string) $ownProcurement->id, 6, '0', STR_PAD_LEFT))
            ->where('procurement.items.0.productName', $product->name)
            ->where('procurement.items.0.quantity', 4)
            ->where('procurement.summary.totalCost', 5000)
            ->where('procurement.canAccept', true));

    $this->get("/supplier/procurements/{$otherProcurement->id}")->assertNotFound();
});

test('supplier can accept a pending request without increasing product stock', function () {
    [$supplierUser, $supplier] = createSupplierPortalSupplier();
    [$adminUser] = createSupplierPortalAdmin();
    $procurement = createSupplierPortalProcurement(
        $adminUser,
        $supplier,
        ProcurementStatus::Pending
    );
    $product = createSupplierPortalProduct($adminUser);
    ProcurementItem::query()->create([
        'procurement_id' => $procurement->id,
        'product_id' => $product->id,
        'quantity' => 4,
        'price' => 1250,
    ]);

    $this->actingAs($supplierUser)
        ->patch("/supplier/procurements/{$procurement->id}/accept")
        ->assertRedirect();

    expect($procurement->fresh()->status)->toBe(ProcurementStatus::Approved)
        ->and($product->fresh()->stock)->toBe(5);

    $this->patch("/supplier/procurements/{$procurement->id}/accept")
        ->assertSessionHasErrors('status');
    expect($product->fresh()->stock)->toBe(5);
});

test('supplier rejection requires and records a reason without changing admin notes', function () {
    [$supplierUser, $supplier] = createSupplierPortalSupplier();
    [$adminUser] = createSupplierPortalAdmin();
    $procurement = createSupplierPortalProcurement(
        $adminUser,
        $supplier,
        ProcurementStatus::Pending
    );
    $procurement->update(['catatan' => 'Mohon dikirim minggu ini']);

    $this->actingAs($supplierUser)
        ->patch("/supplier/procurements/{$procurement->id}/reject", ['reason' => '     '])
        ->assertSessionHasErrors('reason');

    $this->patch("/supplier/procurements/{$procurement->id}/reject", [
        'reason' => '  Produk tidak tersedia  ',
    ])->assertRedirect();

    expect($procurement->fresh()->status)->toBe(ProcurementStatus::Rejected)
        ->and($procurement->fresh()->alasan_penolakan)->toBe('Produk tidak tersedia')
        ->and($procurement->fresh()->catatan)->toBe('Mohon dikirim minggu ini');

    $this->patch("/supplier/procurements/{$procurement->id}/accept")
        ->assertSessionHasErrors('status');
});

test('supplier can ship only an accepted procurement and stock waits for admin receipt', function () {
    [$supplierUser, $supplier] = createSupplierPortalSupplier();
    [$adminUser] = createSupplierPortalAdmin();
    $procurement = createSupplierPortalProcurement(
        $adminUser,
        $supplier,
        ProcurementStatus::Pending
    );
    $product = createSupplierPortalProduct($adminUser);
    ProcurementItem::query()->create([
        'procurement_id' => $procurement->id,
        'product_id' => $product->id,
        'quantity' => 4,
        'price' => 1250,
    ]);

    $this->actingAs($supplierUser)
        ->patch("/supplier/procurements/{$procurement->id}/ship")
        ->assertSessionHasErrors('status');
    expect($product->fresh()->stock)->toBe(5);

    $procurement->update(['status' => ProcurementStatus::Approved]);
    $this->patch("/supplier/procurements/{$procurement->id}/ship")->assertRedirect();

    expect($procurement->fresh()->status)->toBe(ProcurementStatus::Shipped)
        ->and($procurement->fresh()->tanggal_pengiriman)->not->toBeNull()
        ->and($product->fresh()->stock)->toBe(5);

    $this->patch("/supplier/procurements/{$procurement->id}/ship")
        ->assertSessionHasErrors('status');
    expect($product->fresh()->stock)->toBe(5);
});

test('only authenticated supplier accounts can access supplier procurement routes', function () {
    [$supplierUser, $supplier] = createSupplierPortalSupplier();
    [$adminUser] = createSupplierPortalAdmin();
    $procurement = createSupplierPortalProcurement(
        $adminUser,
        $supplier,
        ProcurementStatus::Pending
    );

    $this->get('/supplier/procurements')->assertRedirect('/auth/login');

    $this->actingAs($adminUser)
        ->get('/supplier/procurements')
        ->assertForbidden();
    $this->patch("/supplier/procurements/{$procurement->id}/accept")
        ->assertForbidden();

    $userWithoutSupplier = User::factory()->create(['role' => UserRole::Supplier]);
    $this->actingAs($userWithoutSupplier)
        ->get('/supplier/procurements')
        ->assertNotFound();
});

function createSupplierPortalSupplier(): array
{
    $user = User::factory()->create(['role' => UserRole::Supplier]);
    $supplier = Supplier::query()->create([
        'user_id' => $user->id,
        'name' => 'Supplier Portal '.fake()->unique()->numerify('###'),
        'alamat' => 'Alamat supplier',
        'telp' => '08123456789',
    ]);

    return [$user, $supplier];
}

function createSupplierPortalAdmin(): array
{
    $user = User::factory()->create(['role' => UserRole::Admin]);
    Admin::query()->create([
        'user_id' => $user->id,
        'name' => 'Admin Portal '.fake()->unique()->numerify('###'),
    ]);

    return [$user];
}

function createSupplierPortalProcurement(
    User $adminUser,
    Supplier $supplier,
    ProcurementStatus $status
): Procurement {
    return Procurement::query()->create([
        'supplier_id' => $supplier->id,
        'admin_id' => $adminUser->admin->id,
        'tanggal_pengadaan' => now(),
        'status' => $status,
        'catatan' => 'Catatan dari admin',
    ]);
}

function createSupplierPortalProduct(User $adminUser): Product
{
    $category = Category::query()->create([
        'name' => 'Kategori Portal '.fake()->unique()->numerify('###'),
        'description' => 'Kategori pengujian supplier portal.',
    ]);

    return Product::query()->create([
        'user_id' => $adminUser->id,
        'category_id' => $category->id,
        'slug' => fake()->unique()->slug(),
        'name' => 'Produk Portal '.fake()->unique()->numerify('###'),
        'description' => 'Produk pengujian supplier portal.',
        'price' => 5000,
        'stock' => 5,
    ]);
}
