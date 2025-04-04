<?php

namespace App\Http\Controllers;

use Illuminate\Http\{
    Request,
    RedirectResponse
};
use Illuminate\Support\Facades\{
    Storage,
    Auth
};
use Illuminate\Support\Str;
use App\Http\Requests\FileUploadRequest;
use App\Models\{
    File,
    Folder,
    FileExtension,
    MimeType,
    FileUserAccess
};
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use App\Http\Controllers\EncryptionController;

class FileController extends Controller
{
    protected $encryptionController;

    public function __construct(EncryptionController $encryptionController)
    {
        $this->encryptionController = $encryptionController;
    }

    /**
     * Обработка загрузки файлов
     *
     * @param FileUploadRequest $request
     * @return RedirectResponse
     */
    public function upload(FileUploadRequest $request): RedirectResponse {
        $folder = $this->validateFolder($request->folder_id);
        if ($folder === false) {
            return $this->redirectWithError('Ошибка', 'Папка не найдена');
        }

        $disallowedExtensions = ['exe', 'bat', 'sh'];
        $messages = [];
        $successCount = 0;
        $userId = Auth::id();
        $totalSize = File::where('user_id', $userId)->sum('size');
        $maxSize = 5 * 1024 * 1024 * 1024; // 5 ГБ

        $fileCount = count($request->file('files'));
        $successfulFiles = [];

        foreach ($request->file('files') as $file) {
            $result = $this->processFile($file, $totalSize, $userId, $disallowedExtensions, $maxSize, $folder ? $folder->id : null);
            if ($result['success']) {
                $successfulFiles[] = $file->getClientOriginalName();
            } else {
                $messages[] = $result['message'];
            }
            $totalSize = $result['totalSize'];
            $successCount += $result['success'] ? 1 : 0;
        }

        if ($successCount === 0) {
            return $this->redirectWithError('Ошибка загрузки', implode("\n", $messages));
        }

        if ($successCount === 1) {
            $successMessage = "Файл \"{$successfulFiles[0]}\" успешно загружен.";
        } else {
            $successMessage = "{$successCount} файлов успешно загружено.";
        }

        $finalMessage = $successMessage;
        if (!empty($messages)) {
            $finalMessage .= "\n" . implode("\n", $messages);
        }

        return redirect()->route('index')->with('msg', [
            'title' => 'Загрузка завершена',
            'description' => $finalMessage,
        ]);
    }

    /**
     * Проверка и валидация папки
     *
     * @param int|null $folderId
     * @return Folder|null
     */
    protected function validateFolder($folderId): Folder|null {
        if ($folderId === null || $folderId == 0) {
            return null;
        }

        return Folder::where('id', $folderId)
            ->where('user_id', Auth::id())
            ->first();
    }

    /**
     * Процесс загрузки файла
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param int $totalSize
     * @param int $userId
     * @param array $disallowedExtensions
     * @param int $maxSize
     * @param int|null $folderId
     * @return array
     */
    protected function processFile($file, $totalSize, $userId, $disallowedExtensions, $maxSize, $folderId): array
    {
        $fileSize = $file->getSize();
        $success = false;

        if (($totalSize + $fileSize) > $maxSize) {
            return ['message' => 'Превышен лимит хранения (5 ГБ)', 'totalSize' => $totalSize, 'success' => false];
        }

        $fileExtension = strtolower($file->getClientOriginalExtension());

        if (in_array($fileExtension, $disallowedExtensions)) {
            return ['message' => "Файл с расширением .{$fileExtension} запрещен", 'totalSize' => $totalSize, 'success' => false];
        }

        $mimeType = $file->getMimeType();
        $fileHash = hash_file('sha256', $file->getRealPath());

        if (File::withTrashed()->where('file_hash', $fileHash)->where('user_id', $userId)->exists()) {
            return ['message' => "Файл уже существует", 'totalSize' => $totalSize, 'success' => false];
        }

        // Чтение и шифрование файла
        $fileContent = file_get_contents($file->getRealPath());
        $encryptedContent = $this->encryptionController->encryptFile($fileContent);

        $timePart = time();
        $randomPart = Str::random(20);
        $newPath = "{$timePart}_{$randomPart}.enc";

        $path = "files/{$newPath}";
        Storage::disk('private')->put($path, $encryptedContent);

        $extension = FileExtension::firstOrCreate(['extension' => $fileExtension]);
        $mime = MimeType::firstOrCreate(['mime_type' => $mimeType]);

        File::create([
            'name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'path' => $path,
            'extension_id' => $extension->id,
            'mime_type_id' => $mime->id,
            'file_hash' => $fileHash,
            'folder_id' => $folderId,
            'user_id' => $userId,
            'size' => $fileSize
        ]);

        return [
            'message' => '', // No message needed here anymore
            'totalSize' => $totalSize + $fileSize,
            'success' => true
        ];
    }

