<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index']);
Route::prefix('auth')->group(function () {
    Route::middleware(['guest'])->group(function () {
        Route::get('/login', [AuthController::class, 'loginView']);
        Route::post('/login', [AuthController::class, 'login']);

        Route::get('/register', [AuthController::class, 'registerView']);
        Route::post('/register', [AuthController::class, 'register']);
    });
    Route::get('/logout', [AuthController::class, 'logout']);
});
