<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuotaUpdateRequest extends FormRequest
{
    /**
     * Может ли пользователь выполнить запрос
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Правила валидации, применяемые к запросу
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'quota' => 'required|numeric|min:1',
        ];
    }

    /**
     * Кастомные сообщения об ошибках валидации
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'quota.required' => 'Поле "Квота" обязательно для заполнения',
            'quota.numeric'  => 'Поле "Квота" должно быть числом',
            'quota.min'      => 'Поле "Квота" не может быть отрицательным',
        ];
    }

}
