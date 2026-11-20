<?php

use App\Models\Admin;
use App\Models\Category;
use App\Models\Procurement;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

test('admin can create update search and delete an unused supplier account', function () {
    $admin = createSupplierManagementAdmin();

    $this->actingAs($admin)
        ->post('/admin/suppliers', [
            'name' => 'Supplier Baru',
            'email' => 'supplier-baru@example.test',
            'phone' => '081234567890',
            'address' => 'Jl. Supplier No. 1',
            'password' => 'password-rahasia',
            'password_confirmation' => 'password-rahasia',
        ])
        ->assertRedirect();

    $supplier = Supplier::query()->where('name', 'Supplier Baru')->firstOrFail();
    expect($supplier->user->role)->toBe(UserRole::Supplier)
        ->and($supplier->user->email)->toBe('supplier-baru@example.test')
        ->and($supplier->telp)->toBe('081234567890')
        ->and($supplier->alamat)->toBe('Jl. Supplier No. 1')
        ->and($supplier->user->password)->not->toBe('password-rahasia');

    $this->actingAs($admin)
        ->get('/admin/suppliers?search=supplier-baru@example.test')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/suppliers/index')
            ->where('suppliers.total', 1)
            ->where('suppliers.data.0.name', 'Supplier Baru')
            ->where('suppliers.data.0.email', 'supplier-baru@example.test')
            ->where('suppliers.data.0.isCourier', false));

    $this->actingAs($admin)
        ->put("/admin/suppliers/{$supplier->id}", [
            'name' => 'Supplier Diperbarui',
            'email' => 'supplier-update@example.test',
            'phone' => '',
            'address' => 'Alamat baru',
            'password' => '',
            'password_confirmation' => '',
        ])
        ->assertRedirect();

    expect($supplier->fresh()->name)->toBe('Supplier Diperbarui')
        ->and($supplier->fresh()->user->email)->toBe('supplier-update@example.test')
        ->and($supplier->fresh()->alamat)->toBe('Alamat baru');

    $this->actingAs($admin)
        ->delete("/admin/suppliers/{$supplier->id}")
        ->assertRedirect();

    expect(Supplier::query()->find($supplier->id))->toBeNull()
        ->and(User::query()->find($supplier->user_id))->toBeNull();
});

test('supplier accounts cannot be deleted while products or procurements depend on them', function () {
    $admin = createSupplierManagementAdmin();
    [$user, $supplier] = createManagedSupplier('Supplier Dengan Produk');
    $category = Category::query()->create([
        'name' => 'Kategori Supplier '.Str::random(8),
        'description' => 'Kategori pengujian supplier.',
    ]);
    Product::query()->create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'slug' => Str::uuid()->toString(),
        'name' => 'Produk Milik Supplier',
        'description' => 'Produk terkait akun supplier.',
        'price' => 10000,
        'stock' => 4,
    ]);

    $this->actingAs($admin)
        ->from('/admin/suppliers')
        ->delete("/admin/suppliers/{$supplier->id}")
        ->assertRedirect('/admin/suppliers')
        ->assertSessionHasErrors('supplier');

    [$secondUser, $secondSupplier] = createManagedSupplier('Supplier Dengan Pengadaan');
    Procurement::query()->create([
        'supplier_id' => $secondSupplier->id,
        'admin_id' => $admin->admin->id,
        'tanggal_pengadaan' => now(),
        'status' => 'pending',
    ]);

    $this->delete("/admin/suppliers/{$secondSupplier->id}")
        ->assertSessionHasErrors('supplier');

    expect($user->fresh())->not->toBeNull()
        ->and($secondUser->fresh())->not->toBeNull();
});

test('non-admin users cannot manage supplier accounts', function () {
    [$customer] = createManagedSupplierFixtureForRoleTest();

    $this->actingAs($customer)
        ->get('/admin/suppliers')
        ->assertForbidden();
});

function createSupplierManagementAdmin(): User
{
    $user = User::factory()->create(['role' => UserRole::Admin]);
    Admin::query()->create([
        'user_id' => $user->id,
        'name' => 'Admin Supplier',
    ]);

    return $user;
}

function createManagedSupplier(string $name): array
{
    $user = User::factory()->create(['role' => UserRole::Supplier]);
    $supplier = Supplier::query()->create([
        'user_id' => $user->id,
        'name' => $name.' '.Str::random(5),
        'alamat' => 'Alamat supplier',
        'telp' => '08123456789',
    ]);

    return [$user, $supplier];
}

function createManagedSupplierFixtureForRoleTest(): array
{
    return [User::factory()->create(['role' => UserRole::Pelanggan])];
}
