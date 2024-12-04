<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class FileUploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'folder_id' => 'required|numeric|min:0',
            'files' => 'required|array|min:1|max:5',
            'files.*' => [
                'file',
                'max:2048000',
                function($attribute, $value, $fail) {
                    $disallowedExtensions = ['exe', 'bat', 'sh'];
                    $extension = $value->getClientOriginalExtension();

                    if (in_array(strtolower($extension), $disallowedExtensions)) {
                        $fail('Загрузка файлов с расширением .'.$extension.' запрещена.');
                    }
                },
            ],
        ];
    }
}
