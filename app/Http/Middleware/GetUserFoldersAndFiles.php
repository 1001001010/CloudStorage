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
        $category = $request->route('category');

        $categoriesMap = [
            'photos' => [
                'mimeTypes' => ['image/jpeg'],
            ],
            'documents' => [
                'mimeTypes' => ['application/pdf'],
            ],
            'videos' => [
                'mimeTypes' => ['video/mp4'],
            ],
            'archives' => [
                'mimeTypes' => ['application/zip', 'application/x-rar-compressed'],
            ],
        ];

        $filesQuery = File::with(['extension', 'mimeType', 'accessTokens.usersWithAccess.user'])
            ->where('user_id', Auth::id());

        if ($category && isset($categoriesMap[$category])) {
            $filters = $categoriesMap[$category];

            $filesQuery->whereHas('mimeType', function ($query) use ($filters) {
                $query->whereIn('mime_type', $filters['mimeTypes']);
            });
        }

        $files = $filesQuery->get();

        $folders = $category ? collect([]) : Folder::where('user_id', Auth::id())->get();

        $FoldersFilesTree = $this->buildFolderTreeWithFiles($folders, $files, null, $excludeFolders = (bool) $category);

        Inertia::share('FoldersAndFiles', $FoldersFilesTree);

        return $next($request);
    }

    /**
     * Преобразование списка папок в древовидную структуру с файлами
     */
    public function buildFolderTreeWithFiles($folders, $files, $parentId = null, $excludeFolders = false)
    {
        $branch = [];

        // Если папки исключены, добавляем все файлы, игнорируя связь с папками
        if ($excludeFolders) {
            foreach ($files as $file) {
                $branch[] = array_merge(
                    $file->toArray(),
                    ['is_file' => true]
                );
            }
        } else {
            // Добавляем файлы, которые не принадлежат папкам
            if ($parentId === null) {
                $filteredFiles = $files->where('folder_id', $parentId);
                foreach ($filteredFiles as $file) {
                    $branch[] = array_merge(
                        $file->toArray(),
                        ['is_file' => true]
                    );
                }
            }

            // Если папки не исключены, строим дерево папок
            foreach ($folders as $folder) {
                if ($folder->parent_id == $parentId) {
                    $children = $this->buildFolderTreeWithFiles($folders, $files, $folder->id, $excludeFolders);
                    $folderFiles = $files->where('folder_id', $folder->id);

                    if ($folderFiles->isNotEmpty()) {
                        $folder->files = $folderFiles;
                    }
                    if ($children) {
                        $folder->children = $children;
                    }

                    $branch[] = $folder;
                }
            }
        }

        return $branch;
    }
}
