<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\{Inertia, Response};
use Illuminate\Support\Facades\Auth;
use App\Models\File;

class EditorController extends Controller
{
    public function index($file) {
        $allowedExtensions = ['txt', 'doc', 'docx', 'pdf', 'odt', 'rtf'];
        $allowedMimeTypes = ['text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'application/vnd.oasis.opendocument.text', 'application/rtf'];
        $file = File::with(['extension', 'mimeType'])->where('user_id', Auth::id())->find($file);
        if ($file) {
            if (in_array($file->extension->extension, $allowedExtensions) && in_array($file->mimeType->mime_type, $allowedMimeTypes)) {
                return Inertia::render('Editor', [
                    'file' => $file
                ]);
            } else {
                return redirect()->back()->with('msg', 'Файл не является текстовым документом');
            }
        } else {
            return redirect()->back()->with('msg', 'Файл не найден');
        }
        return redirect()->back()->with('msg', 'Просто не ворк');
    }
}
