<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\{Inertia, Response};
use Illuminate\Support\Facades\Auth;
use App\Models\File;

class EditorController extends Controller
{
    public function index($fileId)
    {
        $allowedExtensions = [
            'txt', 'doc', 'docx', 'pdf', 'odt', 'rtf', 'js', 'php', 'html', 'py',
            'jsx', 'ts', 'tsx', 'java', 'cpp', 'c', 'h'
        ];

        $allowedMimeTypes = [
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/pdf',
            'application/vnd.oasis.opendocument.text',
            'application/rtf',
            'application/javascript',
            'application/x-javascript',
            'text/html',
            'text/x-python',
            'text/typescript',
            'text/x-java-source',
            'text/x-c++src',
            'text/x-csrc',
            'text/x-c',
            'text/x-php'
        ];

        $file = File::with(['extension', 'mimeType'])->where('user_id', Auth::id())->find($fileId);
        if ($file) {
            if (in_array($file->extension->extension, $allowedExtensions) && in_array($file->mimeType->mime_type, $allowedMimeTypes)) {
                $language = $this->getLanguageByExtension($file->extension->extension);
                $file->content = file_get_contents(storage_path('app/public/' . $file->path));
                return Inertia::render('Editor', ['file' => $file, 'language' => $language]);
            } else {
                return redirect()->back()->with('msg', 'Невозможно открыть файл');
            }
        } else {
            return redirect()->back()->with('msg', 'Файл не найден');
        }
    }

    private function getLanguageByExtension($extension)
    {
        $languageMap = [
            'py' => 'python',
            'js' => 'javascript',
            'php' => 'php',
            'html' => 'html',
            'css' => 'css',
            'java' => 'java',
            'cpp' => 'cpp',
            'ts' => 'typescript',
            'tsx' => 'typescript',
            'jsx' => 'javascript',
            'txt' => 'text',
            'doc' => 'text',
            'docx' => 'text',
            'pdf' => 'text',
            'rtf' => 'text',
            'odt' => 'text',
            'c' => 'c',
            'h' => 'c',
        ];

        return $languageMap[$extension] ?? 'text';  // Default to text if no match
    }

    public function upload(Request $request, $fileId)
    {
        $file = File::where('user_id', Auth::id())->find($fileId);
        if ($file) {
            $filePath = storage_path('app/public/' . $file->path);
            if (file_exists($filePath)) {
                $fileText = $request->fileText;
                file_put_contents($filePath, $fileText);

                $newFileSize = filesize($filePath);
                $file->size = $newFileSize;
                $file->save();

                return redirect()->back()->with('msg', 'Файл успешно сохранён');
            } else {
                return redirect()->back()->with('msg', 'Файл не найден');
            }
        }

        return redirect()->back()->with('msg', 'Файл не найден');
    }


}
