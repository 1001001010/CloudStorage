<?php

namespace App\Providers;

use Illuminate\Support\Facades\{
    Vite,
    Auth
};
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Inertia::share([
            'msg' => fn () => session('msg')
        ]);
    }
}
