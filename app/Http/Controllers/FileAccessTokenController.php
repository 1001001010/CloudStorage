<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\AccessUploadRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\{File, FileAccessToken};

class FileAccessTokenController extends Controller
{
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
            'title' => 'Ссылка успешно создана',
            'action' => [
                'label' => 'Скопировать',
                'onClick' => url(route('access.user.upload', ['token' => $access->access_token])),
            ],
        ]);
    }
}
