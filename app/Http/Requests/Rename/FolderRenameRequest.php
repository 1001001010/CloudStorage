<?php

namespace App\Http\Requests\Rename;

use Illuminate\Foundation\Http\FormRequest;

class FolderRenameRequest extends FormRequest
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
     * Сообщения об ошибках для каждого правила валидации
     *
     * @return array
     */
    public function messages() {
        return [
            'name.required' => 'Поле "Имя папки" обязательно для заполнения',
            'name.string' => 'Имя папки должно быть строкой',
            'name.min' => 'Имя папки должно содержать хотя бы 1 символ',
            'name.max' => 'Имя папки не может превышать 50 символов',
            'name.regex' => 'Имя папки содержит недопустимые символы',
        ];
    }

}
