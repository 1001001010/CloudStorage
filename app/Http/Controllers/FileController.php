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
    public function upload(FileUploadRequest $request): RedirectResponse
    {
        $folder = $this->validateFolder($request->folder_id);
        if ($folder === false) {
            return $this->redirectWithError('Ошибка', 'Папка не найдена');
        }

        $disallowedExtensions = ['exe', 'bat', 'sh'];
        $messages = [];
        $successCount = 0; // Счетчик успешно загруженных файлов
        $userId = Auth::id();
        $totalSize = File::where('user_id', $userId)->sum('size');
        $maxSize = 5 * 1024 * 1024 * 1024; // 5 ГБ

        foreach ($request->file('files') as $file) {
            $result = $this->processFile($file, $totalSize, $userId, $disallowedExtensions, $maxSize, $folder ? $folder->id : null);
            $messages[] = $result['message'];
            $totalSize = $result['totalSize'];
            $successCount += $result['success'] ? 1 : 0;
        }

        if ($successCount === 0) {
            return $this->redirectWithError('Ошибка загрузки', implode("\n", $messages));
        }

        return redirect()->route('index')->with('msg', [
            'title' => 'Загрузка завершена',
            'description' => implode("\n", $messages),
        ]);
    }

    /**
     * Проверка и валидация папки
     *
     * @param int|null $folderId
     * @return Folder|null
     */
    protected function validateFolder($folderId)
    {
        if ($folderId === null || $folderId == 0) {
            return null;
        }

        return Folder::where('id', $folderId)
            ->where('user_id', Auth::id())
            ->first();
    }


    /**
     * Процесс загрузки и валидации файла
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param int $totalSize
     * @param int $userId
     * @param array $disallowedExtensions
     * @param int $maxSize
     * @param int|null $folderId
     * @return array
     */
    protected function processFile($file, $totalSize, $userId, $disallowedExtensions, $maxSize, $folderId)
    {
        $fileSize = $file->getSize();
        $messages = [];
        $success = false;

        if (($totalSize + $fileSize) > $maxSize) {
            return ['message' => 'Превышен лимит хранения файлов (5 ГБ)', 'totalSize' => $totalSize, 'success' => false];
        }

        $fileExtension = strtolower($file->getClientOriginalExtension());
        if (in_array($fileExtension, $disallowedExtensions)) {
            return ['message' => "Файл с расширением .{$fileExtension} не был загружен, так как это запрещено.", 'totalSize' => $totalSize, 'success' => false];
        }

        $mimeType = $file->getMimeType();
        $fileHash = hash_file('sha256', $file->getRealPath());

        if (File::where('file_hash', $fileHash)->where('user_id', $userId)->exists()) {
            return ['message' => "Файл уже существует.", 'totalSize' => $totalSize, 'success' => false];
        }

        $timePart = time();
        $randomPart = Str::random(20);
        $newPath = "{$timePart}_{$randomPart}.{$fileExtension}";
        if (strlen($newPath) > 40) {
            $newPath = substr($newPath, 0, 40 - strlen($fileExtension) - 1) . ".{$fileExtension}";
        }

        $extension = FileExtension::firstOrCreate(['extension' => $fileExtension]);
        $mime = MimeType::firstOrCreate(['mime_type' => $mimeType]);

        $path = $file->storeAs('files', $newPath, 'public');
        File::create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'extension_id' => $extension->id,
            'mime_type_id' => $mime->id,
            'file_hash' => $fileHash,
            'folder_id' => $folderId,
            'user_id' => $userId,
            'size' => $fileSize
        ]);

        return [
            'message' => "Файл \"{$file->getClientOriginalName()}\" успешно загружен.",
            'totalSize' => $totalSize + $fileSize,
            'success' => true
        ];
    }

    /**
     * Обработка редиректа с ошибкой
     *
     * @param string $title
     * @param string $description
     * @return RedirectResponse
     */
    protected function redirectWithError($title, $description): RedirectResponse
    {
        return redirect()->back()->with('msg', [
            'title' => $title,
            'description' => $description,
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
        if ($this->checkUserFileAccess($file)) {
            return $this->serveFile($file);
        }
        return $this->redirectWithError('У вас нет прав на просмотр этого файла', '');
    }

    /**
     * Проверка прав доступа пользователя к файлу
     *
     * @param File $file
     * @return bool
     */
    protected function checkUserFileAccess(File $file)
    {
        return $file->user_id == Auth::id() || $this->userHasAccessToFile($file->id, Auth::id());
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
     * @param File $file
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|RedirectResponse
     */
    protected function serveFile(File $file)
    {
        $filePath = storage_path('/app/public/' . $file->path);

        if (file_exists($filePath)) {
            return response()->download($filePath, $file->name . '.' . $file->extension->extension);
        }
        return $this->redirectWithError('Файл не найден на сервере', '');
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
