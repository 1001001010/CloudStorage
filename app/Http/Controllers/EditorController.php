<?php

namespace App\Http\Controllers;

use Illuminate\Http\{
    Request,
    RedirectResponse,
    InertiaResponse
};
use Inertia\{
    Inertia,
    Response
};
use Illuminate\Support\Facades\{
    Auth,
    Storage
};
use App\Models\File;
use App\Services\Cryptography\FileEncryptionService;

class EditorController extends Controller
{
    protected FileEncryptionService $encryptService;

    public function __construct(
        FileEncryptionService $encryptService,
    ) {
        $this->encryptService = $encryptService;
    }

    /**
     * Отображение страницы редактирования текстовых файлов
     *
     * @param File $file
     * @return InertiaResponse|RedirectResponse
     */
    public function index(File $file) {
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
            'application/x-yaml', 'text/yaml',
            'application/xml', 'text/xml',
        ];

        $file = File::where('user_id', Auth::id())->find($file->id);

        if (!$file) {
            return redirect()->back()->with('msg', ['title' => 'Файл не найден']);
        }

        if (!in_array($file->extension->extension, $allowedExtensions) ||
            !in_array($file->mimeType->mime_type, $allowedMimeTypes)) {
            return redirect()->back()->with('msg', ['title' => 'Невозможно открыть файл']);
        }

        if (!Storage::disk('local')->exists($file->path)) {
            return redirect()->back()->with('msg', ['title' => 'Файл отсутствует в хранилище']);
        }

        $language = $this->getLanguageByExtension($file->extension->extension);

        $encryptedContent = Storage::disk('local')->get($file->path);
        $decryptedContent = $this->encryptService->decryptFile($encryptedContent);

        $file->content = $decryptedContent;

        return Inertia::render('Editor', [
            'file' => $file,
            'language' => $language
        ]);
    }

    /**
     * Определение языка программирования на основе расширения файла
     *
     * @param string $extension
     * @return string
     */
    private function getLanguageByExtension($extension): string {
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

    /**
     * Сохраняет изменения в файле
     *
     * @param Request $request
     * @param File $file
     * @return RedirectResponse
     */
    public function upload(Request $request, File $file): RedirectResponse
    {
        $file = File::where('user_id', Auth::id())->find($file->id);

        if (!$file) {
            return redirect()->back()->with('msg', ['title' => 'Файл не найден']);
        }

        if (!Storage::disk('local')->exists($file->path)) {
            return redirect()->back()->with('msg', ['title' => 'Файл отсутствует в хранилище']);
        }

        try {
            $fileText = $request->input('fileText');

            $encryptedContent = $this->encryptService->encryptFile($fileText);

            Storage::disk('local')->put($file->path, $encryptedContent);

            $newFileSize = Storage::disk('local')->size($file->path);
            $file->size = $newFileSize;
            $file->save();

            return back()->with('msg', ['title' => 'Файл успешно сохранён']);
        } catch (\Exception $e) {
            return back()->with('msg', ['title' => 'Ошибка при сохранении файла']);
        }
    }
}
