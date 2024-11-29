<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Folder;
use App\Models\FolderRelation;
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
        $foldersTree = $this->buildFolderTree($folders);

        Inertia::share('FoldersTree', $foldersTree);

        return $next($request);
    }

    /**
     * Преобразование список папок в древовидную структуру
     */
    public function buildFolderTree($folders, $parentId = null)
    {
        $branch = [];
        foreach ($folders as $folder) {
            if ($folder->parent_id == $parentId) {
                $children = $this->buildFolderTree($folders, $folder->id);
                if ($children) {
                    $folder->children = $children;
                }
                $branch[] = $folder;
            }
        }
        return $branch;
    }
}
