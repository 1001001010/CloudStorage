<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        return Inertia::render('Trash', [
            'files' => File::onlyTrashed()->with(['extension', 'mimeType'])->where('user_id', Auth::id())->get()
        ]);
    }
}
