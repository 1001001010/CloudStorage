<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;
use App\Models\User;

class RegisterRequest extends FormRequest
{
    /**
     * Имеет ли пользователь право выполнить этот запрос
     *
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Правила валидации для запроса
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:40',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];
    }

    /**
     * Сообщения об ошибках валидации
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
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
        ];
    }

}
