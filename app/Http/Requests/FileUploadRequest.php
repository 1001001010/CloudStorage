<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class FileUploadRequest extends FormRequest
{
    /**
     * Право выполнения этого запроса
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Правила валидации при загрузке файла
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'folder_id' => 'nullable|numeric',
            'files' => 'required|array|min:1',
            'files.*' => [
                'file',
                'max:2048000'
            ],
        ];
    }
}
