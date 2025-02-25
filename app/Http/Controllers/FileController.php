<?php

namespace App\Http\Controllers;

use Illuminate\Http\{Request, RedirectResponse};
use Illuminate\Support\Facades\{Storage, Crypt, Auth};
use Illuminate\Support\Str;
use App\Http\Requests\FileUploadRequest;
use App\Models\{File, Folder, FileExtension,
    MimeType, FileUserAccess};
use App\Services\FileEncryptionService;


class FileController extends Controller
{
    protected $encryptionService;

    public function __construct(FileEncryptionService $encryptionService)
    {
        $this->encryptionService = $encryptionService;
    }

    /**
     * Обработка загрузки файлов на сервер.
     *
     * @param FileUploadRequest $request Объект запроса с данными загружаемых файлов.
     * @return RedirectResponse
     */
    public function upload(FileUploadRequest $request): RedirectResponse
    {
        $folder = $this->getFolder($request->folder_id);
        if ($request->folder_id && !$folder) {
            return redirect()->back()->with('msg', 'Папка не найдена');
        }

        $disallowedExtensions = ['exe', 'bat', 'sh'];
        $messages = [];
        $encryptionKey = config('app.key');

        foreach ($request->file('files') as $file) {
            $fileExtension = strtolower($file->getClientOriginalExtension());

            if ($this->isDisallowedExtension($fileExtension, $disallowedExtensions)) {
                $messages[] = "Загрузка файла с расширением .{$fileExtension} запрещена";
                continue;
            }

            $fileHash = hash_file('sha256', $file->getRealPath());
            if ($existingFile = $this->checkExistingFile($fileHash)) {
                $messages[] = "Файл уже существует - {$existingFile->name}.{$fileExtension}";
                continue;
            }

            $newFileName = $this->generateUniqueFileName($fileExtension);
            $path = $file->storeAs('private_files', $newFileName);
            $fullPath = storage_path("app/private/private_files/{$newFileName}");

            // Шифруем файл
            $this->encryptionService->encryptFile($fullPath, $encryptionKey);

            $this->storeFileRecord($file, $fileExtension, $path, $fileHash, $request->folder_id);
            $messages[] = "Файл \"{$file->getClientOriginalName()}\" успешно загружен.";
        }

        return redirect()->route('index')->with('msg', [
            'title' => $messages,
        ]);
    }

    private function getFolder($folderId) {
        return $folderId && $folderId != 0
            ? Folder::where('id', $folderId)->where('user_id', Auth::id())->first()
            : null;
    }

    private function isDisallowedExtension($extension, $disallowedExtensions): bool {
        return in_array($extension, $disallowedExtensions);
    }

    private function checkExistingFile($fileHash) {
        return File::where('file_hash', $fileHash)->where('user_id', Auth::id())->first();
    }

    private function generateUniqueFileName($fileExtension): string {
        do {
            $timePart = time();
            $randomPart = Str::random(20);
            $newFileName = $timePart . '_' . $randomPart . '.' . $fileExtension;

            if (strlen($newFileName) > 40) {
                $newFileName = substr($newFileName, 0, 40 - strlen($fileExtension) - 1) . '.' . $fileExtension;
            }
        } while (File::where('name', $newFileName)->where('user_id', Auth::id())->exists());

        return $newFileName;
    }

    private function storeFileRecord($file, $fileExtension, $path, $fileHash, $folderId): void {
        $extension = FileExtension::firstOrCreate(['extension' => $fileExtension]);
        $mime = MimeType::firstOrCreate(['mime_type' => $file->getMimeType()]);

        File::create([
            'name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'path' => $path,
            'extension_id' => $extension->id,
            'mime_type_id' => $mime->id,
            'file_hash' => $fileHash,
            'folder_id' => $folderId ?? null,
            'user_id' => Auth::id(),
            'size' => $file->getSize(),
        ]);
    }

    /**
     * Скачивает файл, принадлежащий текущему пользователю, или проверяет доступ к нему.
     *
     * @param File $file Объект файла для скачивания.
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|RedirectResponse Возвращает файл для скачивания или редирект с сообщением об ошибке.
     */
    public function download(File $file)
    {
        $fileRecord = File::with('extension')->find($file->id);

        if (!$fileRecord) {
            return redirect()->back()->with('msg', ['title' => 'Файл не найден']);
        }

        // Проверяем, есть ли доступ у пользователя
        if ($fileRecord->user_id !== Auth::id() && !$this->userHasAccessToFile($fileRecord->id, Auth::id())) {
            return redirect()->back()->with('msg', ['title' => 'У вас нет прав на просмотр этого файла']);
        }

        // Вызываем метод скачивания
        return $this->serveFile($fileRecord);
    }

    /**
     * Проверяет наличие у пользователя прав доступа к файлу.
     *
     * @param int $fileId Идентификатор файла.
     * @param int $userId Идентификатор пользователя.
     * @return bool
     */
    protected function userHasAccessToFile($fileId, $userId): bool
    {
        return FileUserAccess::whereHas('accessToken', function ($query) use ($fileId) {
            $query->where('file_id', $fileId);
        })->where('user_id', $userId)->exists();
    }

    /**
     * Подготовка и отправка файла для скачивания.
     *
     * @param \App\Models\File $fileRecord
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    protected function serveFile($fileRecord)
    {
        $filePath = storage_path("app/private/{$fileRecord->path}");
        if (!file_exists($filePath)) {
            return redirect()->back()->with('msg', ['title' => 'Файл не найден на сервере']);
        }

        $fileName = $fileRecord->name . '.' . $fileRecord->extension->extension;
        $encryptionKey = config('app.key');

        // Расшифровываем файл перед отправкой
        $decryptedFilePath = $this->encryptionService->decryptFile($filePath, $encryptionKey);

        return response()->download($decryptedFilePath, $fileName)->deleteFileAfterSend(true);
    }

    /**
     * Переименование файла.
     *
     * @param Request $request Объект запроса с новыми данными.
     * @param File $file Идентификатор файла, который нужно переименовать.
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
     * Мягкое удаление файла текущего пользователя.
     *
     * @param File $file Идентификатор файла, который нужно удалить.
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
     * Восстановление мягко удаленного файла текущего пользователя.
     *
     * @param File $file Идентификатор файла, который нужно восстановить.
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
     * Полное удаление файла (без возможности восстановления).
     *
     * @param File $file Идентификатор файла, который нужно полностью удалить.
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
