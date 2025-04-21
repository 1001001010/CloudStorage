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
     * Проверка, можно ли добавить нового пользователя
     *
     * @return bool
     */
    public function canAddUser()
    {
        return $this->usersWithAccess()->count() < $this->user_limit;
    }
}
