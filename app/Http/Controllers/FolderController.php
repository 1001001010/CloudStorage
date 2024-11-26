<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Folder;

class FolderController extends Controller
{
    /**
     * Создание папки
     */
    public function upload(Request $request) : RedirectResponse {
        $request->validate([
            'title' => 'required|string',
            'folder' => 'required|integer|min:0'
        ]);

        Folder::create([
            'title' => $request->title,
            'parent_id' => $request->folder == 0 ? null : $request->folder,
            'user_id' => Auth::id()
        ]);

        return redirect()->back();
    }
}
