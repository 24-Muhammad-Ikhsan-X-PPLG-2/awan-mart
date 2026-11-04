<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index']);
Route::prefix('auth')->group(function () {
    // Buat authentication
    Route::middleware(['guest'])->group(function () {
        Route::get('/login', [AuthController::class, 'loginView']);
        Route::post('/login', [AuthController::class, 'login']);

        Route::get('/register', [AuthController::class, 'registerView']);
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
});
// Detail Product
Route::get('/products/{product:slug}', [HomeController::class, 'product']);
