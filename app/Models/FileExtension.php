<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileExtension extends Model
{
    protected $fillable = [
        'extension',
    ];

    public function files()
    {
        return $this->hasMany(File::class, 'extension_id');
    }
}
