<?php

namespace App\Services\Access;

use App\Models\{FileUserAccess, File, FileAccessToken};
use Illuminate\Support\Facades\{Auth, URL};
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Carbon\Carbon;

class FileAccessService {

    /**
     * Получаем список файлов, к которым пользователь имеет доступ
     *
     * @return Collection
     */
    public function getSharedFilesForCurrentUser(): Collection {
        return FileUserAccess::with([
                'accessToken.file',
                'accessToken.file.extension',
                'accessToken.file.user',
                'accessToken.file.mimeType',
            ])
            ->where('user_id', Auth::id())
            ->get()
            ->map(fn ($fileUserAccess) => $fileUserAccess->accessToken->file)
            ->unique();
    }

    /**
     * Создаёт токен для доступа к файлу, если файл принадлежит текущему пользователю
     *
     * @param int $fileId
     * @param int|null $userLimit
     * @param string|null $expires_at
     * @return array|null
     * @throws ModelNotFoundException
     */
    public function createAccessToken(int $fileId, ?int $userLimit = null, ?string $expires_at = null): ?array {
        $file = File::findOrFail($fileId);
        if ($file->user_id !== Auth::id()) {
            return null;
        }

        $accessToken = bin2hex(random_bytes(32));

        $access = FileAccessToken::create([
            'file_id' => $file->id,
            'access_token' => $accessToken,
            'user_limit' => $userLimit,
            'expires_at' => $expires_at ? Carbon::parse($expires_at) : null,
        ]);

        return [
            'title' => 'Ссылка успешно создана',
            'access_link' => URL::route('access.user.upload', ['token' => $access->access_token]),
        ];
    }

    /**
     * Обрабатывает приглашение по токену: проверка, создание доступа
     *
     * @param string $token
     * @return array ['redirect' => route, 'msg' => []]
     */
    public function handleInvite(string $token): array
    {
        $access = FileAccessToken::with('file')->where('access_token', $token)->firstOrFail();

        if ($access->expires_at && $access->expires_at->isPast()) {
            return [
                'redirect' => url()->previous(),
                'msg' => ['title' => 'Срок действия ссылки истёк']
            ];
        }

        if ($access->file->user_id == Auth::id()) {
            return [
                'redirect' => url()->previous(),
                'msg' => ['title' => 'Вы не можете поделиться файлом с собой']
            ];
        }

        if (!$access->canAddUser()) {
            return [
                'redirect' => url()->previous(),
                'msg' => ['title' => 'Доступ к файлу закрыт']
            ];
        }

        $existingAccess = FileUserAccess::where('file_access_token_id', $access->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingAccess) {
            return [
                'redirect' => url()->previous(),
                'msg' => ['title' => 'Файл уже загружен']
            ];
        }

        FileUserAccess::create([
            'file_access_token_id' => $access->id,
            'user_id' => Auth::id()
        ]);

        return [
            'redirect' => route('shared.index'),
            'msg' => [
                'title' => 'Доступ получен',
                'description' => 'Можете просмотреть его во вкладке "Общий доступ"'
            ]
        ];
    }

    /**
     * Удаляет или восстанавливает доступ пользователя к файлу.
     *
     * @param FileAccessToken $token
     * @param int $userId
     * @return string Сообщение об успехе
     */
    public function toggleUserAccess(FileAccessToken $token, int $userId): string
    {
        $access = $token->usersWithAccess()->where('user_id', $userId)->first();

        if ($access->trashed()) {
            $access->restore();
            return 'Доступ успешно восстановлен';
        }

        $access->delete();
        return 'Доступ успешно отозван';
    }
}
