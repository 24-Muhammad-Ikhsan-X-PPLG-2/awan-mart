<?php

use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AdminProcurementController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MidtransNotificationController;
use App\Http\Controllers\ProductsController;
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

    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/', DashboardController::class)->name('admin.dashboard');
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
