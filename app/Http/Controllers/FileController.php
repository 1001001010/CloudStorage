<?php

namespace App\Http\Controllers;

use Illuminate\Http\{Request, RedirectResponse};
use Illuminate\Support\Facades\{Storage, Auth};
use Illuminate\Support\Str;
use App\Http\Requests\FileUploadRequest;
use App\Models\{File, Folder, FileExtension,
    MimeType, FileUserAccess};

class FileController extends Controller
{
    /**
     * Обработка загрузки файлов на сервер
     *
     * @param FileUploadRequest $request
     * @return RedirectResponse
     */
    public function upload(FileUploadRequest $request): RedirectResponse {
        // Проверка существования папки
        if ($request->folder_id && $request->folder_id != 0) {
            $folder = Folder::where('id', $request->folder_id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$folder) {
                return redirect()->back()->with('msg', 'Папка не найдена');
            }
        }

        $disallowedExtensions = ['exe', 'bat', 'sh']; // Запрещенные расширения
        $messages = []; // Для сообщений о пропущенных или загруженных файлах

        foreach ($request->file('files') as $file) {
            $fileExtension = $file->getClientOriginalExtension(); // Расширение файла

            // Проверка на запрещенные расширения
            if (in_array(strtolower($fileExtension), $disallowedExtensions)) {
                $messages[] = "Файл с расширением .{$fileExtension} не был загружен, так как это запрещено.";
                continue;
            }

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
                $messages[] = "Файл уже существует - {$existingFile->name}.{$fileExtension}";
                continue;
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

            $messages[] = "Файл \"{$file->getClientOriginalName()}\" успешно загружен.";
        }

        return redirect()->route('index')->with('msg', [
            'title' => 'Загрузка завершена',
            'details' => $messages,
        ]);
    }

    /**
     * Скачивает файл, принадлежащий текущему пользователю
     *
     * @param File $file
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|RedirectResponse
     */
    public function download(File $file)
    {
        $fileRecord = File::with('extension')->find($file->id);

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
     * Проверяет наличие у пользователя прав доступа к файлу
     *
     * @param int $fileId
     * @param int $userId
     * @return bool
     */
    protected function userHasAccessToFile($fileId, $userId)
    {
        return FileUserAccess::whereHas('accessToken', function ($query) use ($fileId) {
            $query->where('file_id', $fileId);
        })->where('user_id', $userId)->exists();
    }

    /**
     * Подготовка и отправка файла для скачивания
     *
     * @param \App\Models\File $fileRecord
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|RedirectResponse
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
     * Переименование файла
     *
     * @param Request $request
     * @param File $file
     * @return RedirectResponse
     */
    public function rename(Request $request, File $file): RedirectResponse {
        $validate_data = $request->validate([
            'name' => 'string|min:1'
        ]);

        $file = File::findOrFail($file->id);
        if ($file) {
            $file->update(['name' => $request->name]);
        }
        return redirect()->back()->with('msg', [
            'title' => 'Название успешно изменено',
        ]);
    }

    /**
     * Мягкое удаление файла текущего пользователя
     *
     * @param File $file
     * @return RedirectResponse
     */
    public function delete(File $file): RedirectResponse {
        $file = File::where('user_id', Auth::id())->find($file->id);

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
     * Восстановление мягко удаленного файла текущего пользователя
     *
     * @param File $file
     * @return RedirectResponse
     */
    public function restore($file): RedirectResponse {
        $file = File::onlyTrashed()->where('user_id', Auth::id())->find($file->id);
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
     * Полное удаление файла (без возможности восстановления)
     *
     * @param File $file
     * @return RedirectResponse
     */
    public function forceDelete(File $file): RedirectResponse {
        $file = File::onlyTrashed()->where('user_id', Auth::id())->find($file->id);
        if (!$file) {
            return redirect()->back()->with('msg', [
                'title' => 'Файл не найден',
            ]);
        }

        Storage::disk('public')->delete($file->path);
        $file->forceDelete();
        return redirect()->back()->with('msg', [
            'title' => 'Файл полностью удален',
        ]);
    }
}
