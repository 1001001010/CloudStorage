<?php

namespace App\Services\File;

use App\Services\File\FileService;
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

class FileDeleteService {

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
