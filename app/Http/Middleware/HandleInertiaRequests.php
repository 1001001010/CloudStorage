<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

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
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()->load('quota'),
            ],
        ];
    }
}
