<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('file_public_accesses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('file_access_token_id');
            $table->string('ip_address', 45); // IPv4 и IPv6
            $table->string('user_agent')->nullable();
            $table->unsignedBigInteger('user_id')->nullable(); // Если пользователь авторизован
            $table->timestamps();

            $table->foreign('file_access_token_id')->references('id')->on('file_access_tokens')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_public_accesses');
    }
};