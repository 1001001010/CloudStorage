<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\AccessUploadRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\{Inertia, Response};
use App\Models\{File, FileAccessToken, FileUserAccess};

class FileAccessTokenController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $files = FileUserAccess::with(['accessToken.file',
                                        'accessToken.file.extension',
                                        'accessToken.file.user',
                                        'accessToken.file.mimeType'])->where('user_id', $user->id)->get()
        ->map(function ($fileUserAccess) {
            return $fileUserAccess->accessToken->file;
        })->unique();
        return Inertia::render('Shared', [
            'files' => $files,
        ]);
    }

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

    public function invite($token) {
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
