<?php

use App\Http\Controllers\{
    ProfileController,
    MainController,
    FolderController,
    FileController,
    TrashController,
    EditorController,
    AdminController,
    FileAccessTokenController,
    PrivateFileController
};
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\{
    GetUserFolders,
    GetUserFoldersAndFiles,
    IsAdmin
};

require __DIR__.'/auth.php';

Route::middleware([GetUserFolders::class, GetUserFoldersAndFiles::class])->group(function () {
    Route::middleware('auth')->group(function () {
        Route::controller(ProfileController::class)->group(function () {
            Route::get('/profile', 'index')->name('profile.index');
            Route::patch('/profile/edit', 'update')->name('profile.update');
            Route::delete('/profile/session/destroy','destroy')->name('session.destroy');
        });
        Route::controller(FolderController::class)->group(function () {
            Route::post('/folder/upload', 'upload')->name('folder.upload');
            Route::delete('/folder/delete/{folder}', 'delete')->name('folder.delete')->whereNumber('folder');
            Route::patch('/folder/rename/{folder}', 'rename')->name('folder.rename')->whereNumber('folder');
        });
        Route::controller(FileController::class)->group(function () {
            Route::post('/file', 'upload')->name('file.upload');
            Route::get('/file/download/{file}', 'download')->name('file.download')->whereNumber('file');
            Route::patch('/file/rename/{file}', 'rename')->name('file.rename')->whereNumber('file');
            Route::delete('/file/delete/{file}', 'delete')->name('file.delete')->whereNumber('file');
            Route::put('/file/restore/{file}', 'restore')->name('file.restore')->withTrashed()->whereNumber('file');
            Route::delete('/file/delete/force/{file}', 'forceDelete')->withTrashed()->name('file.force.delete')->whereNumber('file');
        });
        Route::controller(PrivateFileController::class)->group(function () {
            Route::get('/api/file-url/{id}', 'getFileUrl');
            Route::get('/private/file/photo/{id}', 'showImage')->name('private.file');
            Route::get('/private/file/video/{id}', 'showVideo')->name('private.video');
        });
        Route::controller(EditorController::class)->group(function () {
            Route::get('/editor/{file}', 'index')->name('file.edit')->whereNumber('file');
            Route::post('/editor/{file}', 'upload')->name('file.edit.upload')->whereNumber('file');
        });
        Route::controller(TrashController::class)->group(function () {
            Route::get('/trash', 'index')->name('trash.index');
        });
        Route::controller(FileAccessTokenController::class)->group(function () {
            Route::get('/shared', 'index')->name('shared.index');
            Route::post('/access/create', 'upload')->name('access.upload');
            Route::get('/access/{token}', 'invite')->name('access.user.upload');
        });
    });

    Route::get('/{category?}', [MainController::class, 'index'])->name('index');

    Route::middleware(IsAdmin::class)->prefix('admin')->controller(AdminController::class)->group(function () {
        Route::get('/users', 'index')->name('admin.users');
        Route::get('/stats', 'stats')->name('admin.stats');
        Route::patch('/user/{user}/role/update', 'update_role')->name('admin.role.update')->whereNumber('user');
        Route::patch('/user/{user}/password/update', 'update_password')->name('admin.password.update')->whereNumber('user');
        Route::get('/statistics/export', 'excel')->middleware('auth')->name('statistics.export');
        Route::get('/reports/pdf', 'generateReport')->name('reports.pdf');
    });
});
