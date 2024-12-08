<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Folder;
use App\Models\File;
use Illuminate\Support\Facades\Auth;

class GetUserFoldersAndFiles
{
    /**
     * Получение папок и файлов, которые создал/загрузил пользователь
     *
     */
    public function handle(Request $request, Closure $next)
    {
        $folders = Folder::where('user_id', Auth::id())->get();
        $files = File::with(['extension', 'mimeType'])->where('user_id', Auth::id())->get();

        $FoldersFilesTree = $this->buildFolderTreeWithFiles($folders, $files);
        Inertia::share('FoldersAndFiles', $FoldersFilesTree);

        return $next($request);
    }

    /**
     * Преобразование списка папок в древовидную структуру с файлами
     */
    public function buildFolderTreeWithFiles($folders, $files, $parentId = null)
    {
        $branch = [];
        foreach ($folders as $folder) {
            if ($folder->parent_id == $parentId) {
                // Рекурсивное построение дерева
                $children = $this->buildFolderTreeWithFiles($folders, $files, $folder->id);

                // Получаем файлы, относящиеся к текущей папке
                $folderFiles = $files->where('folder_id', $folder->id);
                if ($folderFiles->isNotEmpty()) {
                    $folder->files = $folderFiles; // Добавляем файлы в папку
                }

                if ($children) {
                    $folder->children = $children;
                }

                $branch[] = $folder;
            }
        }
        return $branch;
    }
}
