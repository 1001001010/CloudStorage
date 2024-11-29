<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    protected $fillable = ['title', 'parent_id', 'user_id'];
    /**
     * Обратная связь с дочерней папкой
     */
    public function children()
    {
        return $this->hasMany(Folder::class, 'parent_id');
    }
    /**
     * Обратная связь с родительской папкой
     */
    public function parent()
    {
        return $this->belongsTo(Folder::class, 'parent_id');
    }
    /**
     * Обратная связь с моделью User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
