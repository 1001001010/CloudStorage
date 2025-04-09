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


class MainController extends Controller
{
    /**
     * Рендеринг главной страницы
     *
     * @param string|null $category
     * @return Response
     */
    public function index($category = null): Response
    {
        $userId = Auth::id();

        $files = File::with(['extension', 'mimeType', 'accessTokens.usersWithAccess.user'])
            ->where('user_id', $userId)
            ->whereNull('folder_id')
            ->get();

        $folders = Folder::where('user_id', $userId)
            ->whereNull('parent_id')
            ->get();

        $FoldersFilesTree = array_merge(
            $folders->map(fn ($f) => array_merge($f->toArray(), ['is_file' => false]))->toArray(),
            $files->map(fn ($f) => array_merge($f->toArray(), ['is_file' => true]))->toArray()
        );

        return Inertia::render('Welcome', [
            'FoldersAndFiles' => $FoldersFilesTree,
        ]);
    }
}
