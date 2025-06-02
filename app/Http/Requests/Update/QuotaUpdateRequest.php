<?php

namespace App\Http\Requests\Update;

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
            'quota' => ['required', 'numeric', 'min:0'],
            'unit' => ['sometimes', 'string', 'in:MB,GB'],
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
            'quota.required' => 'Значение квоты обязательно',
            'quota.numeric' => 'Значение квоты должно быть числом',
            'quota.min' => 'Значение квоты должно быть положительным',
            'unit.in' => 'Единица измерения должна быть MB или GB',
        ];
    }
}
