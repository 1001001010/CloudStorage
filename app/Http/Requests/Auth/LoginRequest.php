<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Имеет ли пользователь сделать право на этот запрос
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Определяем правила валидации для запроса
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Определяем сообщения при ошибках валидации
     *
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Укажите ваш email',
            'email.string' => 'Поле email должно быть строкой',
            'email.email' => 'Поле email должно быть адресом электронной почты',
            'password.required' => 'Укажите пароль',
            'password.string' => 'Пароль должно быть строкой.',
            'credentials' => 'Неправильный логин или пароль'
        ];
    }

    /**
     * Проверка подлинности учетных данных запроса
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $user = User::where('email', $this->input('email'))->first();

        if ($user && $user->provider === 'github') {
            throw ValidationException::withMessages([
                'email' => 'Используйте GitHub для авторизации',
            ]);
        }

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }


    /**
     * Проверка скорости запроса на вход
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Получение ключа ограничения скорости для запроса
     *
     * @return string
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
