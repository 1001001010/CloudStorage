<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\File;
use Illuminate\Support\Facades\Auth;

class TrashController extends Controller
{
    /**
     * Отображение страницы корзины.
     */
    public function index(): Response
    {
        return Inertia::render('Trash', [
            'files' => File::onlyTrashed()->with(['extension', 'mimeType'])->where('user_id', Auth::id())->get()
        ]);
    }
}
