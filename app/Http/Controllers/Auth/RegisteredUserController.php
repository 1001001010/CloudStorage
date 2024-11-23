<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Рендер страницы регистрации
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Обробатываем запрос регистрации
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:40',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'name.required' => 'Укажите ваше имя',
            'name.string' => 'Поля имя должно быть строкой',
            'name.max' => 'Максимальная длина - 40 символов',
            'email.required' => 'Укажите вашу почту',
            'email.string' => 'Поля Email должно быть строкой',
            'email.lowercase' => 'Поля Email не должно иметь заглавных символов',
            'email.email' => 'Поля Email должно быть почтой',
            'email.max' => 'Максимальная длина - 255 символов',
            'email.unique' => 'Эта почта уже занята',
            'password.required' => 'Укажите ваш пароль',
            'password.confirmed' => 'Подтвердите ваш пароль',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('profile.index', absolute: false));
    }
}
