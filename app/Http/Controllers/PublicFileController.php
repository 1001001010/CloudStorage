<?php

namespace App\Http\Controllers;

use App\Models\{File, FileAccessToken, FilePublicAccess};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Storage, Response};
use Symfony\Component\HttpFoundation\StreamedResponse;

class PublicFileController extends Controller
{
    /**
     * Обрабатывает запрос на публичный доступ к файлу
     *
     * @param string $token
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function access(string $token, Request $request)
    {
        $accessToken = FileAccessToken::where('access_token', $token)
            ->with('file')
            ->first();

        if (!$accessToken || $accessToken->access_type !== 'public') {
            abort(404, 'Ссылка недействительна или требует авторизации');
        }

        if ($accessToken->isExpired()) {
            return response()->view('public.expired', [
                'message' => 'Срок действия ссылки истёк'
            ], 403);
        }

        if (!$accessToken->canAddUser()) {
            return response()->view('public.limit-reached', [
                'message' => 'Достигнут лимит доступов к файлу'
            ], 403);
        }

        // Записываем информацию о доступе
        FilePublicAccess::create([
            'file_access_token_id' => $accessToken->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => Auth::id(), // null если не авторизован
        ]);

        // Увеличиваем счетчик использований
        $accessToken->increment('usage_count');

        $file = $accessToken->file;

        // Для изображений и PDF можно показать превью
        if (in_array($file->extension->extension, ['jpg', 'jpeg', 'png', 'gif', 'pdf'])) {
            return view('public.preview', [
                'file' => $file,
                'token' => $token
            ]);
        }

        // Для других типов файлов - страница скачивания
        return view('public.download', [
            'file' => $file,
            'token' => $token
        ]);
    }

    /**
     * Скачивание файла по публичному токену
     *
     * @param string $token
     * @param Request $request
     * @return StreamedResponse
     */
    public function download(string $token, Request $request): StreamedResponse
    {
        $accessToken = FileAccessToken::where('access_token', $token)
            ->where('access_type', 'public')
            ->with('file')
            ->firstOrFail();

        if ($accessToken->isExpired() || !$accessToken->canAddUser()) {
            abort(403, 'Доступ к файлу ограничен');
        }

        $file = $accessToken->file;
        $path = Storage::disk('local')->path($file->path);

        if (!file_exists($path)) {
            abort(404, 'Файл не найден');
        }

        $headers = [
            'Content-Type' => $file->mimeType->mime_type,
            'Content-Disposition' => 'attachment; filename="' . $file->name . '.' . $file->extension->extension . '"',
        ];

        return Response::download($path, $file->name . '.' . $file->extension->extension, $headers);
    }
}
