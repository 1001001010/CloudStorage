<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\{Folder, FolderRelation};
use App\Http\Requests\FolderUploadRequest;

class FolderController extends Controller
{
    /**
     * Создание папки
     */
    public function upload(FolderUploadRequest $request) : RedirectResponse
    {
        $folder=null;
        if ($request->folder) {
            $folder = $request->folder;
        }

        $newFolder = Folder::create([
            'title' => $request->title,
            'user_id' => Auth::id(),
            'parent_id' => $folder
        ]);

        return redirect()->back();
    }
}
