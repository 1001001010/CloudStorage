<?php

use App\Http\Controllers\{ProfileController, MainController,
    FolderController, FileController, TrashController, EditorController,
    AdminController, FileAccessTokenController};
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\{GetUserFolders, GetUserFoldersAndFiles, IsAdmin};


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
            Route::patch('/file/rename/{file}', 'rename')->name('file.rename')->whereNumber('file');
            Route::patch('/file/restore/{file}', 'restore')->name('file.restore')->whereNumber('file');
            Route::delete('/file/delete/{file}', 'delete')->name('file.delete')->whereNumber('file');
            Route::delete('/file/delete/force/{file}', 'forceDelete')->name('file.force.delete')->whereNumber('file');
        });
        Route::controller(EditorController::class)->group(function () {
            Route::get('/editor/{file}', 'index')->name('file.edit')->whereNumber('file');
            Route::post('/editor/{file}', 'upload')->name('file.edit.upload')->whereNumber('file');
        });
        Route::controller(TrashController::class)->group(function () {
            Route::get('/trash', 'index')->name('trash.index');
        });
        Route::controller(FileAccessTokenController::class)->group(function () {
            Route::post('/access/create', 'upload')->name('access.upload');
            Route::get('/access/{token}', 'invite')->name('access.user.upload');
        });
    });

    Route::middleware(IsAdmin::class)->group(function () {
        Route::controller(AdminController::class)->group(function () {
            Route::get('/admin', 'index')->name('admin.users');
        });
    });

});

require __DIR__.'/auth.php';
