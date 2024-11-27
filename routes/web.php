<?php

use App\Http\Controllers\{ProfileController, MainController,
    FolderController};
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\GetUserFoldersAndFiles;

Route::get('/', [MainController::class, 'index'])->middleware(GetUserFoldersAndFiles::class)->name('index');

Route::middleware([GetUserFoldersAndFiles::class, 'auth'])->group(function () {
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'index')->name('profile.index');
        Route::patch('/profile/edit', 'update')->name('profile.update');
        Route::delete('/profile/session/destroy','destroy')->name('session.destroy');
    });
    Route::controller(FolderController::class)->group(function () {
        Route::post('/folder/upload', 'upload')->name('folder.upload');
    });
});

require __DIR__.'/auth.php';
