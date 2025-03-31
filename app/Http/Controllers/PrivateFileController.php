<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\{
    Auth,
    Storage
};
use App\Models\File;
use App\Http\Controllers\EncryptionController;

class PrivateFileController extends Controller
{
    protected $encryptionController;

    public function __construct(EncryptionController $encryptionController)
    {
        $this->encryptionController = $encryptionController;
    }

    /**
     * Получение URL для файла.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFileUrl($id)
    {
        $file = File::where('id', $id)->where('user_id', Auth::id())->first();

        if (!$file) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $url = route('private.file', ['id' => $file->id]);

        return response()->json(['fileUrl' => $url]);
    }

    /**
     * Показ изображения.
     *
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function showImage($id)
    {
        $file = File::where('id', $id)->where('user_id', Auth::id())->first();
        if (!$file) {
            abort(404, 'Файл не найден или у вас нет доступа.');
        }

        $filePath = $file->path;
        if (Storage::exists($filePath)) {
            $encryptedContent = Storage::get($filePath);
            $decryptedContent = $this->encryptionController->decryptFile($encryptedContent);

            $tempPath = storage_path('app/private/temp_' . $file->id);
            file_put_contents($tempPath, $decryptedContent);

            return response()->file($tempPath)->deleteFileAfterSend(true);
        }

        return response()->json(['error' => 'Файл не найден на сервере'], 404);
    }

    /**
     * Показ видео.
     *
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function showVideo($id)
    {
        $file = File::where('id', $id)->where('user_id', Auth::id())->first();
        if (!$file) {
            abort(404, 'Файл не найден или у вас нет доступа.');
        }

        $filePath = $file->path;
        if (Storage::exists($filePath)) {
            $encryptedContent = Storage::get($filePath);
            $decryptedContent = $this->encryptionController->decryptFile($encryptedContent);

            $tempPath = storage_path('app/private/temp_' . $file->id);
            file_put_contents($tempPath, $decryptedContent);

            return response()->file($tempPath)->deleteFileAfterSend(true);
        }

        return response()->json(['error' => 'Файл не найден на сервере'], 404);
    }
}
