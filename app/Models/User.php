<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
     * Атрибуты, которые следует скрыть для сериализация.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Атрибуты, которые следует привести.
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
     * Связь с моделей Session
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(Session::class);
    }

    /**
     * Связь с моделей Folder
     */
    public function folders()
    {
        return $this->hasMany(Folder::class);
    }

    public function folderCount(): int // Подсчет кол-ва созданных папок: int
    {
        return $this->folders()->count();
    }

    /**
     * Связь с моделей File
     */
    public function files()
    {
        return $this->hasMany(File::class);
    }

    public function fileCount(): int // Подсчет кол-ва загруженных файлов: int
    {
        return $this->files()->count();
    }

    /**
     * Связь с моделей FileUserAccess
     */
    public function fileUserAccesses()
    {
        return $this->hasMany(FileUserAccess::class);
    }
}
