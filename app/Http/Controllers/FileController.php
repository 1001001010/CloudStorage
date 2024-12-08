<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Storage, Auth};
use Illuminate\Support\Str;
use App\Http\Requests\FileUploadRequest;
use App\Models\{File, Folder, FileExtension,
    MimeType};

class FileController extends Controller
{
    /**
     * Загрузка файла
     */
    public function upload(FileUploadRequest $request) {

        // Проверка существования папки
        if ($request->folder_id && $request->folder_id != 0) {
            $folder = Folder::where('id', $request->folder_id)
                            ->where('user_id', Auth::id())
                            ->first();

            if (!$folder) {
                return redirect()->back()->with('msg', 'Папка не найдена или она не принадлежит вам');
            }
        }


        foreach ($request->file('files') as $file) {
            $fileExtension = $file->getClientOriginalExtension(); // Расширение файла
            $mimeType = $file->getMimeType();  // MIME тип файла
            $fileHash = hash_file('sha256', $file->getRealPath()); // Генерируем хэш файла

            // Генерация уникального имени для файла
            $timePart = time();
            $randomPart = Str::random(20);
            $newPath = $timePart . '_' . $randomPart . '.' . $fileExtension;
            if (strlen($newPath) > 40) { // Проверка на итоговую длину
                $newPath = substr($newPath, 0, 40 - strlen($fileExtension) - 1) . '.' . $fileExtension;
            }

            $extension = FileExtension::firstOrCreate(
                ['extension' => $fileExtension]
            );

            $mime = MimeType::firstOrCreate(
                ['mime_type' => $mimeType]
            );

            $existingFile = File::where('file_hash', $fileHash)->where('user_id', Auth::id())->first(); // Проверка на сущестование такого файла
            if ($existingFile) {
            return redirect()->back()->with('msg', 'Файл уже существует - ' . $existingFile->name . '.' . $fileExtension);
            }

}
            $path = $file->storeAs('files', $newPath, 'public');

            File::create([
                'name' => pathinfo($file->getClientOriginalName())['filename'],
                'path' => $path,
                'extension_id' => $extension->id,
                'mime_type_id' => $mime->id,
                'file_hash' => $fileHash,
                'folder_id' => $request->folder_id ?? null,
                'user_id' => Auth::id(),
                'size' => $file->getSize()
            ]);
            return redirect()->route('index')->with('msg', 'Файлы успешно загружены.');
    }

}
