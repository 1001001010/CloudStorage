<?php

namespace App\Models;

use Illuminate\Database\Eloquent\{
    Factories\HasFactory,
    Relations\HasMany
};
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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
        'password',
    ];

    /**
     * Преобразование атрибутов в заданные типы
     *
     * @return array<string, string>
     */
    protected function casts(): array
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
    public function sessions(): HasMany
    {
        return $this->hasMany(Session::class);
    }

    /**
     * Связь с моделью Folder
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function folders()
    {
        return $this->hasMany(Folder::class);
    }

    /**
     * Получение количества папок, созданных пользователем
     *
     * @return int
     */
    public function folderCount(): int
    {
        return $this->folders()->count();
    }

    /**
     * Связь с моделью File
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function files()
    {
        return $this->hasMany(File::class);
    }

    /**
     * Получение количества файлов, загруженных пользователем
     *
     * @return int
     */
    public function fileCount(): int
    {
        return $this->files()->count();
    }

    /**
     * Связь с моделью FileUserAccess
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function fileUserAccesses()
    {
        return $this->hasMany(FileUserAccess::class);
    }
}
