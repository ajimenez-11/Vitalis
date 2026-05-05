<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('proveidors', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('nif')->nullable()->unique();
            $table->string('telefon')->nullable();
            $table->string('email')->nullable();
            $table->string('adreca')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proveidors');
    }
};
