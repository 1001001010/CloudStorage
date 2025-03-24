<?php

namespace App\Http\Controllers;

use Illuminate\Http\{Request, RedirectResponse};
use Illuminate\Support\Facades\Auth;
use App\Models\{Folder, FolderRelation};
use App\Http\Requests\FolderUploadRequest;

class FolderController extends Controller
{
    /**
     * Создание новой папки
     *
     * @param FolderUploadRequest $request
     * @return RedirectResponse
     */
    public function upload(FolderUploadRequest $request) : RedirectResponse {
        $folder=null;
        if ($request->folder) {
            $folder = $request->folder;
        }

        Folder::create([
            'title' => $request->title,
            'user_id' => Auth::id(),
            'parent_id' => $folder
        ]);

        return redirect()->back();
    }

    /**
     * Удаляет папку
     *
     * @param Folder $folder
     * @return RedirectResponse
     */
    public function delete(Folder $folder) : RedirectResponse {
        if (!$folder->belongsToUser(Auth::id())) {
            return redirect()->back()->with('msg', [
                'title' => 'Папка не найдена или не принадлежит вам',
            ]);
        }

        $folder->delete();

        return redirect()->route('index')->with('msg', [
            'title' => 'Папка успешно удалена',
        ]);
    }

    /**
     * Переименование папки
     *
     * @param Request $request
     * @param Folder $folder
     * @return RedirectResponse
     */
    public function rename(Request $request, Folder $folder) : RedirectResponse
    {
        if (!$folder->belongsToUser(Auth::id())) {
            return redirect()->back()->with('msg', [
                'title' => 'Папка не найдена или не принадлежит вам',
            ]);
        }

        $validate = $request->validate([
            'name' => 'string|required',
        ]);

        $folder->update([
            'title' => $validate['name']
        ]);

        return redirect()->back()->with('msg', [
            'title' => 'Папка успешно переименована'
        ]);
    }
}
