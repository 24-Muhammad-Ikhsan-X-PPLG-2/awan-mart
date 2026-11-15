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
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

test('admin can list and filter procurements with global status statistics', function () {
    [$adminUser] = createAdminProcurementAdmin();
    [$supplier] = createAdminProcurementSupplier();
    $pending = createAdminProcurement($adminUser, $supplier, ProcurementStatus::Pending);
    createAdminProcurement($adminUser, $supplier, ProcurementStatus::Approved);
    createAdminProcurement($adminUser, $supplier, ProcurementStatus::Completed);

    $this->actingAs($adminUser)
        ->get('/admin/procurements?search='.$pending->id.'&status=pending')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/procurements/index')
            ->where('stats.total', 3)
            ->where('stats.pending', 1)
            ->where('stats.approved', 1)
            ->where('stats.completed', 1)
            ->where('procurements.total', 1)
            ->where('procurements.data.0.number', 'PG-'.str_pad((string) $pending->id, 6, '0', STR_PAD_LEFT))
            ->where('procurements.data.0.status', 'pending'));
});

test('admin can create a procurement with multiple distinct products', function () {
    [$adminUser] = createAdminProcurementAdmin();
    [$supplier] = createAdminProcurementSupplier();
    [$product, $secondProduct] = createAdminProcurementProducts($adminUser);

    $this->actingAs($adminUser)
        ->post('/admin/procurements', [
            'supplier_id' => $supplier->id,
            'tanggal_pengadaan' => '2026-10-29',
            'catatan' => 'Restock mingguan',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 3, 'price' => '1200.50'],
                ['product_id' => $secondProduct->id, 'quantity' => 2, 'price' => '4000'],
            ],
        ])
        ->assertRedirect();

    $procurement = Procurement::query()->with('procurement_items')->firstOrFail();
    expect($procurement->status)->toBe(ProcurementStatus::Pending)
        ->and($procurement->admin_id)->toBe($adminUser->admin->id)
        ->and($procurement->procurement_items)->toHaveCount(2)
        ->and((float) $procurement->procurement_items->first()->price)->toBe(1200.5)
        ->and($product->fresh()->stock)->toBe(5);
});

test('procurement creation rejects duplicate products and invalid suppliers', function () {
    [$adminUser] = createAdminProcurementAdmin();
    [$supplier] = createAdminProcurementSupplier();
    [$product] = createAdminProcurementProducts($adminUser);

    $this->actingAs($adminUser)
        ->post('/admin/procurements', [
            'supplier_id' => $supplier->id,
            'tanggal_pengadaan' => '2026-10-29',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1, 'price' => 100],
                ['product_id' => $product->id, 'quantity' => 2, 'price' => 100],
            ],
        ])
        ->assertSessionHasErrors('items.1.product_id');

    $nonSupplier = User::factory()->create(['role' => UserRole::Pelanggan]);
    $invalidSupplier = Supplier::query()->create([
        'user_id' => $nonSupplier->id,
        'name' => 'Supplier Tidak Valid '.Str::random(5),
    ]);

    $this->post('/admin/procurements', [
        'supplier_id' => $invalidSupplier->id,
        'tanggal_pengadaan' => '2026-10-29',
        'items' => [
            ['product_id' => $product->id, 'quantity' => 1, 'price' => 100],
        ],
    ])->assertSessionHasErrors('supplier_id');

    expect(Procurement::query()->count())->toBe(0);
});

test('completing an approved procurement updates stock once and validates transitions', function () {
    [$adminUser] = createAdminProcurementAdmin();
    [$supplier] = createAdminProcurementSupplier();
    [$product] = createAdminProcurementProducts($adminUser);
    $procurement = createAdminProcurement($adminUser, $supplier, ProcurementStatus::Pending);
    ProcurementItem::query()->create([
        'procurement_id' => $procurement->id,
        'product_id' => $product->id,
        'quantity' => 4,
        'price' => 1500,
    ]);

    $this->actingAs($adminUser)
        ->patch("/admin/procurements/{$procurement->id}/status", ['status' => 'completed'])
        ->assertSessionHasErrors('status');
    expect($product->fresh()->stock)->toBe(5);

    $this->patch("/admin/procurements/{$procurement->id}/status", ['status' => 'approved'])
        ->assertRedirect();
    expect($procurement->fresh()->status)->toBe(ProcurementStatus::Approved)
        ->and($product->fresh()->stock)->toBe(5);

    $this->patch("/admin/procurements/{$procurement->id}/status", ['status' => 'completed'])
        ->assertRedirect();
    expect($procurement->fresh()->status)->toBe(ProcurementStatus::Completed)
        ->and($product->fresh()->stock)->toBe(9);

    $this->patch("/admin/procurements/{$procurement->id}/status", ['status' => 'completed'])
        ->assertSessionHasErrors('status');
    expect($product->fresh()->stock)->toBe(9);
});

