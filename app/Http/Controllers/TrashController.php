<?php

namespace App\Http\Controllers;

use Illuminate\Http\{Request, RedirectResponse};
use Illuminate\Support\Facades\{
    Storage,
    Auth
};
use Inertia\{
    Response,
    Inertia
};
use App\Models\File;

class TrashController extends Controller
{
    /**
     * Отображение корзины
     *
     * @return Response
     */
    public function index(): Response {
        $trashedFiles = File::onlyTrashed()->with(['extension', 'mimeType'])->where('user_id', Auth::id())->get();
        $trashSize = $trashedFiles->sum('size');

        return Inertia::render('Trash', [
            'files' => $trashedFiles,
            'trashSize' => $trashSize,
        ]);
    }

    /**
     * Очистка корзины
     *
     * @return RedirectResponse
     */
    public function destroy(): RedirectResponse
    {
        $trashedFiles = File::onlyTrashed()
            ->where('user_id', Auth::id())
            ->get();

        foreach ($trashedFiles as $file) {
            Storage::disk('private')->delete($file->path);
            $file->forceDelete();
        }

        return redirect()->back()->with('msg', ['title' => 'Корзина очищена']);
    }
}
