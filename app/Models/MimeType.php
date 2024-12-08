<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MimeType extends Model
{
    protected $fillable = [
        'mime_type',
    ];

    /**
     * Связь с моделью File
     */
    public function files()
    {
        return $this->hasMany(File::class, 'mime_type_id');
    }
}
