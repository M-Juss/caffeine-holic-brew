<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middlewaare('auth:sanctum')->group(function(){
    Route::apiResource('menu', MenuController::class);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

