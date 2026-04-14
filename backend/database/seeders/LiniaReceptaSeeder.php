<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LiniaRecepta;
use App\Models\Recepta;
use App\Models\Producte;

class LiniaReceptaSeeder extends Seeder
{
    public function run(): void
    {
        $paella = Recepta::where('nom', 'Paella mixta')->first();
        $pasta = Recepta::where('nom', 'Pasta boloñesa')->first();
        $amanida = Recepta::where('nom', 'Amanida mediterrània')->first();

        $arròs = Producte::where('nom', 'Arròs')->first();
        $pollastre = Producte::where('nom', 'Pollastre')->first();
        $vedella = Producte::where('nom', 'Vedella')->first();
        $tomàquet = Producte::where('nom', 'Tomàquet')->first();
        $oli = Producte::where('nom', 'Oli')->first();

        // Paella
        LiniaRecepta::create([
            'recepta_id' => $paella->id,
            'producte_id' => $arròs->id,
            'quantitat_per_porcio' => 0.1
        ]);
        LiniaRecepta::create([
            'recepta_id' => $paella->id,
            'producte_id' => $pollastre->id,
            'quantitat_per_porcio' => 0.12
        ]);

        // Pasta
        LiniaRecepta::create([
            'recepta_id' => $pasta->id,
            'producte_id' => $vedella->id,
            'quantitat_per_porcio' => 0.15
        ]);
        LiniaRecepta::create([
            'recepta_id' => $pasta->id,
            'producte_id' => $tomàquet->id,
            'quantitat_per_porcio' => 0.1
        ]);

        // Amanida
        LiniaRecepta::create([
            'recepta_id' => $amanida->id,
            'producte_id' => $tomàquet->id,
            'quantitat_per_porcio' => 0.2
        ]);
        LiniaRecepta::create([
            'recepta_id' => $amanida->id,
            'producte_id' => $oli->id,
            'quantitat_per_porcio' => 0.02
        ]);
    }
}