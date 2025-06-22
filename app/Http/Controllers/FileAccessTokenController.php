<?php

namespace App\Http\Controllers;

use App\Http\Requests\Upload\AccessUploadRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\{Request, RedirectResponse};
use Inertia\{Inertia, Response};
use App\Models\{File, FileAccessToken, FileUserAccess};
use App\Services\Access\FileAccessService;
use App\Services\File\FileDownloadService;
use App\Services\Cryptography\FileEncryptionService;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class FileAccessTokenController extends Controller
{
    public function __construct(
        protected FileAccessService $fileAccessService,
        protected FileDownloadService $fileDownloadService,
        protected FileEncryptionService $fileEncryptionService,
    ) {
    }

    /**
     * Отображение страницы со списком файлов с общим доступом
     *
     * @return Response
     */
    public function index(): Response
    {
        $files = $this->fileAccessService->getSharedFilesForCurrentUser();
        $createdTokens = $this->fileAccessService->getCreatedAccessTokens();

        return Inertia::render('Shared', [
            'files' => $files,
            'created_tokens' => $createdTokens,
        ]);
    }

    /**
     * Создание токена для предоставления доступа к файлу
     *
     * @param AccessUploadRequest $request
     * @return RedirectResponse
     */
    public function upload(AccessUploadRequest $request): RedirectResponse
    {
        $result = $this->fileAccessService->createAccessToken(
            $request->file_id,
            $request->user_limit,
            $request->expires_at,
            $request->access_type
        );

        if (!$result) {
            return redirect()->back()->with('msg', [
                'title' => 'Файл не найден или у вас нет прав доступа',
            ]);
        }

        return redirect()->back()->with('msg', $result);
    }

    /**
     * Получает доступ к файлу по токену
     * Для авторизованных - добавляет в общий доступ и редирект
     * Для неавторизованных - прямое скачивание файла
     *
     * @param string $token
     * @param Request $request
     * @return RedirectResponse|BinaryFileResponse
     */
    public function invite(string $token, Request $request): RedirectResponse|BinaryFileResponse
    {
        try {
            $accessToken = FileAccessToken::with(['file', 'file.extension'])->where('access_token', $token)->firstOrFail();

            // Проверяем базовые условия доступа
            if ($accessToken->isExpired()) {
                return $this->redirectWithError('Срок действия ссылки истёк');
            }

            if (!$accessToken->canAddUser()) {
                return $this->redirectWithError('Доступ к файлу закрыт (достигнут лимит)');
            }

            // Проверяем, не является ли пользователь владельцем файла
            if (Auth::check() && $accessToken->file->user_id == Auth::id()) {
                return $this->redirectWithError('Вы не можете поделиться файлом с собой');
            }

            // Обрабатываем доступ в зависимости от типа токена и авторизации
            if ($accessToken->access_type === 'authenticated_only') {
                return $this->handleAuthenticatedAccess($accessToken);
            }

            return $this->handlePublicAccess($accessToken, $request);

        } catch (\Exception $e) {
            \Log::error('Ошибка при обработке токена доступа: ' . $e->getMessage(), [
                'token' => $token,
                'trace' => $e->getTraceAsString()
            ]);
            return $this->redirectWithError('Ссылка недействительна');
        }
    }

    /**
     * Обрабатывает доступ для токенов только с авторизацией
     */
    private function handleAuthenticatedAccess(FileAccessToken $accessToken): RedirectResponse
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('msg', [
                'title' => 'Необходима авторизация для доступа к файлу'
            ]);
        }

        $result = $this->fileAccessService->handleInvite($accessToken->access_token, request());
        return redirect()->to($result['redirect'])->with('msg', $result['msg']);
    }

    /**
     * Обрабатывает публичный доступ
     */
    private function handlePublicAccess(FileAccessToken $accessToken, Request $request): RedirectResponse|BinaryFileResponse
    {
        // Записываем доступ в статистику
        $this->fileAccessService->recordPublicAccess($accessToken, $request);

        // Если пользователь авторизован - добавляем в общий доступ и редиректим
        if (Auth::check()) {
            $this->fileAccessService->addUserAccess($accessToken, Auth::id());

            return redirect()->route('shared.index')->with('msg', [
                'title' => 'Доступ получен',
                'description' => 'Файл добавлен в ваш список общих файлов'
            ]);
        }

        // Для неавторизованных - прямое скачивание файла
        try {
            return $this->downloadFile($accessToken->file);
        } catch (\Exception $e) {
            \Log::error('Ошибка скачивания файла: ' . $e->getMessage(), [
                'file_id' => $accessToken->file->id,
                'path' => $accessToken->file->path,
                'token' => $accessToken->access_token,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->redirectWithError('Ошибка при скачивании файла. Пожалуйста, попробуйте позже.');
        }
    }

    /**
     * Скачивание зашифрованного файла с расшифровкой
     */
    private function downloadFile(File $file): BinaryFileResponse
    {
        $downloadResponse = $this->fileDownloadService->getDecryptedDownloadResponse(
            $file,
            $this->fileEncryptionService
        );

        if (!$downloadResponse) {
            abort(404, 'Файл не найден на сервере');
        }

        return $downloadResponse;
    }

    /**
     * Редирект с ошибкой
     */
    private function redirectWithError(string $message): RedirectResponse
    {
        $redirectTo = Auth::check() ? route('index') : '/';

        return redirect()->to($redirectTo)->with('msg', [
            'title' => $message
        ]);
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

    /**
     * Удаляет токен доступа
     *
     * @param FileAccessToken $token
     * @return RedirectResponse
     */
    public function destroy(FileAccessToken $token): RedirectResponse
    {
        if (!$this->fileAccessService->deleteAccessToken($token)) {
            return back()->with('msg', ['title' => 'У вас нет прав для удаления этого токена']);
        }

        return back()->with('msg', ['title' => 'Токен доступа удален']);
    }

    /**
     * Показывает статистику доступа к файлу
     *
     * @param FileAccessToken $token
     * @return Response
     */
    public function statistics(FileAccessToken $token): Response
    {
        // Проверяем права доступа
        if ($token->file->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('FileStatistics', [
            'token' => $token,
            'file' => $token->file,
            'statistics' => $token->getAccessStatistics(),
        ]);
    }

    /**
     * API: Получает актуальную информацию о токене
     *
     */
    public function apiGetToken(FileAccessToken $token)
    {
        // Проверяем права доступа
        if ($token->file->user_id !== Auth::id()) {
            return response()->json(['error' => 'Нет доступа'], 403);
        }

        // Загружаем свежие данные из базы
        $freshToken = FileAccessToken::with([
            'file',
            'file.extension',
            'usersWithAccess.user',
            'publicAccesses.user'
        ])->find($token->id);

        return response()->json($freshToken);
    }
}