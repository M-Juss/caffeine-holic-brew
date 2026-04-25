<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Models\TestimonialController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->group(function(){
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::patch('/profile/password', [AuthController::class, 'changePassword']);

    Route::post('/testimonial', [TestimonialController::class, 'store']);
    Route::delete('/testimonial/{testimonial}', [TestimonialController::class, 'removeTestimonial']);

    // admin
    Route::apiResource('menu', MenuController::class);

    Route::prefix('cart')->group(function () {
        Route::get('/',                         [CartController::class, 'index']);
        Route::post('/items',                   [CartController::class, 'addItem']);
        Route::patch('/items/{cartItem}/increase', [CartController::class, 'increaseQuantity']);
        Route::patch('/items/{cartItem}/decrease', [CartController::class, 'decreaseQuantity']);
        Route::delete('/items/{cartItem}',      [CartController::class, 'removeItem']);
        Route::delete('/',                      [CartController::class, 'clearCart']);
        Route::post('/checkout',                [CartController::class, 'checkout']);
    });

    Route::prefix('orders')->group(function(){
        Route::get('/my-orders',                    [OrderController::class, 'myOrders']);
        Route::get('/{order}',               [OrderController::class, 'show']);
        Route::patch('/{order}/cancel',      [OrderController::class, 'cancel']);

        //admin
        Route::get('/',                           [OrderController::class, 'index']);
        Route::patch('/{order}/status',          [OrderController::class, 'updateStatus']);
    });

    Route::prefix('favorites')->group(function () {
        Route::get('/', [FavoriteController::class, 'index']);
        Route::post('/toggle', [FavoriteController::class, 'toggle']);
        Route::get('/check/{menu}', [FavoriteController::class, 'check']);
    });

});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
