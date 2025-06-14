<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Запуск миграции
     *
     */
    public function up()
    {
        Schema::create('file_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('file_id');
            $table->string('access_token', 64)->unique();
            $table->unsignedInteger('user_limit')->default(1);
            $table->enum('access_type', ['authenticated_only', 'public'])->default('authenticated_only');
            $table->unsignedInteger('usage_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->foreign('file_id')->references('id')->on('files')->onDelete('cascade');
        });
    }

    /**
     * Откат миграций
     *
     */
    public function down(): void
    {
        Schema::dropIfExists('file_access_tokens');
    }
};