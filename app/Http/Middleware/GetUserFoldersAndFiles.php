<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Folder;
use App\Models\File; // Подключаем модель для файлов
use Illuminate\Support\Facades\Auth;

class GetUserFoldersAndFiles
{
    /**
     * Получение папок и файлов, которые создал/загрузил пользователь
     *
     */
    public function handle(Request $request, Closure $next)
    {
        // Получаем папки пользователя
        $folders = Folder::where('user_id', Auth::id())->get();
        // Получаем файлы пользователя
        $files = File::where('user_id', Auth::id())->get();

        // Строим древовидную структуру папок и добавляем файлы в соответствующие папки
        $FoldersFilesTree = $this->buildFolderTreeWithFiles($folders, $files);
        // dd($FoldersFilesTree);
        // Передаем данные в Inertia
        Inertia::share('FoldersAndFiles', $FoldersFilesTree); // Передаем папки и файлы в одном объекте

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
