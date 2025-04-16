<?php

namespace App\Http\Requests\Rename;

use Illuminate\Foundation\Http\FormRequest;

class FileRenameRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Валидация данных запроса
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'name' => [
                'required',
                'string',
                'min:1',
                'max:50',
                'regex:/^[^\\/:*?"<>|]*$/',
                'regex:/^(?!.*(\.|\.\.|\bCON\b|\bPRN\b|\bAUX\b|\bNUL\b|\bCOM\d\b|\bLPT\d\b)).*$/i'
            ]
        ];
    }

    /**
     * Получение сообщений об ошибках
     *
     * @return array
     */
    public function messages() {
        return [
            'name.required' => 'Поле "Имя" обязательно для заполнения',
            'name.string' => 'Имя файла должно быть строкой',
            'name.min' => 'Имя файла должно содержать хотя бы 1 символ',
            'name.max' => 'Имя файла не может превышать 50 символов',
            'name.regex' => 'Имя файла содержит недопустимые символы',
        ];
    }
}
