<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    protected $fillable = ['title', 'user_id'];

    /**
     * Связь с родительскими папками через промежуточную таблицу.
     */
    public function parents()
    {
        return $this->belongsToMany(Folder::class, 'folder_relations', 'child_id', 'parent_id');
    }

    /**
     * Связь с дочерними папками через промежуточную таблицу.
     */
    public function children()
    {
        return $this->belongsToMany(Folder::class, 'folder_relations', 'parent_id', 'child_id');
    }

    /**
     * Обратная связь с моделью User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
