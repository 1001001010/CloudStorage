<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Folder;

class MainController extends Controller
{
    /**
     * Отображение главной страницы.
     */
    public function index(): Response
    {
        $userFolders = Folder::where('user_id', Auth::id())->get();

        return Inertia::render('Welcome', [
            'forders' => $this->buildFolderTree($userFolders)
        ]);
    }

    /**
     * Преобразование список папок в древовидную структуру
     */
    private function buildFolderTree($folders, $parentId = null)
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
