<?php

use App\Http\Controllers\{ProfileController, MainController};
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

Route::get('/', [MainController::class, 'index'])->name('index');

Route::middleware('auth')->group(function () {
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'index')->name('profile.index');
        Route::patch('/profile/edit', 'update')->name('profile.update');
        Route::delete('/profile/session/destroy','destroy')->name('session.destroy');
    });
});

require __DIR__.'/auth.php';
