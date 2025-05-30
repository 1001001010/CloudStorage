<?php

namespace App\Models;

use Illuminate\Database\Eloquent\{
    Model,
    Factories\HasFactory
};

class FileAccessToken extends Model
{
    use HasFactory;

    /**
     * Атрибуты, которые могут быть массово присвоены
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'file_id',
        'access_token',
        'user_limit',
        'expires_at',
        'access_type',
        'usage_count'
    ];

    /**
     * Атрибуты модели, которые должны быть приведены к определённым типам
     *
     * @var array
     */
    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Связь с моделью File
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function file()
    {
        return $this->belongsTo(File::class);
    }

    /**
     * Связь с моделью FileUserAccess
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function usersWithAccess()
    {
        return $this->hasMany(FileUserAccess::class)->withTrashed();
    }

    /**
     * Связь с моделью FilePublicAccess
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function publicAccesses()
    {
        return $this->hasMany(FilePublicAccess::class);
    }

    /**
     * Проверка, можно ли добавить нового пользователя
     *
     * @return bool
     */
    public function canAddUser()
    {
        if ($this->access_type === 'public') {
            return $this->usage_count < $this->user_limit;
        }

        return $this->usersWithAccess()->count() < $this->user_limit;
    }

    /**
     * Проверка, истек ли срок действия токена
     *
     * @return bool
     */
    public function isExpired()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Проверка, можно ли получить доступ к файлу
     *
     * @return bool
     */
    public function canAccess()
    {
        return !$this->isExpired() && $this->canAddUser();
    }

    /**
     * Получить статистику доступов
     *
     * @return array
     */
    public function getAccessStatistics()
    {
        if ($this->access_type === 'authenticated_only') {
            return [
                'type' => 'authenticated',
                'total_accesses' => $this->usersWithAccess()->count(),
                'active_accesses' => $this->usersWithAccess()->whereNull('deleted_at')->count(),
                'users' => $this->usersWithAccess()->with('user')->get()
            ];
        }

        return [
            'type' => 'public',
            'total_accesses' => $this->usage_count,
            'unique_ips' => $this->publicAccesses()->distinct('ip_address')->count(),
            'authenticated_users' => $this->publicAccesses()->whereNotNull('user_id')->distinct('user_id')->count(),
            'recent_accesses' => $this->publicAccesses()->with('user')->latest()->take(10)->get()
        ];
    }
}