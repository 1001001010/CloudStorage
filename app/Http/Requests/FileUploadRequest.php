<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class FileUploadRequest extends FormRequest
{
    /**
     * Право выполнения этого запроса
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Правила валидации при загрузки файла
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'folder_id' => 'required|numeric',
            'files' => 'required|array|min:1|max:5',
            'files.*' => [
                'file',
                'max:2048000',
                function($attribute, $value, $fail) {
                    $disallowedExtensions = ['exe', 'bat', 'sh'];
                    $extension = $value->getClientOriginalExtension();

                    if (in_array(strtolower($extension), $disallowedExtensions)) {
                        session()->flash('msg', 'Загрузка файлов с расширением .'.$extension.' запрещена');
                        $fail('Загрузка файлов с расширением .'.$extension.' запрещена');
                    }
                },
            ],
        ];
    }

}