    /**
     * Скачивание файла
     *
     * @param File $file
     * @return BinaryFileResponse|RedirectResponse
     */
    public function download(File $file): BinaryFileResponse|RedirectResponse
    {
        if (!$this->checkUserFileAccess($file)) {
            return $this->redirectWithError('Нет прав на скачивание файла', '');
        }

        return $this->serveFile($file);
    }

    /**
     * Проверка прав доступа
     *
     * @param File $file
     * @return bool
     */
    protected function checkUserFileAccess(File $file): bool {
        return $file->user_id == Auth::id() || $this->userHasAccessToFile($file->id, Auth::id());
    }

    /**
     * Скачивание файла
     *
     * @param File $file
     * @return BinaryFileResponse|RedirectResponse
     */
    protected function serveFile(File $file): BinaryFileResponse|RedirectResponse
    {
        $filePath = $file->path;

        if (!Storage::disk('private')->exists($filePath)) {
            return $this->redirectWithError('Файл не найден', '');
        }

        $encryptedContent = Storage::disk('private')->get($filePath);
        $decryptedContent = $this->encryptionController->decryptFile($encryptedContent);

        $tempPath = storage_path('app/private/temp_' . $file->id);
        file_put_contents($tempPath, $decryptedContent);

        return response()->download($tempPath, $file->name . '.' . $file->extension->extension)->deleteFileAfterSend();
    }

    /**
     * Мягкое удаление файла
     *
     * @param File $file
     * @return RedirectResponse
     */
    public function delete(File $file): RedirectResponse {
        $file = File::where('user_id', Auth::id())->find($file->id);

        if(!$file) {
            return redirect()->back()->with('msg', [
                'title' => 'Файл не найден',
            ]);
        }
        $file->delete();
        return redirect()->route('index')->with('msg', [
            'title' => 'Файл перемещён в корзину',
            'description' => 'Вы можете его восстановить из корзины'
        ]);
    }

    /**
     * Переименование файла
     *
     * @param Request $request
     * @param File $file
     * @return RedirectResponse
     */
    public function rename(Request $request, File $file): RedirectResponse {
        if ($file->user_id !== Auth::id()) {
            abort(404);
        }

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
     * Восстановление мягко удаленного файла
     *
     * @param File $file
     * @return RedirectResponse
     */
    public function restore(File $file): RedirectResponse {
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
     * Полное удаление файла
     *
     * @param File $file
     * @return RedirectResponse
     */
    public function forceDelete(File $file): RedirectResponse {
        $file = File::onlyTrashed()->where('user_id', Auth::id())->find($file->id);
        if (!$file) {
            return $this->redirectWithError('Файл не найден', '');
        }

        Storage::disk('private')->delete($file->path);
        $file->forceDelete();
        return redirect()->back()->with('msg', ['title' => 'Файл полностью удален']);
    }

    /**
     * Обработка редиректа с ошибкой
     *
     * @param string $title
     * @param string $description
     * @return RedirectResponse
     */
    protected function redirectWithError($title, $description): RedirectResponse {
        return redirect()->back()->with('msg', [
            'title' => $title,
            'description' => $description,
        ]);
    }
}
