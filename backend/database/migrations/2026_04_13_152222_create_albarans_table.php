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
        Schema::create('albarans', function (Blueprint $table) {
            $table->id();
            
            // fk cap a proveidors
            $table->unsignedBigInteger('proveidor_id');
            $table->foreign('proveidor_id')
                ->references('id')
                ->on('proveidors')
                ->onDelete('restrict');

            // fk cap a users
            $table->unsignedBigInteger('usuari_id');
            $table->foreign('usuari_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');

            $table->date('data');

            $table->enum('estat', ['esborrany', 'confirmat'])
            ->default('esborrany');
            
            $table->text('observacions')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('albarans');
    }
};
