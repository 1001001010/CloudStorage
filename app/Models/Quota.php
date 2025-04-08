<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quota extends Model
{
    protected $fillable = ['size'];

    /**
     * Связь с моделью User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users() : HasMany
    {
        return $this->hasMany(User::class);
    }
}
