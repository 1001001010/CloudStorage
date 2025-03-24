<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\{
    Artisan
};

Artisan::command('files:purge-deleted', function () {
    $thirtyDaysAgo = \Illuminate\Support\Carbon::now()->subDays(5);

    \App\Models\File::onlyTrashed()
        ->where('deleted_at', '<=', $thirtyDaysAgo)
        ->forceDelete();

    $this->info('Корзины были очищены');
})->purpose('Purge deleted files older than 30 days')->everyFiveMinutes();
