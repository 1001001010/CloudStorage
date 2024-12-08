<?php

use App\Http\Controllers\{ProfileController, MainController,
    FolderController, FileController};
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\{GetUserFolders, GetUserFoldersAndFiles};


Route::middleware([GetUserFolders::class, GetUserFoldersAndFiles::class])->group(function () {
    Route::get('/', [MainController::class, 'index'])->name('index');

    Route::middleware('auth')->group(function () {
        Route::controller(ProfileController::class)->group(function () {
            Route::get('/profile', 'index')->name('profile.index');
            Route::patch('/profile/edit', 'update')->name('profile.update');
            Route::delete('/profile/session/destroy','destroy')->name('session.destroy');
        });
        Route::controller(FolderController::class)->group(function () {
            Route::post('/folder/upload', 'upload')->name('folder.upload');
        });
        Route::controller(FileController::class)->group(function () {
            Route::post('/file', 'upload')->name('file.upload');
            Route::get('/file/download/{file}', 'download')->name('file.download');
        });
    });
});

require __DIR__.'/auth.php';
