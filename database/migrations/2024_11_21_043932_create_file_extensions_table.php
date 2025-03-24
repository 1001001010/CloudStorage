<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Запуск миграции
     */
    public function up(): void
    {
        Schema::create('file_extensions', function (Blueprint $table) {
            $table->id();
            $table->string('extension', 10)->unique();
            $table->timestamps();
        });
    }

    /**
     * Откат миграции
     */
    public function down(): void
    {
        Schema::dropIfExists('file_extensions');
    }
};
