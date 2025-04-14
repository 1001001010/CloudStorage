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

class FileUploadService {
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
}
