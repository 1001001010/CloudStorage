<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccessUploadRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\{Request, RedirectResponse};
use Inertia\{Inertia, Response};
use App\Models\{File, FileAccessToken, FileUserAccess};

class FileAccessTokenController extends Controller
{
    /**
     * Отображение страницы со списком файлов с общим доступом
     *
     * @return Response
     */
    public function index(): Response {

        $files = FileUserAccess::with(['accessToken.file',
                                        'accessToken.file.extension',
                                        'accessToken.file.user',
                                        'accessToken.file.mimeType'])->where('user_id', Auth::id())->get()
        ->map(function ($fileUserAccess) {
            return $fileUserAccess->accessToken->file;
        })->unique();
        return Inertia::render('Shared', [
            'files' => $files,
        ]);
    }

    /**
     * Создание токена для предоставления доступа к файлу
     *
     * @param AccessUploadRequest $request
     * @return RedirectResponse
     */
    public function upload(AccessUploadRequest $request): RedirectResponse {
        $file = File::findOrFail($request->file_id);

        if ($file->user_id != Auth::id()) {
            return redirect()->back()->with('msg', [
                'title' => 'Файл не найден',
            ]);
        }

        $accessToken = bin2hex(random_bytes(32));
        $access = FileAccessToken::create([
            'file_id' => $file->id,
            'access_token' => $accessToken,
            'user_limit' => $request->user_limit,
        ]);

        return redirect()->back()->with('msg', [
            'access_link' => url(route('access.user.upload', ['token' => $access->access_token])),
            'title' => 'Ссылка успешно создана'
        ]);
    }

    /**
     * Получение доступа к файлу по предоставленной ссылке с токеном
     *
     * @param string $token
     * @return RedirectResponse
     */
    public function invite($token): RedirectResponse {
        $access = FileAccessToken::with('file')->where('access_token', $token)->firstOrFail();
        if($access->file->user_id == Auth::id()) {
            return redirect()->back()->with('msg', [
                'title' => 'Вы не можете поделиться файлом с собой'
            ]);
        }
        if($access->canAddUser()) {
            $userAcess = FileUserAccess::where('file_access_token_id', $access->id)->where('user_id', Auth::id())->first();
            if ($userAcess) {
                return redirect()->back()->with('msg', [
                    'title' => 'Файлы успешно загружен',
                ]);
            } else {
                FileUserAccess::create([
                    'file_access_token_id' => $access->id,
                    'user_id' => Auth::id()
                ]);

                return redirect(route('shared.index'))->with('msg', [
                    'title' => 'Доступ получен',
                    'description' => 'Можете просмотреть его в вкладке "Общий доступ"'
                ]);
            }
        } else {
            return redirect()->back()->with('msg', [
                'title' => 'Доступ к файлу закрыт',
            ]);
        }
    }
}
