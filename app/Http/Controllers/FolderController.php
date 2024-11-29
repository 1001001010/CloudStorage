<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\{Folder, FolderRelation};

class FolderController extends Controller
{
    /**
     * Создание папки
     */
    public function upload(Request $request) : RedirectResponse
    {
        $request->validate([
            'title' => 'required|string',
            'folder' => 'required|integer|min:0'
        ]);

        $newFolder = Folder::create([
            'title' => $request->title,
            'user_id' => Auth::id(),
            'parent_id' => $request->folder
        ]);

        return redirect()->back();
    }
}
