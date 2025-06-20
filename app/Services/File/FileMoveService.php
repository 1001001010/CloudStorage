<?php

namespace App\Services\File;

use App\Models\File;
use App\Models\Folder;
use Illuminate\Support\Facades\Auth;

class FileMoveService
{
    public function moveFile(File $file, ?int $folderId): bool
    {
        // Проверяем права доступа
        if ($file->user_id !== Auth::id()) {
            throw new \Exception('У вас нет прав для перемещения этого файла');
        }

        // Если папка указана, проверяем её существование и права доступа
        if ($folderId) {
            $folder = Folder::find($folderId);

            if (!$folder) {
                throw new \Exception('Папка не найдена');
            }

            if ($folder->user_id !== Auth::id()) {
                throw new \Exception('У вас нет прав доступа к этой папке');
            }

            // Проверяем, что файл не перемещается в ту же папку
            if ($file->folder && $file->folder->id === $folderId) {
                throw new \Exception('Файл уже находится в этой папке');
            }
        } else {
            // Проверяем, что файл не находится уже в корневой папке
            if (!$file->folder) {
                throw new \Exception('Файл уже находится в корневой папке');
            }
        }

        // Перемещаем файл
        $file->folder()->associate($folderId);
        return $file->save();
    }

    public function getFoldersTree(?int $currentFolderId = null): array
    {
        $folders = Folder::where('user_id', Auth::id())
            ->with('children')
            ->whereNull('parent_id')
            ->get();

        return $this->buildFolderTree($folders, $currentFolderId);
    }

    private function buildFolderTree($folders, ?int $currentFolderId = null): array
    {
        $tree = [];

        foreach ($folders as $folder) {
            $tree[] = [
                'id' => $folder->id,
                'title' => $folder->title,
                'parent_id' => $folder->parent_id,
                'is_current' => $folder->id === $currentFolderId,
                'children' => $this->buildFolderTree($folder->children, $currentFolderId)
            ];
        }

        return $tree;
    }
}