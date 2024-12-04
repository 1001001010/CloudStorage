<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\File;
use App\Models\Folder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\FileUploadRequest;

class FileController extends Controller
{
    /**
     * Загрузка файла
     */

    public function upload(FileUploadRequest $request) {

        // Проверка существования папки
        $folder = Folder::find($request->folder_id);
        if (!$folder) {
            return redirect()->back()->with('msg', 'Папка не найдена');
        }

        foreach ($request->file('files') as $file) {
            // Генерация уникального имени для файла
            $newName = Str::random(40) . '.' . $file->getClientOriginalExtension();

            // Сохранение файла в папку 'files' в storage
            $path = $file->storeAs('files', $newName, 'public'); // используем диск 'public'

            File::create([
                'name' => $newName,
                'folder_id' => $folder->id,
                'user_id' => Auth::id(),
                'size' => $file->getSize(),
            ]);
        }

        return redirect()->route('index')->with('msg', 'Файлы успешно загружены.');
    }

}
