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
        Schema::create('linies_recepta', function (Blueprint $table) {
            $table->id();

             // fk cap a receptes
            $table->unsignedBigInteger('recepta_id');
            $table->foreign('recepta_id')
                ->references('id')
                ->on('receptes')
                ->onDelete('cascade');

            // fk cap a productes
            $table->unsignedBigInteger('producte_id');
            $table->foreign('producte_id')
                ->references('id')
                ->on('productes')
                ->onDelete('restrict');

            $table->decimal('quantitat_per_porcio', 10, 4);
            $table->decimal('temperatura_coccio', 5, 2)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('linies_recepta');
    }
};
