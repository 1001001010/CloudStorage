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
        Schema::create('file_user_accesses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('file_access_token_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('file_access_token_id')->references('id')->on('file_access_tokens')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['file_access_token_id', 'user_id']);
        });
    }

    /**
     * Откат миграций
     *
     */
    public function down(): void
    {
        Schema::dropIfExists('file_user_accesses');
    }
};
