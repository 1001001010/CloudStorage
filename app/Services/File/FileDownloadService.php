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

class FileDownloadService {
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
            return null;
        }

        $encryptedContent = Storage::disk('private')->get($filePath);
        $decryptedContent = $encryptService->decryptFile($encryptedContent);

        $tempPath = storage_path('app/private/temp_' . $file->id);
        file_put_contents($tempPath, $decryptedContent);

        return response()->download($tempPath, $file->name . '.' . $file->extension->extension)->deleteFileAfterSend();
    }
}
