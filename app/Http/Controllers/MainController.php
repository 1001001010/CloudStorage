<?php

namespace App\Http\Controllers;

use App\{
    HelperClass,
    Models\Folder
};
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\{
    Inertia,
    Response
};
use App\Models\File;


class MainController extends Controller {

    /**
     * Рендеринг главной страницы
     *
     * @param string|null $category
     * @return Response
     */
    public function index($category = null): Response {
        $categoriesMap = [
            'photos' => [
                'mimeTypes' => [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                    'image/bmp',
                    'image/svg+xml',
                ],
            ],
            'documents' => [
                'mimeTypes' => [
                    'application/pdf',
                    'text/plain',
                    'text/csv',
                    'text/html',
                    'application/json',
                    'application/xml',
                    'text/yaml',
                    'text/x-script.python', // Python
                    'application/javascript', // JS
                    'application/x-sh', // Shell scripts
                    'text/x-c', // C, C++
                    'text/x-java-source', // Java
                    'application/x-yaml',
                    'application/x-httpd-php', // PHP
                    'application/x-ruby', // Ruby
                    'text/x-go', // Go
                    'text/x-lua', // Lua
                ],
            ],
            'videos' => [
                'mimeTypes' => [
                    'video/mp4',
                    'video/x-matroska',
                    'video/webm',
                    'video/avi',
                    'video/quicktime',
                    'video/x-flv',
                    'video/x-ms-wmv',
                    'video/mpeg',
                    'video/3gpp',
                    'video/ogg',
                    'video/x-ms-asf',
                    'video/x-m4v',
                    'video/x-msvideo',
                    'application/vnd.rn-realmedia',
                ],
            ],
            'archives' => [
                'mimeTypes' => [
                    'application/zip',
                    'application/x-rar-compressed',
                    'application/x-7z-compressed', // 7z archives
                    'application/x-tar', // Tarballs
                    'application/gzip', // Gzipped files
                ],
            ],
        ];

        $files = File::with(['extension', 'mimeType', 'accessTokens.usersWithAccess.user'])
            ->where('user_id', Auth::id())
            ->whereNull('folder_id');

        if ($category && isset($categoriesMap[$category])) {
            $mimeTypes = $categoriesMap[$category]['mimeTypes'];
            $files = $files->join('mime_types', 'mime_types.id', '=', 'files.mime_type_id')
                ->whereIn('mime_types.mime_type', $mimeTypes);
        }

        $files = $files->get();

        if ($category) {
            $FoldersFilesTree = $files->map(fn ($f) => array_merge($f->toArray(), ['is_file' => true]))->toArray();
        } else {
            $folders = Folder::where('user_id', Auth::id())
                ->whereNull('parent_id')
                ->get();

            $FoldersFilesTree = array_merge(
                $folders->map(fn ($f) => array_merge($f->toArray(), ['is_file' => false]))->toArray(),
                $files->map(fn ($f) => array_merge($f->toArray(), ['is_file' => true]))->toArray()
            );
        }

        return Inertia::render('Welcome', [
            'FoldersAndFiles' => $FoldersFilesTree,
        ]);
    }

}
