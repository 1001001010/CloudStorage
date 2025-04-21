<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Запуск миграции
     *
     */
    public function up(): void
    {
        Schema::create('mime_types', function (Blueprint $table) {
            $table->id();
            $table->string('mime_type', 255)->unique();
            $table->timestamps();
        });
    }

    /**
     * Откат миграций
     *
     */
    public function down(): void
    {
        Schema::dropIfExists('mime_types');
    }
};
