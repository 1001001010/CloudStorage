<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileUserAccess extends Model
{
    use HasFactory;

    protected $fillable = [
        'file_access_token_id',
        'user_id',
    ];

    /**
     * Связь с моделью User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Связь с моделью FileAccessToken
     */
    public function accessToken()
    {
        return $this->belongsTo(FileAccessToken::class, 'file_access_token_id');
    }
}
