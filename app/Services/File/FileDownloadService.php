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

class FileDownloadService
{
    protected FileEncryptionService $encryptService;

    public function __construct(
        FileEncryptionService $encryptService,
    ) {
        $this->encryptService = $encryptService;
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
            \Log::error('Файл не найден в хранилище', [
                'file_id' => $file->id,
                'path' => $filePath
            ]);
            return null;
        }

        // dd($file->user->getEncryptionKeyAttribute());

        try {
            $encryptedContent = Storage::disk('private')->get($filePath);
            $decryptedContent = $encryptService->decryptFile($encryptedContent, $file->user);

            // Создаем уникальное имя для временного файла
            $tempFileName = 'temp_' . $file->id . '_' . time() . '_' . Str::random(8);
            $tempPath = storage_path('app/private/' . $tempFileName);

            // Убеждаемся, что директория существует
            $tempDir = dirname($tempPath);
            if (!is_dir($tempDir)) {
                mkdir($tempDir, 0755, true);
            }

            file_put_contents($tempPath, $decryptedContent);

            // Проверяем, что временный файл создался
            if (!file_exists($tempPath)) {
                \Log::error('Не удалось создать временный файл', [
                    'file_id' => $file->id,
                    'temp_path' => $tempPath
                ]);
                return null;
            }

            $fileName = $file->name . '.' . $file->extension->extension;

            // Кодируем имя файла для поддержки кириллицы
            $encodedFileName = rawurlencode($fileName);

            return response()->download(
                $tempPath,
                $fileName,
                [
                    'Content-Type' => $file->mimeType->mime_type ?? 'application/octet-stream',
                    'Content-Disposition' => "attachment; filename*=UTF-8''" . $encodedFileName
                ]
            )->deleteFileAfterSend();

        } catch (\Exception $e) {
            \Log::error('Ошибка при расшифровке файла: ' . $e->getMessage(), [
                'file_id' => $file->id,
                'path' => $filePath,
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    /**
     * Получение расшифрованного файла для публичного доступа
     * (альтернативный метод с дополнительными проверками)
     *
     * @param File $file
     * @return BinaryFileResponse|null
     */
    public function getPublicDecryptedDownloadResponse(File $file): ?BinaryFileResponse
    {
        return $this->getDecryptedDownloadResponse($file, $this->encryptService);
    }

    /**
     * Очистка старых временных файлов
     * (можно вызывать периодически через cron)
     */
    public function cleanupTempFiles(): void
    {
        $tempDir = storage_path('app/private/');
        $files = glob($tempDir . 'temp_*');

        foreach ($files as $file) {
            if (is_file($file) && (time() - filemtime($file)) > 3600) { // старше часа
                unlink($file);
            }
        }
    }
}