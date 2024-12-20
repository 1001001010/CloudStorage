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
            'txt', 'md', 'csv', 'log', 'js', 'ts', 'jsx', 'tsx',
            'py', 'java', 'cpp', 'c', 'h', 'hpp', 'rb', 'php',
            'go', 'rs', 'swift', 'kt', 'kts', 'm', 'sh',
            'bash', 'sql', 'html', 'css', 'scss', 'sass',
            'json', 'yaml', 'yml', 'xml', 'r',
            'pl', 'pm', 'lua', 'hs',
            'ex', 'exs'
        ];


        $allowedMimeTypes = [
            'text/plain',
            'text/markdown',
            'text/csv',
            'text/plain',
            'application/javascript',
            'application/x-php',
            'text/html',
            'text/x-python',
            'text/x-script.python',
            'text/typescript',
            'text/x-java-source',
            'text/x-c++src',
            'text/x-csrc',
            'text/x-c',
            'application/x-ruby',
            'application/sql',
            'text/css',
            'application/json',
            ['application/x-yaml','text/yaml'],
           ['application/xml','text/xml'],
        ];


        $file = File::with(['extension', 'mimeType'])->where('user_id', Auth::id())->find($fileId);
        if ($file) {
            if (in_array($file->extension->extension, $allowedExtensions) && in_array($file->mimeType->mime_type, $allowedMimeTypes)) {
                $language = $this->getLanguageByExtension($file->extension->extension);
                $file->content = file_get_contents(storage_path('app/public/' . $file->path));
                return Inertia::render('Editor', ['file' => $file, 'language' => $language]);
            } else {
                return redirect()->back()->with('msg', [
                    'title' => 'Невозможно открыть файл',
                ]);
            }
        } else {
            return redirect()->back()->with('msg', [
                'title' => 'Файл не найден',
            ]);;
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
            'c' => 'c',
            'h' => 'c',
            'hpp' => 'cpp',
            'rb' => 'ruby',
            'go' => 'go',
            'rs' => 'rust',
            'swift' => 'swift',
            'kt' => 'kotlin',
            'kts' => 'kotlin',
            'm' => 'objective-c',
            'sh' => 'bash',
            'bash' => 'bash',
            'sql' => 'sql',
            'txt' => 'text',
            'md' => 'markdown',
            'csv' => 'csv',
            'log' => 'log',
            'json' => 'json'
        ];


        return $languageMap[$extension] ?? 'text';
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

                return redirect()->back()->with('msg', [
                    'title' => 'Файл успешно сохранён',
                ]);
            } else {
                return redirect()->back()->with('msg', [
                    'title' => 'Файл не найден',
                ]);
            }
        }

        return redirect()->back()->with('msg', [
            'title' => 'Файл не найден',
        ]);
    }


}
