<?php

namespace App\Services\Access;

use App\Models\{FileUserAccess, File, FileAccessToken, FilePublicAccess};
use Illuminate\Support\Facades\{Auth, URL};
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Carbon\Carbon;

class FileAccessService
{

    /**
     * Получаем список файлов, к которым пользователь имеет доступ
     *
     * @return Collection
     */
    public function getSharedFilesForCurrentUser(): Collection
    {
        return FileUserAccess::with([
            'accessToken.file',
            'accessToken.file.extension',
            'accessToken.file.user',
            'accessToken.file.mimeType',
        ])
            ->where('user_id', Auth::id())
            ->get()
            ->map(fn($fileUserAccess) => $fileUserAccess->accessToken->file)
            ->unique();
    }

    /**
     * Получаем список токенов доступа, созданных текущим пользователем
     *
     * @return Collection
     */
    public function getCreatedAccessTokens(): Collection
    {
        return FileAccessToken::with([
            'file',
            'file.extension',
            'usersWithAccess.user',
            'publicAccesses.user'
        ])
            ->whereHas('file', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->get()
            ->map(function ($token) {
                return [
                    'token' => $token,
                    'file' => $token->file,
                    'statistics' => $token->getAccessStatistics(),
                    'access_link' => URL::route('access.user.upload', ['token' => $token->access_token])
                ];
            });
    }

    /**
     * Создаёт токен для доступа к файлу, если файл принадлежит текущему пользователю
     *
     * @param int $fileId
     * @param int|null $userLimit
     * @param string|null $expires_at
     * @param string $accessType
     * @return array|null
     * @throws ModelNotFoundException
     */
    public function createAccessToken(int $fileId, ?int $userLimit = null, ?string $expires_at = null, string $accessType = 'authenticated_only'): ?array
    {
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
            'access_type' => $accessType,
        ]);

        $description = $accessType === 'public'
            ? 'Ссылка доступна для всех пользователей (включая неавторизованных)'
            : 'Ссылка доступна только для авторизованных пользователей';

        return [
            'title' => 'Ссылка успешно создана',
            'description' => $description,
            'access_link' => URL::route('access.user.upload', ['token' => $access->access_token]),
            'access_type' => $accessType
        ];
    }

    /**
     * Записывает публичный доступ в статистику
     */
    public function recordPublicAccess(FileAccessToken $accessToken, Request $request): void
    {
        // Проверяем, есть ли уже запись с таким же IP и user agent
        $existingAccess = FilePublicAccess::where('file_access_token_id', $accessToken->id)
            ->where('ip_address', $request->ip())
            ->where('user_agent', $request->userAgent())
            ->first();

        // Создаем запись в любом случае для статистики
        FilePublicAccess::create([
            'file_access_token_id' => $accessToken->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => Auth::id(), // null если не авторизован
        ]);

        // Увеличиваем счетчик использований только если это новая комбинация IP + user agent
        if (!$existingAccess) {
            $accessToken->increment('usage_count');
        }
    }

    /**
     * Добавляет пользователя в список доступа
     */
    public function addUserAccess(FileAccessToken $accessToken, int $userId): void
    {
        $existingAccess = FileUserAccess::where('file_access_token_id', $accessToken->id)
            ->where('user_id', $userId)
            ->first();

        if (!$existingAccess) {
            FileUserAccess::create([
                'file_access_token_id' => $accessToken->id,
                'user_id' => $userId
            ]);
        }
    }

    /**
     * Обрабатывает приглашение по токену: проверка, создание доступа
     * (Оставляем для совместимости с авторизованными пользователями)
     *
     * @param string $token
     * @param Request|null $request
     * @return array ['redirect' => route, 'msg' => []]
     */
    public function handleInvite(string $token, ?Request $request = null): array
    {
        $access = FileAccessToken::with('file')->where('access_token', $token)->firstOrFail();

        if ($access->isExpired()) {
            return [
                'redirect' => url()->previous(),
                'msg' => ['title' => 'Срок действия ссылки истёк']
            ];
        }

        if (!$access->canAddUser()) {
            return [
                'redirect' => url()->previous(),
                'msg' => ['title' => 'Доступ к файлу закрыт (достигнут лимит)']
            ];
        }

        // Проверяем, не является ли пользователь владельцем файла
        if (Auth::check() && $access->file->user_id == Auth::id()) {
            return [
                'redirect' => url()->previous(),
                'msg' => ['title' => 'Вы не можете поделиться файлом с собой']
            ];
        }

        $existingAccess = FileUserAccess::where('file_access_token_id', $access->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingAccess) {
            return [
                'redirect' => route('shared.index'),
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

    /**
     * Удаляет токен доступа
     *
     * @param FileAccessToken $token
     * @return bool
     */
    public function deleteAccessToken(FileAccessToken $token): bool
    {
        // Проверяем, что пользователь является владельцем файла
        if ($token->file->user_id !== Auth::id()) {
            return false;
        }

        $token->delete();
        return true;
    }
}