test('non-admin users cannot access procurement management', function () {
    $supplierUser = User::factory()->create(['role' => UserRole::Supplier]);
    $supplier = Supplier::query()->create([
        'user_id' => $supplierUser->id,
        'name' => 'Supplier Pengujian '.Str::random(5),
    ]);
    [$adminUser] = createAdminProcurementAdmin();
    $procurement = createAdminProcurement(
        $adminUser,
        $supplier,
        ProcurementStatus::Pending
    );

    $this->actingAs($supplierUser)
        ->get('/admin/procurements')
        ->assertForbidden();

    $this->get('/admin/procurements/create')->assertForbidden();
    $this->post('/admin/procurements')->assertForbidden();
    $this->patch("/admin/procurements/{$procurement->id}/status", [
        'status' => 'approved',
    ])->assertForbidden();
});

test('admin can view procurement items and supplier summary', function () {
    [$adminUser] = createAdminProcurementAdmin();
    [$supplier] = createAdminProcurementSupplier();
    [$product] = createAdminProcurementProducts($adminUser);
    $procurement = createAdminProcurement($adminUser, $supplier, ProcurementStatus::Approved);
    ProcurementItem::query()->create([
        'procurement_id' => $procurement->id,
        'product_id' => $product->id,
        'quantity' => 3,
        'price' => 2500,
    ]);

    $this->actingAs($adminUser)
        ->get("/admin/procurements/{$procurement->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/procurements/show')
            ->where('procurement.number', 'PG-'.str_pad((string) $procurement->id, 6, '0', STR_PAD_LEFT))
            ->where('procurement.supplier.name', $supplier->name)
            ->where('procurement.items.0.productName', $product->name)
            ->where('procurement.items.0.subtotal', 7500)
            ->where('procurement.summary.totalQuantity', 3)
            ->where('procurement.summary.totalCost', 7500)
            ->where('procurement.canComplete', true));
});

function createAdminProcurementAdmin(): array
{
    $user = User::factory()->create(['role' => UserRole::Admin]);
    $admin = Admin::query()->create([
        'user_id' => $user->id,
        'name' => 'Admin Pengadaan '.Str::random(5),
    ]);

    return [$user, $admin];
}

function createAdminProcurementSupplier(): array
{
    $user = User::factory()->create(['role' => UserRole::Supplier]);
    $supplier = Supplier::query()->create([
        'user_id' => $user->id,
        'name' => 'Supplier '.Str::random(8),
        'alamat' => 'Jl. Supplier No. 1',
        'telp' => '08123456789',
    ]);

    return [$supplier, $user];
}

function createAdminProcurementProducts(User $owner): array
{
    $category = Category::query()->create([
        'name' => 'Kategori Pengadaan '.Str::random(8),
        'description' => 'Kategori untuk pengujian pengadaan.',
    ]);
    $products = [];

    foreach (['Produk Satu', 'Produk Dua'] as $name) {
        $products[] = Product::query()->create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'slug' => Str::uuid()->toString(),
            'name' => $name.' '.Str::random(5),
            'description' => 'Produk untuk pengujian pengadaan.',
            'price' => 5000,
            'stock' => 5,
        ]);
    }

    return $products;
}

function createAdminProcurement(
    User $adminUser,
    Supplier $supplier,
    ProcurementStatus $status
): Procurement {
    return Procurement::query()->create([
        'supplier_id' => $supplier->id,
        'admin_id' => $adminUser->admin->id,
        'tanggal_pengadaan' => now(),
        'status' => $status,
        'catatan' => null,
    ]);
}
