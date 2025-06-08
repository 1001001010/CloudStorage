<?php

namespace App\Http\Controllers\Auth;

use App\Services\User\GitHubAuthService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\{
    RedirectResponse,
    Request
};
use Illuminate\Support\Facades\{
    Auth,
    Route,
    Hash
};
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Inertia\{
    Inertia,
    Response
};

class AuthenticatedSessionController extends Controller {

    public function __construct(
        protected GitHubAuthService $githubAuthService,
    ) {}

    /**
     * Рендер страницы входа
     *
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Обробатываем запрос входа
     *
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('profile.index', absolute: false));
    }

    /**
     * Удаление сессии
     *
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect(route('index'));
    }

    /**
     * Редирект на GitHub
     *
     * @return RedirectResponse
     */
    public function RedirectGithub() : RedirectResponse {
        return Socialite::driver('github')->redirect();
    }

    /**
     * Callback для GitHub
     *
     * @return RedirectResponse
     */
    public function CallbackGithub(): RedirectResponse
    {
        $user = $this->githubAuthService->handleGithubCallback();

        if ($user === null) {
            return redirect(route('login'))->with('error', 'Используйте логин-пароль для входа');
        }

        return redirect(route('profile.index'));
    }
}