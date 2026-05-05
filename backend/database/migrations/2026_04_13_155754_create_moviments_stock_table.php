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
        Schema::create('moviments_stock', function (Blueprint $table) {
            $table->id();
            
            // fk cap a productes
            $table->unsignedBigInteger('producte_id');
            $table->foreign('producte_id')
                ->references('id')
                ->on('productes')
                ->onDelete('restrict');
            
            // fk cap a lots (opcional)
            $table->unsignedBigInteger('lot_id')->nullable();
            $table->foreign('lot_id')
                ->references('id')
                ->on('lots')
                ->onDelete('set null');
            
            // fk cap a users
            $table->unsignedBigInteger('usuari_id');
            $table->foreign('usuari_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');
            
            // fk cap a recepta_consums (opcional)
            $table->unsignedBigInteger('recepta_consum_id')->nullable();
            $table->foreign('recepta_consum_id')
                ->references('id')
                ->on('recepta_consums')
                ->onDelete('set null');
            
            $table->enum('tipus', ['entrada', 'sortida', 'ajust']);
            $table->decimal('quantitat', 10, 3);
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
        Schema::dropIfExists('moviments_stock');
    }
};
