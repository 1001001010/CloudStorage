<?php

namespace App\Models;

use Illuminate\Database\Eloquent\{
    Model,
    Factories\HasFactory
};

class MimeType extends Model
{
    use HasFactory;

    /**
     * Атрибуты, которые могут быть массово присвоены
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'mime_type',
    ];

    /**
     * Связь с моделью File
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function files()
    {
        return $this->hasMany(File::class, 'mime_type_id');
    }
}
