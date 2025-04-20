<?php

namespace App\Services\Trash;

use App\Models\File;
use Illuminate\Support\Facades\Storage;

class TrashService
{
    /**
     * Получние данных для корзины
     *
     * @param int $userId
     * @return array
     */
    public function getTrashDataForUser($userId): array {
        $trashedFiles = File::onlyTrashed()->with(['extension', 'mimeType'])->where('user_id', $userId)->get();
        $trashSize = $trashedFiles->sum('size');

        return [
            'files' => $trashedFiles,
            'trashSize' => $trashSize
        ];
    }


    /**
     * Очищает корзину пользователя
     *
     * @param int $userId
     * @return void
     */
    public function emptyTrashForUser(int $userId): void {
        $trashedFiles = File::onlyTrashed()
            ->where('user_id', $userId)
            ->get();

        foreach ($trashedFiles as $file) {
            Storage::disk('private')->delete($file->path);
            $file->forceDelete();
        }
    }
}
