<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Заполнение базы данных начальными данными
     *
     */
    public function run(): void
    {
        User::factory(100)->create();
    }
}
