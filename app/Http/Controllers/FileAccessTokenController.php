<?php

namespace App\Http\Controllers;

use App\Http\Requests\Upload\AccessUploadRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\{
    Request,
    RedirectResponse
};
use Inertia\{
    Inertia,
    Response
};
use App\Models\{
    File,
    FileAccessToken,
    FileUserAccess
};
use App\Services\Access\FileAccessService;

class FileAccessTokenController extends Controller {

    public function __construct(
        protected FileAccessService $fileAccessService,
    ) {}


    /**
     * Отображение страницы со списком файлов с общим доступом
     *
     * @return Response
     */
    public function index() : Response {
        $files = $this->fileAccessService->getSharedFilesForCurrentUser();

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
        $result = $this->fileAccessService->createAccessToken(
            $request->file_id,
            $request->user_limit,
            $request->expires_at
        );

        if (!$result) {
            return redirect()->back()->with('msg', [
                'title' => 'Файл не найден',
            ]);
        }

        return redirect()->back()->with('msg', $result);
    }

    /**
     * Получает доступ к файлу по токену и перенаправляет с уведомлением
     *
     * @param string $token
     * @return RedirectResponse
     */
    public function invite(string $token): RedirectResponse
    {
        $result = $this->fileAccessService->handleInvite($token);
        return redirect()->to($result['redirect'])->with('msg', $result['msg']);
    }

    /**
     * Переключает доступ пользователя к файлу
     *
     * @param FileAccessToken $token
     * @param Request $request
     * @return RedirectResponse
     */
    public function delete(FileAccessToken $token, Request $request): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => 'required|numeric|min:1',
        ]);

        $message = $this->fileAccessService->toggleUserAccess($token, $data['user_id']);

        return back()->with('msg', ['title' => $message]);
    }
}
