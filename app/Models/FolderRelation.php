<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FolderRelation extends Model
{
    protected $fillable = ['parent_id', 'child_id'];

    /**
     * Связь с родительской папкой
     */
    public function parent()
    {
        return $this->belongsTo(Folder::class, 'parent_id');
    }

    /**
     * Связь с дочерней папкой
     */
    public function child()
    {
        return $this->belongsTo(Folder::class, 'child_id');
    }
}
