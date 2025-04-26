<?php

namespace App\Http\Controllers;

use Illuminate\Http\{Request, RedirectResponse};
use Illuminate\Support\Facades\Auth;
use App\Models\{Folder, File, FolderRelation};
use App\Http\Requests\Upload\FolderUploadRequest;
use App\Http\Requests\Rename\FolderRenameRequest;

class FolderController extends Controller
{
    public function getContents($id)
    {
        $userId = Auth::id();

        if ((int)$id === 0) {
            // Корневая папка
            $childFolders = Folder::whereNull('parent_id')
                ->where('user_id', $userId)
                ->get();

            $files = File::with(['extension', 'mimeType', 'accessTokens.usersWithAccess.user'])
                ->where('user_id', $userId)
                ->whereNull('folder_id')
                ->get();
        } else {
            $folder = Folder::where('id', $id)
                ->where('user_id', $userId)
                ->firstOrFail();

            $childFolders = Folder::where('parent_id', $id)
                ->where('user_id', $userId)
                ->get();

            $files = File::with(['extension', 'mimeType', 'accessTokens.usersWithAccess.user'])
                ->where('user_id', $userId)
                ->where('folder_id', $id)
                ->get();
        }

        $combined = array_merge(
            $childFolders->map(fn ($f) => array_merge($f->toArray(), ['is_file' => false]))->toArray(),
            $files->map(fn ($f) => array_merge($f->toArray(), ['is_file' => true]))->toArray()
        );

        return response()->json($combined);
    }

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
    public function rename(Folder $folder, FolderRenameRequest $request) : RedirectResponse
    {
        if (!$folder->belongsToUser(Auth::id())) {
            return redirect()->back()->with('msg', [
                'title' => 'Папка не найдена или не принадлежит вам',
            ]);
        }
        $data = $request->validated();

        $folder->update([
            'title' => $data['name']
        ]);

        return redirect()->back()->with('msg', [
            'title' => 'Папка успешно переименована'
        ]);
    }
}
