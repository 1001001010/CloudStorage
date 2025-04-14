<?php

namespace App\Services\File;

use App\Models\File;
use Illuminate\Support\Facades\Auth;
use App\Models\{
    Folder,
    FileExtension,
    MimeType,
    FileUserAccess
};

class FileRenameService {

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
}
