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
        Schema::create('receptes', function (Blueprint $table) {
            $table->id();

            // fk cap a users
            $table->unsignedBigInteger('usuari_id');
            $table->foreign('usuari_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');

            $table->string('nom');
            $table->text('descripcio')->nullable();
            $table->unsignedInteger('porcions_base')->default(1);
            $table->string('imatge')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receptes');
    }
};
