<?php

namespace App\Http\Requests\Upload;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class FolderUploadRequest extends FormRequest
{
    /**
     * Определяет, имеет ли пользователь право выполнить этот запрос
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Получение правил валидации, которые применяются к запросу
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:20',
                'regex:/^[^\\/:*?"<>|]*$/',
                'regex:/^(?!.*(\.|\.\.|\bCON\b|\bPRN\b|\bAUX\b|\bNUL\b|\bCOM\d\b|\bLPT\d\b)).*$/i'
            ],
            'folder' => 'required|integer|min:0'
        ];
    }

}
