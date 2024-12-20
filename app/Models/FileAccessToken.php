<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileAccessToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'file_id',
        'access_token',
        'user_limit',
    ];

    /**
     * Связь с моделью File
     */
    public function file()
    {
        return $this->belongsTo(File::class);
    }

    /**
     * Связь с моделью FileUserAccess
     */
    public function usersWithAccess()
    {
        return $this->hasMany(FileUserAccess::class);
    }

    public function canAddUser()
    {
        return $this->usersWithAccess()->count() < $this->user_limit;
    }
}
