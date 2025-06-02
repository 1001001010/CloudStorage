<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Запуск миграции
     *
     */
    public function up(): void
    {
        Schema::create('quotas', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('size')->unique();
            $table->timestamps();
        });

        DB::table('quotas')->insert([
            'size' => 2048,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Откат миграций
     *
     */
    public function down(): void
    {
        Schema::dropIfExists('quotas');
    }
};