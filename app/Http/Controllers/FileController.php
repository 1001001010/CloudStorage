<?php

namespace App\Http\Controllers;

use App\Services\Cryptography\FileEncryptionService;
use App\Services\File\{
    FileUploadService,
    FileRenameService,
    FileDownloadService,
    FileDeleteService
};
use Illuminate\Http\{
    Request,
    RedirectResponse
};
use Illuminate\Support\Facades\{
    Storage,
    Auth
};
use Illuminate\Support\Str;
use App\Http\Requests\Upload\FileUploadRequest;
use App\Http\Requests\Rename\FileRenameRequest;
use App\Models\{
    File,
    Folder,
    FileExtension,
    MimeType,
    FileUserAccess
};
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use App\Services\File\FileMoveService;

class FileController extends Controller
{

    public function __construct(
        protected FileEncryptionService $encryptService,
        protected FileUploadService $fileUploadService,
        protected FileRenameService $fileRenameService,
        protected FileDownloadService $fileDownloadService,
        protected FileDeleteService $fileDeleteService,
        private FileMoveService $fileMoveService
    ) {
    }

    /**z
     * Обработка загрузки файлов
     *
     * @param FileUploadRequest $request
     * @return RedirectResponse
     */
    public function upload(FileUploadRequest $request): RedirectResponse
    {
        $folder = $this->validateFolder($request->folder_id);
        if ($folder === false) {
            return $this->redirectWithError('Ошибка', 'Папка не найдена');
        }

        $messages = [];
        $successCount = 0;

        $fileCount = count($request->file('files'));
        $successfulFiles = [];

        foreach ($request->file('files') as $file) {
            $result = $this->fileUploadService->handleUploadFile($file, $folder?->id);
            if ($result['success']) {
                $successCount++;
                $successfulFiles[] = $file->getClientOriginalName();
            } else {
                $messages[] = $result['message'];
            }
        }

        if ($successCount === 0) {
            return $this->redirectWithError('Ошибка загрузки', implode("\n", $messages));
        }

        if ($successCount === 1) {
            $successMessage = "Файл \"{$successfulFiles[0]}\" успешно загружен.";
        } else {
            $successMessage = "{$successCount} файлов успешно загружено.";
        }

        $finalMessage = $successMessage;
        if (!empty($messages)) {
            $finalMessage .= "\n" . implode("\n", $messages);
        }

        return redirect()->route('index')->with('msg', [
            'title' => 'Загрузка завершена',
            'description' => $finalMessage,
        ]);
    }

    /**
     * Проверка и валидация папки
     *
     * @param int|null $folderId
     * @return Folder|null
     */
    protected function validateFolder($folderId): Folder|null
    {
        if ($folderId === null || $folderId == 0) {
            return null;
        }

        return Folder::where('id', $folderId)
            ->where('user_id', Auth::id())
            ->first();
    }

    /**
     * Скачивание файла
     *
     * @param File $file
     * @return BinaryFileResponse|RedirectResponse
     */
    public function download(File $file): BinaryFileResponse|RedirectResponse
    {
        if (!$this->checkUserFileAccess($file)) {
            return $this->redirectWithError('Нет прав на скачивание файла', '');
        }

        return $this->serveFile($file);
    }

    /**
     * Проверка прав доступа
     *
     * @param File $file
     * @return bool
     */
    protected function checkUserFileAccess(File $file): bool
    {
        return $file->user_id == Auth::id();
    }

    /**
     * Скачивание файла
     *
     * @param File $file
     * @return BinaryFileResponse|RedirectResponse
     */
    protected function serveFile(File $file): BinaryFileResponse|RedirectResponse
    {
        $response = $this->fileDownloadService->getDecryptedDownloadResponse($file, $this->encryptService);

        if (!$response) {
            return $this->redirectWithError('Файл не найден', '');
        }

        return $response;
    }

