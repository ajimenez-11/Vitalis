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
        Schema::create('recepta_consums', function (Blueprint $table) {
            $table->id();

            // fk cap a receptes
            $table->unsignedBigInteger('recepta_id');
            $table->foreign('recepta_id')
                ->references('id')
                ->on('receptes')
                ->onDelete('restrict');

            // fk cap a users
            $table->unsignedBigInteger('usuari_id');
            $table->foreign('usuari_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');

            $table->unsignedInteger('porcions');
            $table->dateTime('data');
            $table->text('observacions')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recepta_consums');
    }
};
