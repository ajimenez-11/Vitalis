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
        Schema::create('linies_albaran', function (Blueprint $table) {
            $table->id();

            // fk cap a albarans
            $table->unsignedBigInteger('albaran_id');
            $table->foreign('albaran_id')
                ->references('id')
                ->on('albarans')
                ->onDelete('cascade');


            // fk cap a productes
            $table->unsignedBigInteger('producte_id');
            $table->foreign('producte_id')
                ->references('id')
                ->on('productes')
                ->onDelete('restrict');

            $table->decimal('quantitat', 10, 3);
        
            $table->decimal('preu_unitari', 10, 4)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('linies_albaran');
    }
};
