<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\File;

class HandleInertiaRequests extends Middleware
{
    /**
     * Корневой шаблон, который загружается при первом посещении страницы
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Определяет текущую версию ассетов
     *
     * @param Request $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Определяет параметры, которые будут общими по умолчанию
     *
     * @param Request $request
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $totalSize = 0;

        if ($user) {
            $user->load('quota');

            $totalSize = File::withTrashed()
                ->where('user_id', $user->id)
                ->sum('size');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'totalSize' => $totalSize,
            'msg' => fn() => session('msg')
        ];
    }
}
