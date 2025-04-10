<?php

namespace App\Services\Trash;

use App\Models\File;
use Illuminate\Support\Facades\Storage;

class TrashService
{
    /**
     * Очищает корзину пользователя
     *
     * @param int $userId
     * @return void
     */
    public function emptyTrashForUser(int $userId): void
    {
        $trashedFiles = File::onlyTrashed()
            ->where('user_id', $userId)
            ->get();

        foreach ($trashedFiles as $file) {
            Storage::disk('private')->delete($file->path);
            $file->forceDelete();
        }
    }
}
