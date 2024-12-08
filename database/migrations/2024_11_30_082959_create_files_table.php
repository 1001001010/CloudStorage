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
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string('name', 40);
            $table->string('path', 50);
            $table->unsignedBigInteger('extension_id');
            $table->unsignedBigInteger('mime_type_id')->nullable();
            $table->string('file_hash', 64)->nullable();
            $table->unsignedBigInteger('folder_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->bigInteger('size');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('extension_id')->references('id')->on('file_extensions')->onDelete('restrict');
            $table->foreign('mime_type_id')->references('id')->on('mime_types')->onDelete('set null');
            $table->foreign('folder_id')->references('id')->on('folders')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->index('folder_id');
            $table->index('user_id');
            $table->index('extension_id');
            $table->index('mime_type_id');

            $table->unique(['file_hash', 'user_id']);
        });

    }

    /**
     * Откат миграции
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};


