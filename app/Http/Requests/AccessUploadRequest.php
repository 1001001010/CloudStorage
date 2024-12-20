<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class AccessUploadRequest extends FormRequest
{
    /**
    * Право выполнения этого запроса
    */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Правила валидации при поздании доступа к файлу
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file_id' => 'required|numeric|min:1',
            'user_limit' => 'required|numeric|min:1|max:50',
        ];
    }
}
