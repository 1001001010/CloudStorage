<?php

namespace App\Http\Controllers;

use App\Services\Cryptography\FileEncryptionService;
use App\Services\File\FileService;
use Illuminate\Http\{
    Request,
    RedirectResponse
};
use Illuminate\Support\Facades\{
    Storage,
    Auth
};
use Illuminate\Support\Str;
use App\Http\Requests\FileUploadRequest;
use App\Models\{
    File,
    Folder,
    FileExtension,
    MimeType,
    FileUserAccess
};
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class FileController extends Controller
{

    protected FileEncryptionService $encryptService;
    protected FileService $FileService;

    public function __construct(
        FileEncryptionService $encryptService,
        FileService $fileService,
    ) {
        $this->encryptService = $encryptService;
        $this->fileService = $fileService;
    }

    /**
     * Обработка загрузки файлов
     *
     * @param FileUploadRequest $request
     * @return RedirectResponse
     */
    public function upload(FileUploadRequest $request): RedirectResponse {
        $folder = $this->validateFolder($request->folder_id);
        if ($folder === false) {
            return $this->redirectWithError('Ошибка', 'Папка не найдена');
        }

        $messages = [];
        $successCount = 0;

        $fileCount = count($request->file('files'));
        $successfulFiles = [];

        foreach ($request->file('files') as $file) {
            $result = $this->fileService->handleUploadFile($file, $folder?->id);
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
    protected function validateFolder($folderId): Folder|null {
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
    protected function checkUserFileAccess(File $file): bool {
        return $file->user_id == Auth::id() || $this->userHasAccessToFile($file->id, Auth::id());
    }

    /**
     * Скачивание файла
     *
     * @param File $file
     * @return BinaryFileResponse|RedirectResponse
     */
    protected function serveFile(File $file): BinaryFileResponse|RedirectResponse
    {
        $response = $this->fileService->getDecryptedDownloadResponse($file, $this->encryptService);

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
    public function delete(File $file): RedirectResponse {
        $file = File::where('user_id', Auth::id())->find($file->id);

        if (!$file) {
            return redirect()->back()->with('msg', [
                'title' => 'Файл не найден',
            ]);
        }

        $deleted = $this->fileService->softDeleteFile($file);

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
    public function rename(Request $request, File $file): RedirectResponse {
        if ($file->user_id !== Auth::id()) {
            abort(404);
        }

        $validate_data = $request->validate([
            'name' => 'string|min:1'
        ]);

        $renamed = $this->fileService->renameFile($file, $request->name);

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
    public function restore(File $file): RedirectResponse {
        $file = File::onlyTrashed()
            ->where('user_id', Auth::id())
            ->find($file->id);

        if (!$file) {
            return redirect()->back()->with('msg', [
                'title' => 'Файл не найден',
            ]);
        }

        $restored = $this->fileService->restoreFile($file);

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
    public function forceDelete(File $file): RedirectResponse {
        $file = File::onlyTrashed()
            ->where('user_id', Auth::id())
            ->find($file->id);

        if (!$file) {
            return $this->redirectWithError('Файл не найден', '');
        }

        $deleted = $this->fileService->forceDeleteFile($file);

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
    protected function redirectWithError($title, $description): RedirectResponse {
        return redirect()->back()->with('msg', [
            'title' => $title,
            'description' => $description,
        ]);
    }
}
