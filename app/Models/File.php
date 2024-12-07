<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = ['name', 'path', 'folder_id', 'user_id', 'size'];

    /**
     * Связь с моделью Folder
     */
    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }


    /**
     * Связь с моделью User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
