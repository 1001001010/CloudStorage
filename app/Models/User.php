<?php

namespace App\Models;

use Illuminate\Database\Eloquent\{
    Factories\HasFactory,
    Relations\HasMany
};
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Crypt;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Атрибуты, которые можно назначать массово.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'provider',
        'encryption_key',
        'quota_id',
        'password',
    ];

    /**
     * Преобразование атрибутов в заданные типы
     *
     * @return array<string, string>
     */
    protected function casts() : array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /**
     * Связь с моделью Session
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function sessions() : HasMany
    {
        return $this->hasMany(Session::class);
    }

    /**
     * Связь с моделью Quota
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function quota()
    {
        return $this->belongsTo(Quota::class);
    }

    /**
     * Связь с моделью Folder
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function folders() : HasMany
    {
        return $this->hasMany(Folder::class);
    }

    /**
     * Получение количества папок, созданных пользователем
     *
     * @return int
     */
    public function folderCount() : int
    {
        return $this->folders()->count();
    }

    /**
     * Связь с моделью File
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function files() : HasMany
    {
        return $this->hasMany(File::class);
    }

    /**
     * Получение количества файлов, загруженных пользователем
     *
     * @return int
     */
    public function fileCount() : int
    {
        return $this->files()->count();
    }

    /**
     * Связь с моделью FileUserAccess
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function fileUserAccesses() : HasMany
    {
        return $this->hasMany(FileUserAccess::class);
    }

    /**
     * Генерация ключа шифрования для пользователя
     *
     * @return string
     */
    public static function generateEncryptionKey() : string
    {
        return base64_encode(random_bytes(32));
    }

    /**
     * Получаем ключ шифрования
     *
     * @return string
     */
    public function getEncryptionKeyAttribute() : string
    {
        return $this->attributes['encryption_key'];
    }
}
