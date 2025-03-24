<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\{
    Folder,
    File
};

class GetUserFolders
{
    /**
     * Обработка входящего запроса, построение древовидной структуры папок
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): mixed {
        $folders = Folder::where('user_id', Auth::id())->get();
        $files = File::where('user_id', Auth::id())->get();
        $totalSize = $files->sum('size');

        $foldersTree = $this->buildFolderTree($folders);

        Inertia::share(['FoldersTree' => $foldersTree, 'totalSize' => $totalSize]);

        return $next($request);
    }

    /**
     * Преобразование списка папок в древовидную структуру
     *
     * @param \Illuminate\Database\Eloquent\Collection|array $folders
     * @param int|null $parentId
     * @return array
     */
    public function buildFolderTree($folders, $parentId = null): array {
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
