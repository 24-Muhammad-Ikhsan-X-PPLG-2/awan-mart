<?php

use App\Http\Controllers\AdminCatalogController;
use App\Http\Controllers\AdminCourierController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AdminProcurementController;
use App\Http\Controllers\AdminSupplierController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MidtransNotificationController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SupplierProcurementController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index']);
Route::get('/products', [ProductsController::class, 'index']);
Route::prefix('/categories')->group(function () {
    Route::get('/get', [CategoryController::class, 'get']);
    Route::get('/', [CategoryController::class, 'view']);
});
Route::post('/payment/notification', MidtransNotificationController::class);
Route::prefix('auth')->group(function () {
    // Buat authentication
    Route::middleware(['guest'])->group(function () {
        Route::get('/login', [AuthController::class, 'loginView'])->name('login');
        Route::post('/login', [AuthController::class, 'login']);

        Route::get('/register', [AuthController::class, 'registerView'])->name('register');
        Route::post('/register', [AuthController::class, 'register']);
    });
    Route::get('/logout', [AuthController::class, 'logout']);
});
Route::middleware(['auth'])->group(function () {
    // Keranjang
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'cart_view']);
        Route::get('/count', [CartController::class, 'cart_count']);
        Route::post('/item', [CartController::class, 'cart_add']);
        Route::patch('/item/{cartItem}', [CartController::class, 'cart_update']);
        Route::post('/items/bulk', [CartController::class, 'cart_add_bulk']);
        Route::delete('/items', [CartController::class, 'cart_delete']);
    });
    Route::post('/checkout', [CheckoutController::class, 'index']);
    Route::post('/checkout/store', [CheckoutController::class, 'store']);
    Route::post('/checkout/confirm-payment', [CheckoutController::class, 'confirmPayment']);
    Route::get('/checkout/payment/{orderNumber}', [CheckoutController::class, 'pendingPayment']);
    Route::post('/checkout/payment/{orderNumber}/cancel', [CheckoutController::class, 'cancelPayment']);
    Route::get('/payment/finish', [CheckoutController::class, 'finish'])
        ->name('payment.finish');
    Route::get('/checkout', function () {
        return redirect()->to('/cart');
    });
    Route::post('/user/address', [UserController::class, 'address']);
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::post('/reviews', [ReviewController::class, 'store'])
        ->middleware('role:pelanggan')
        ->name('reviews.store');

    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/', DashboardController::class)->name('admin.dashboard');
        Route::get('/products', [AdminCatalogController::class, 'products'])->name('admin.products.index');
        Route::get('/products/create', [AdminCatalogController::class, 'createProduct'])->name('admin.products.create');
        Route::post('/products', [AdminCatalogController::class, 'storeProduct'])->name('admin.products.store');
        Route::get('/products/{product}/edit', [AdminCatalogController::class, 'editProduct'])->name('admin.products.edit');
        Route::put('/products/{product}', [AdminCatalogController::class, 'updateProduct'])->name('admin.products.update');
        Route::delete('/products/{product}', [AdminCatalogController::class, 'destroyProduct'])->name('admin.products.destroy');
        Route::get('/categories', [AdminCatalogController::class, 'categories'])->name('admin.categories.index');
        Route::get('/categories/create', [AdminCatalogController::class, 'createCategory'])->name('admin.categories.create');
        Route::post('/categories', [AdminCatalogController::class, 'storeCategory'])->name('admin.categories.store');
        Route::get('/categories/{category}/edit', [AdminCatalogController::class, 'editCategory'])->name('admin.categories.edit');
        Route::put('/categories/{category}', [AdminCatalogController::class, 'updateCategory'])->name('admin.categories.update');
        Route::delete('/categories/{category}', [AdminCatalogController::class, 'destroyCategory'])->name('admin.categories.destroy');
        Route::get('/customers', [AdminCatalogController::class, 'customers'])->name('admin.customers.index');
        Route::get('/customers/create', [AdminCatalogController::class, 'createCustomer'])->name('admin.customers.create');
        Route::post('/customers', [AdminCatalogController::class, 'storeCustomer'])->name('admin.customers.store');
        Route::get('/customers/{customer}/edit', [AdminCatalogController::class, 'editCustomer'])->name('admin.customers.edit');
        Route::put('/customers/{customer}', [AdminCatalogController::class, 'updateCustomer'])->name('admin.customers.update');
        Route::delete('/customers/{customer}', [AdminCatalogController::class, 'destroyCustomer'])->name('admin.customers.destroy');
        Route::get('/suppliers', [AdminSupplierController::class, 'index'])->name('admin.suppliers.index');
        Route::get('/suppliers/create', [AdminSupplierController::class, 'create'])->name('admin.suppliers.create');
        Route::post('/suppliers', [AdminSupplierController::class, 'store'])->name('admin.suppliers.store');
        Route::get('/suppliers/{supplier}/edit', [AdminSupplierController::class, 'edit'])->name('admin.suppliers.edit');
        Route::put('/suppliers/{supplier}', [AdminSupplierController::class, 'update'])->name('admin.suppliers.update');
        Route::delete('/suppliers/{supplier}', [AdminSupplierController::class, 'destroy'])->name('admin.suppliers.destroy');
        Route::get('/couriers', [AdminCourierController::class, 'index'])->name('admin.couriers.index');
        Route::get('/couriers/create', [AdminCourierController::class, 'create'])->name('admin.couriers.create');
        Route::post('/couriers', [AdminCourierController::class, 'store'])->name('admin.couriers.store');
        Route::get('/couriers/{courier}/edit', [AdminCourierController::class, 'edit'])->name('admin.couriers.edit');
        Route::put('/couriers/{courier}', [AdminCourierController::class, 'update'])->name('admin.couriers.update');
        Route::delete('/couriers/{courier}', [AdminCourierController::class, 'destroy'])->name('admin.couriers.destroy');
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('admin.orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('admin.orders.show');
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])
            ->name('admin.orders.update-status');
        Route::get('/procurements', [AdminProcurementController::class, 'index'])
            ->name('admin.procurements.index');
        Route::get('/procurements/create', [AdminProcurementController::class, 'create'])
            ->name('admin.procurements.create');
        Route::get('/procurements/options', [AdminProcurementController::class, 'options'])
            ->name('admin.procurements.options');
        Route::post('/procurements', [AdminProcurementController::class, 'store'])
            ->name('admin.procurements.store');
        Route::get('/procurements/{procurement}', [AdminProcurementController::class, 'show'])
            ->name('admin.procurements.show');
        Route::patch('/procurements/{procurement}/status', [AdminProcurementController::class, 'updateStatus'])
            ->name('admin.procurements.update-status');
    });
    Route::prefix('supplier')->middleware('role:supplier')->group(function () {
        Route::get('/deliveries', [\App\Http\Controllers\SupplierDeliveryController::class, 'index'])
            ->name('supplier.deliveries.index');
        Route::patch('/deliveries/{order}/complete', [\App\Http\Controllers\SupplierDeliveryController::class, 'complete'])
            ->name('supplier.deliveries.complete');
        Route::get('/procurements', [SupplierProcurementController::class, 'index'])
            ->name('supplier.procurements.index');
        Route::get('/procurements/{procurement}', [SupplierProcurementController::class, 'show'])
            ->name('supplier.procurements.show');
        Route::patch('/procurements/{procurement}/accept', [SupplierProcurementController::class, 'accept'])
            ->name('supplier.procurements.accept');
        Route::patch('/procurements/{procurement}/reject', [SupplierProcurementController::class, 'reject'])
            ->name('supplier.procurements.reject');
        Route::patch('/procurements/{procurement}/ship', [SupplierProcurementController::class, 'ship'])
            ->name('supplier.procurements.ship');
    });
});
// Detail Product
Route::get('/products/{product:slug}', [HomeController::class, 'product']);
Route::get('/search/products', [ProductsController::class, 'search'])
    ->name('products.search');
