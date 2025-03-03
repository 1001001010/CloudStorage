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
        $folder = Folder::where('user_id', Auth::id())->find($folder->id);

        if(!$folder) {
            return redirect()->back()->with('msg', [
                'title' => 'Папка не найдена',
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
    public function rename(Request $request, Folder $folder) : RedirectResponse {
        $validate = $request->validate([
            'name' => 'string|required',
        ]);

        $folder = Folder::where('user_id', Auth::id())->find($folder->id);
        $folder->update([
            'title' => $validate['name']
        ]);
        return redirect()->back()->with('msg', [
            'title' => 'Папка успешно переименована'
        ]);
    }
}
