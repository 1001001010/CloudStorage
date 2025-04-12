<?php

namespace App\Services\File;

use App\Models\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use App\Services\Cryptography\FileEncryptionService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use App\Models\{
    Folder,
    FileExtension,
    MimeType,
    FileUserAccess
};

class FileService
{
    protected FileEncryptionService $encryptService;

    public function __construct(
        FileEncryptionService $encryptService,
    ) {
        $this->encryptService = $encryptService;
    }

    /**
     * Обработка одного файла
     *
     * @param UploadedFile $file
     * @param int|null $folderId
     * @return array
     */
    public function handleUploadFile(
        UploadedFile $file,
        ?int $folderId
    ): array {
        $maxSize = Auth::user()->quota->size * 1024 * 1024 * 1024;
        $userId = Auth::id();
        $disallowedExtensions = ['exe', 'bat', 'sh'];
        $fileSize = $file->getSize();
        $success = false;
        $totalSize = File::where('user_id', $userId)->sum('size');

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
        $encryptedContent = $this->encryptService->encryptFile($fileContent);

        $newPath = substr(Str::uuid()->toString(), 0, 50) . '.enc';

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
            'message' => '',
            'totalSize' => $totalSize + $fileSize,
            'success' => true
        ];
    }

    /**
     * Получение расшифрованного файла для скачивания
     *
     * @param File $file
     * @param FileEncryptionService $encryptService
     * @return BinaryFileResponse|null
     */
    public function getDecryptedDownloadResponse(File $file, FileEncryptionService $encryptService): ?BinaryFileResponse
    {
        $filePath = $file->path;
        if (!Storage::disk('private')->exists($filePath)) {
            return null;
        }

        $encryptedContent = Storage::disk('private')->get($filePath);
        $decryptedContent = $encryptService->decryptFile($encryptedContent);

        $tempPath = storage_path('app/private/temp_' . $file->id);
        file_put_contents($tempPath, $decryptedContent);

        return response()->download($tempPath, $file->name . '.' . $file->extension->extension)->deleteFileAfterSend();
    }

    /**
     * Мягкое удаление файла
     *
     * @param File $file
     * @return bool
     */
    public function softDeleteFile(File $file): bool
    {
        if ($file->user_id !== Auth::id()) {
            return false;
        }

        $file->delete();
        return true;
    }

    /**
     * Переименование файла
     *
     * @param File $file
     * @param string $newName
     * @return bool
     */
    public function renameFile(File $file, string $newName): bool
    {
        if ($file->user_id !== Auth::id()) {
            return false;
        }

        $file->update(['name' => $newName]);
        return true;
    }

    /**
     * Восстановление мягко удаленного файла
     *
     * @param File $file
     * @return bool
     */
    public function restoreFile(File $file): bool
    {
        if (!$file->trashed()) {
            return false;
        }

        $file->restore();
        return true;
    }

    /**
     * Полное удаление файла
     *
     * @param File $file
     * @return bool
     */
    public function forceDeleteFile(File $file): bool
    {
        if (!Storage::disk('private')->exists($file->path)) {
            return false;
        }

        Storage::disk('private')->delete($file->path);
        $file->forceDelete();

        return true;
    }
}
