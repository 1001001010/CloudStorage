<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
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
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
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
     * Получение пользователя GitHub
     *
     * @return RedirectResponse
     */
    public function CallbackGithub() : RedirectResponse {
        $user = Socialite::driver('github')->user();
        $existingUser = User::where('email', $user->email)->first();

        if (!$existingUser) {
            $newUser = User::create([
                'name' => $user->nickname,
                'email' => $user->email,
                'provider' => 'github',
                'password' => Hash::make(Str::random(16))
            ]);

            Auth::login($newUser);
            return redirect(route('profile.index'));
        } else {
            if ($existingUser->provider === 'github') {
                Auth::login($existingUser);
                return redirect(route('profile.index'));
            } else {
                return redirect(route('login'))->with('error', 'Используйте логин-пароль для входа');
            }
        }
    }
}
