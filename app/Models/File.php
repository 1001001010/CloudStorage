<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class File extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'path',
        'extension_id',
        'mime_type_id',
        'file_hash',
        'folder_id',
        'user_id',
        'size',
    ];

    protected $dates = ['deleted_at'];

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

    /**
     * Связь с моделью FileExtension
     */
    public function extension()
    {
        return $this->belongsTo(FileExtension::class, 'extension_id');
    }

    /**
     * Связь с моделью MimeType
     */
    public function mimeType()
    {
        return $this->belongsTo(MimeType::class, 'mime_type_id');
    }

    /**
     * Связь с моделью FileAccessToken
     */
    public function accessTokens()
    {
        return $this->hasMany(FileAccessToken::class);
    }

}
