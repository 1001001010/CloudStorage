<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Storage, Auth};
use Illuminate\Support\Str;
use App\Http\Requests\FileUploadRequest;
use App\Models\{File, Folder, FileExtension,
    MimeType, FileUserAccess};
use Illuminate\Http\RedirectResponse;

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
                return redirect()->back()->with('msg', 'Папка не найдена');
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

            $existingFile = File::where('file_hash', $fileHash)->where('user_id', Auth::id())->first(); // Проверка на существование такого файла
            if ($existingFile) {
                return redirect()->back()->with('msg', 'Файл уже существует - ' . $existingFile->name . '.' . $fileExtension);
            }

            $path = $file->storeAs('files', $newPath, 'public');

            File::create([
                'name' => $request->file_name ?? pathinfo($file->getClientOriginalName())['filename'],
                'path' => $path,
                'extension_id' => $extension->id,
                'mime_type_id' => $mime->id,
                'file_hash' => $fileHash,
                'folder_id' => $request->folder_id ?? null,
                'user_id' => Auth::id(),
                'size' => $file->getSize()
            ]);
        }

        return redirect()->route('index')->with('msg', [
            'title' => 'Файлы успешно загружены',
        ]);
    }


    /**
     * Логика скачивания файла
     */
    public function download($file)
    {
        $fileRecord = File::with('extension')->find($file);

        if ($fileRecord) {
            if ($fileRecord->user_id == Auth::id()) {
                return $this->serveFile($fileRecord); // Проверка на владельца файла
            }

            $hasAccess = $this->userHasAccessToFile($fileRecord->id, Auth::id());
            if ($hasAccess) {
                return $this->serveFile($fileRecord);
            }

            return redirect()->back()->with('msg', [
                'title' => 'У вас нет прав на просмотр этого файла',
            ]);
        }

        return redirect()->back()->with('msg', [
            'title' => 'Файл не найден',
        ]);
    }

    /**
     * Проверка наличия токена доступа у пользователя
     */
    protected function userHasAccessToFile($fileId, $userId)
    {
        return FileUserAccess::whereHas('accessToken', function ($query) use ($fileId) {
            $query->where('file_id', $fileId);
        })->where('user_id', $userId)->exists();
    }

    /**
     * Скачивание файла
     */
    protected function serveFile($fileRecord)
    {
        $filePath = storage_path('/app/public/' . $fileRecord->path);

        if (file_exists($filePath)) {
            $fileName = $fileRecord->name . '.' . $fileRecord->extension->extension;
            return response()->download($filePath, $fileName);
        } else {
            return redirect()->back()->with('msg', [
                'title' => 'Файл не найден на сервере',
            ]);
        }
    }

    /**
     * Переименование файлов
     */
    public function rename(Request $request, $file): RedirectResponse {
        $validate_data = $request->validate([
            'name' => 'string|min:1'
        ]);

        $file = File::findOrFail($file);
        if ($file) {
            $file->update(['name' => $request->name]);
        }
        return redirect()->back()->with('msg', [
            'title' => 'Название успешно изменено',
        ]);
    }

    /**
     * Мягкое удаление файла
     */
    public function delete($file): RedirectResponse {
        $file = File::where('user_id', Auth::id())->find($file);

        if(!$file) {
            return redirect()->back()->with('msg', [
                'title' => 'Файлы не найден',
            ]);
        }
        $file->delete();
        return redirect()->route('index')->with('msg', [
            'title' => 'Файл перемещён в корзину',
            'description' => 'Вы можете его восставновить из корзины'
        ]);
    }

    /**
     * Восстановление удаленного файла
     */
    public function restore($file): RedirectResponse {
        $file = File::onlyTrashed()->where('user_id', Auth::id())->find($file);
        if (!$file) {
            return redirect()->back()->with('msg', [
                'title' => 'Файл не найден',
            ]);
        }
        $file->restore();
        return redirect()->back()->with('msg', [
            'title' => 'Файлы успешно восстановлен',
        ]);
    }

    /**
     * Удаление файла
     */
    public function forceDelete($file): RedirectResponse {
        $file = File::onlyTrashed()->where('user_id', Auth::id())->find($file);
        if (!$file) {
            return redirect()->back()->with('msg', [
                'title' => 'Файл не найден',
            ]);
        }
        $file->forceDelete();
        return redirect()->back()->with('msg', [
            'title' => 'Файл полностью удален',
        ]);
    }
}
