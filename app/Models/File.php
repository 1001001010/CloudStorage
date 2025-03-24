<?php

namespace App\Models;

use Illuminate\Database\Eloquent\{
    Model,
    SoftDeletes,
    Factories\HasFactory
};

class File extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Атрибуты, которые могут быть массово присвоены
     *
     * @var array<int, string>
     */
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
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function folder()
    {
        return $this->belongsTo(Folder::class);
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
     * Связь с моделью FileExtension
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function extension()
    {
        return $this->belongsTo(FileExtension::class, 'extension_id');
    }

    /**
     * Связь с моделью MimeType
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mimeType()
    {
        return $this->belongsTo(MimeType::class, 'mime_type_id');
    }

    /**
     * Связь с моделью FileAccessToken
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function accessTokens()
    {
        return $this->hasMany(FileAccessToken::class);
    }
}
