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
        $folders = Folder::where('user_id', Auth::id())->with('children')->get();
        $folderRelations = FolderRelation::all();
        $foldersTree = $this->buildFolderTree($folders);

        Inertia::share('FoldersTree', $foldersTree);

        return $next($request);
    }

    /**
     * Преобразование списка папок в древовидную структуру
     */
    public function buildFolderTree($folders)
    {
        $tree = [];

        $foldersById = [];
        foreach ($folders as $folder) {
            $foldersById[$folder->id] = $folder;
            $folder->setRelation('children', collect());
        }

        $rootFolders = $folders->filter(function ($folder) {
            return $folder->parents->isEmpty();
        });

        foreach ($rootFolders as $folder) {
            $this->addChildren($folder, $foldersById);
            $tree[] = $folder;
        }

        return $tree;
    }

    /**
     * Рекурсивное добавление дочерних папок
     */
    private function addChildren($folder, $foldersById)
    {
        foreach ($foldersById as $childFolder) {

            if ($childFolder->parents->contains('id', $folder->id)) {
                $folder->children->push($childFolder);
                $this->addChildren($childFolder, $foldersById);
            }
        }
    }
}
