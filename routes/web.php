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
use App\Http\Controllers\SupplierDeliveryController;
use App\Http\Controllers\SupplierProcurementController;
use App\Http\Controllers\UserController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index']);
Route::get('/about', fn () => Inertia::render('about'));
Route::get('/help', fn () => Inertia::render('help'));

Route::prefix('products')->group(function () {
    Route::get('/', [ProductsController::class, 'index']);
    Route::get('/{product:slug}', [HomeController::class, 'product']);
});

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'view']);
    Route::get('/get', [CategoryController::class, 'get']);
});

Route::get('/search/products', [ProductsController::class, 'search'])
    ->name('products.search');

Route::post('/payment/notification', MidtransNotificationController::class);

Route::prefix('auth')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AuthController::class, 'loginView'])->name('login');
        Route::post('/login', [AuthController::class, 'login']);
        Route::get('/register', [AuthController::class, 'registerView'])->name('register');
        Route::post('/register', [AuthController::class, 'register']);
    });

    Route::get('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth')->group(function () {
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'cart_view']);
        Route::get('/count', [CartController::class, 'cart_count']);
        Route::post('/item', [CartController::class, 'cart_add']);
        Route::patch('/item/{cartItem}', [CartController::class, 'cart_update']);
        Route::post('/items/bulk', [CartController::class, 'cart_add_bulk']);
        Route::delete('/items', [CartController::class, 'cart_delete']);
    });

    Route::prefix('checkout')->group(function () {
        Route::post('/', [CheckoutController::class, 'index']);
        Route::post('/store', [CheckoutController::class, 'store']);
        Route::post('/confirm-payment', [CheckoutController::class, 'confirmPayment']);
        Route::get('/payment/{orderNumber}', [CheckoutController::class, 'pendingPayment']);
        Route::post('/payment/{orderNumber}/cancel', [CheckoutController::class, 'cancelPayment']);
        Route::get('/', fn () => redirect()->to('/cart'));
    });

    Route::prefix('payment')->group(function () {
        Route::get('/finish', [CheckoutController::class, 'finish'])
            ->name('payment.finish');
    });

    Route::post('/user/address', [UserController::class, 'address']);
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);

    Route::post('/reviews', [ReviewController::class, 'store'])
        ->middleware('role:pelanggan')
        ->name('reviews.store');

    Route::prefix('admin')
        ->name('admin.')
        ->middleware('role:admin')
        ->group(function () {
            Route::get('/', DashboardController::class)->name('dashboard');

            Route::prefix('products')->name('products.')->group(function () {
                Route::get('/', [AdminCatalogController::class, 'products'])->name('index');
                Route::get('/create', [AdminCatalogController::class, 'createProduct'])->name('create');
                Route::post('/', [AdminCatalogController::class, 'storeProduct'])->name('store');
                Route::get('/{product}/edit', [AdminCatalogController::class, 'editProduct'])->name('edit');
                Route::put('/{product}', [AdminCatalogController::class, 'updateProduct'])->name('update');
                Route::delete('/{product}', [AdminCatalogController::class, 'destroyProduct'])->name('destroy');
            });

            Route::prefix('categories')->name('categories.')->group(function () {
                Route::get('/', [AdminCatalogController::class, 'categories'])->name('index');
                Route::get('/create', [AdminCatalogController::class, 'createCategory'])->name('create');
                Route::post('/', [AdminCatalogController::class, 'storeCategory'])->name('store');
                Route::get('/{category}/edit', [AdminCatalogController::class, 'editCategory'])->name('edit');
                Route::put('/{category}', [AdminCatalogController::class, 'updateCategory'])->name('update');
                Route::delete('/{category}', [AdminCatalogController::class, 'destroyCategory'])->name('destroy');
            });

            Route::prefix('customers')->name('customers.')->group(function () {
                Route::get('/', [AdminCatalogController::class, 'customers'])->name('index');
                Route::get('/create', [AdminCatalogController::class, 'createCustomer'])->name('create');
                Route::post('/', [AdminCatalogController::class, 'storeCustomer'])->name('store');
                Route::get('/{customer}/edit', [AdminCatalogController::class, 'editCustomer'])->name('edit');
                Route::put('/{customer}', [AdminCatalogController::class, 'updateCustomer'])->name('update');
                Route::delete('/{customer}', [AdminCatalogController::class, 'destroyCustomer'])->name('destroy');
            });

            Route::prefix('suppliers')->name('suppliers.')->group(function () {
                Route::get('/', [AdminSupplierController::class, 'index'])->name('index');
                Route::get('/create', [AdminSupplierController::class, 'create'])->name('create');
                Route::post('/', [AdminSupplierController::class, 'store'])->name('store');
                Route::get('/{supplier}/edit', [AdminSupplierController::class, 'edit'])->name('edit');
                Route::put('/{supplier}', [AdminSupplierController::class, 'update'])->name('update');
                Route::delete('/{supplier}', [AdminSupplierController::class, 'destroy'])->name('destroy');
            });

            Route::prefix('couriers')->name('couriers.')->group(function () {
                Route::get('/', [AdminCourierController::class, 'index'])->name('index');
                Route::get('/create', [AdminCourierController::class, 'create'])->name('create');
                Route::post('/', [AdminCourierController::class, 'store'])->name('store');
                Route::get('/{courier}/edit', [AdminCourierController::class, 'edit'])->name('edit');
                Route::put('/{courier}', [AdminCourierController::class, 'update'])->name('update');
                Route::delete('/{courier}', [AdminCourierController::class, 'destroy'])->name('destroy');
            });

            Route::prefix('orders')->name('orders.')->group(function () {
                Route::get('/', [AdminOrderController::class, 'index'])->name('index');
                Route::get('/{order}', [AdminOrderController::class, 'show'])->name('show');
                Route::patch('/{order}/status', [AdminOrderController::class, 'updateStatus'])
                    ->name('update-status');
            });

            Route::prefix('procurements')->name('procurements.')->group(function () {
                Route::get('/', [AdminProcurementController::class, 'index'])->name('index');
                Route::get('/create', [AdminProcurementController::class, 'create'])->name('create');
                Route::get('/options', [AdminProcurementController::class, 'options'])->name('options');
                Route::post('/', [AdminProcurementController::class, 'store'])->name('store');
                Route::get('/{procurement}', [AdminProcurementController::class, 'show'])->name('show');
                Route::patch('/{procurement}/status', [AdminProcurementController::class, 'updateStatus'])
                    ->name('update-status');
            });
        });

    Route::prefix('supplier')
        ->name('supplier.')
        ->middleware('role:supplier')
        ->group(function () {
            Route::prefix('deliveries')->name('deliveries.')->group(function () {
                Route::get('/', [SupplierDeliveryController::class, 'index'])->name('index');
                Route::patch('/{order}/complete', [SupplierDeliveryController::class, 'complete'])
                    ->name('complete');
            });

            Route::prefix('procurements')->name('procurements.')->group(function () {
                Route::get('/', [SupplierProcurementController::class, 'index'])->name('index');
                Route::get('/{procurement}', [SupplierProcurementController::class, 'show'])->name('show');
                Route::patch('/{procurement}/accept', [SupplierProcurementController::class, 'accept'])
                    ->name('accept');
                Route::patch('/{procurement}/reject', [SupplierProcurementController::class, 'reject'])
                    ->name('reject');
                Route::patch('/{procurement}/ship', [SupplierProcurementController::class, 'ship'])
                    ->name('ship');
            });
        });
});
