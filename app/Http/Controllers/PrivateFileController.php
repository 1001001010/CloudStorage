<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\File;

class PrivateFileController extends Controller
{
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
            return response()->file(Storage::path($filePath));
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
            return response()->file(Storage::path($filePath));
        }

        return response()->json(['error' => 'Файл не найден на сервере'], 404);
    }
}