    /**
     * Мягкое удаление файла
     *
     * @param File $file
     * @return RedirectResponse
     */
    public function delete(File $file): RedirectResponse
    {
        $file = File::where('user_id', Auth::id())->find($file->id);

        if (!$file) {
            return redirect()->back()->with('msg', [
                'title' => 'Файл не найден',
            ]);
        }

        $deleted = $this->fileDeleteService->softDeleteFile($file);

        if (!$deleted) {
            return $this->redirectWithError('Ошибка', 'Удаление файла невозможно');
        }

        return redirect()->route('index')->with('msg', [
            'title' => 'Файл перемещён в корзину',
            'description' => 'Вы можете его восстановить из корзины'
        ]);
    }

    /**
     * Переименование файла
     *
     * @param Request $request
     * @param File $file
     * @return RedirectResponse
     */
    public function rename(File $file, FileRenameRequest $request): RedirectResponse
    {
        if ($file->user_id !== Auth::id()) {
            abort(404);
        }

        $data = $request->validated();
        $renamed = $this->fileRenameService->renameFile($file, $data['name']);

        if (!$renamed) {
            return $this->redirectWithError('Ошибка', 'Не удалось переименовать файл');
        }

        return redirect()->back()->with('msg', [
            'title' => 'Название успешно изменено',
        ]);
    }

    /**
     * Восстановление мягко удаленного файла
     *
     * @param File $file
     * @return RedirectResponse
     */
    public function restore(File $file): RedirectResponse
    {
        $file = File::onlyTrashed()
            ->where('user_id', Auth::id())
            ->find($file->id);

        if (!$file) {
            return redirect()->back()->with('msg', [
                'title' => 'Файл не найден',
            ]);
        }

        $restored = $this->fileDeleteService->restoreFile($file);

        if (!$restored) {
            return $this->redirectWithError('Ошибка восстановления', 'Файл не может быть восстановлен');
        }

        return redirect()->back()->with('msg', [
            'title' => 'Файлы успешно восстановлен',
        ]);
    }

    /**
     * Полное удаление файла
     *
     * @param File $file
     * @return RedirectResponse
     */
    public function forceDelete(File $file): RedirectResponse
    {
        $file = File::onlyTrashed()
            ->where('user_id', Auth::id())
            ->find($file->id);

        if (!$file) {
            return $this->redirectWithError('Файл не найден', '');
        }

        $deleted = $this->fileDeleteService->forceDeleteFile($file);

        if (!$deleted) {
            return $this->redirectWithError('Файл не найден на диске', '');
        }

        return redirect()->back()->with('msg', [
            'title' => 'Файл полностью удален'
        ]);
    }

    /**
     * Обработка редиректа с ошибкой
     *
     * @param string $title
     * @param string $description
     * @return RedirectResponse
     */
    protected function redirectWithError($title, $description): RedirectResponse
    {
        return redirect()->back()->with('msg', [
            'title' => $title,
            'description' => $description,
        ]);
    }

    public function getFoldersTree(Request $request)
    {
        try {
            $currentFolderId = $request->query('current_folder_id');
            $currentFolderId = $currentFolderId === '' ? null : (int) $currentFolderId;

            $folders = $this->fileMoveService->getFoldersTree($currentFolderId);

            return response()->json(['folders' => $folders]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function move(File $file, Request $request)
    {
        $request->validate([
            'folder_id' => 'nullable|integer|exists:folders,id'
        ]);

        try {
            $this->fileMoveService->moveFile($file, $request->folder_id);
            return redirect()->back()->with('success', 'Файл успешно перемещен');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Получение информации о файле через API
     *
     * @param File $file
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFileInfo(File $file)
    {
        try {
            // Проверяем права доступа
            if ($file->user_id !== Auth::id()) {
                return response()->json(['error' => 'Нет доступа к файлу'], 403);
            }

            // Загружаем файл со всеми связанными данными
            $fileWithRelations = File::with([
                'extension',
                'user',
                'folder',
                'accessTokens' => function ($query) {
                    $query->with([
                        'usersWithAccess.user',
                        'publicAccesses.user'
                    ]);
                }
            ])->find($file->id);

            if (!$fileWithRelations) {
                return response()->json(['error' => 'Файл не найден'], 404);
            }

            return response()->json([
                'success' => true,
                'file' => $fileWithRelations
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ошибка при получении информации о файле',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
