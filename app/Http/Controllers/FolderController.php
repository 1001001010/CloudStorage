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
     * Создаёт новую папку для текущего пользователя.
     *
     * @param FolderUploadRequest $request Валидированный запрос с данными для создания папки.
     * @return RedirectResponse Редирект обратно после создания папки.
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

    /**
     * Выполняет удаление папки, принадлежащей текущему пользователю.
     *
     * @param Folder $folder Объект папки для удаления.
     * @return RedirectResponse Редирект на главную страницу или обратно с сообщением об успешном удалении или ошибке.
     */
    public function delete(Folder $folder) : RedirectResponse
    {
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
     * Переименовывает папку, принадлежащую текущему пользователю.
     *
     * @param Request $request HTTP-запрос с данными для переименования.
     * @param Folder $folder Объект папки для переименования.
     * @return RedirectResponse Редирект обратно с сообщением об успешном переименовании.
     */
    public function rename(Request $request, Folder $folder) : RedirectResponse
    {
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
