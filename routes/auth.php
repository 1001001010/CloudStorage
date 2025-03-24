<?php

use App\Http\Controllers\Auth\{
    AuthenticatedSessionController,
    PasswordController,
    RegisteredUserController
};
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::controller(RegisteredUserController::class)->group(function () {
        Route::get('register', 'create')->name('register');
        Route::post('register', 'store');
    });
    Route::controller(AuthenticatedSessionController::class)->group(function () {
        Route::get('login', 'create')->name('login');
        Route::post('login', 'store');
        Route::get('/login/github', 'RedirectGithub')->name('login.github');
        Route::get('/login/github/callback', 'CallbackGithub')->name('login.github.call');
    });
});

Route::middleware('auth')->group(function () {
    Route::put('password', [PasswordController::class, 'update'])->name('password.update');
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
