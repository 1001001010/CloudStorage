<?php

namespace App;

use App\Models\Folder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class HelperClass
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
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
