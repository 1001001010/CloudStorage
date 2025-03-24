<?php

namespace App\Models;

use Illuminate\Database\Eloquent\{
    Model,
    Factories\HasFactory
};

class Folder extends Model
{
    use HasFactory;

    /**
     * Атрибуты, которые могут быть массово присвоены
     *
     * @var array<int, string>
     */
    protected $fillable = ['title', 'parent_id', 'user_id'];

    /**
     * Связь с дочерней папкой
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function children()
    {
        return $this->hasMany(Folder::class, 'parent_id');
    }

    /**
     * Связь с родительской папкой
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function parent()
    {
        return $this->belongsTo(Folder::class, 'parent_id');
    }

    /**
     * Связь с моделью User
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
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
     * Проверяет, принадлежит ли папка текущему пользователю.
     *
     * @param int $userId
     * @return bool
     */
    public function belongsToUser(int $userId): bool
    {
        return $this->user_id === $userId;
    }
}
