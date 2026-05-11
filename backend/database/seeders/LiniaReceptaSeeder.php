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
        $croquetes = Recepta::where('nom', 'Croquetes de vedella')->first();
        $truita = Recepta::where('nom', 'Truita de patates')->first();
        $peix = Recepta::where('nom', 'Peix espasa a la planxa')->first();
        $arrosNegre = Recepta::where('nom', 'Arròs negre')->first();

        $arros = Producte::where('nom', 'Arròs')->first();
        $pollastre = Producte::where('nom', 'Pollastre')->first();
        $vedella = Producte::where('nom', 'Vedella')->first();
        $tomaquet = Producte::where('nom', 'Tomàquet')->first();
        $oli = Producte::where('nom', 'Oli')->first();
        $ceba = Producte::where('nom', 'Ceba')->first();
        $farina = Producte::where('nom', 'Farina')->first();
        $llet = Producte::where('nom', 'Llet')->first();
        $ous = Producte::where('nom', 'Ous')->first();
        $patata = Producte::where('nom', 'Patata')->first();
        $peixEspasa = Producte::where('nom', 'Peix espasa')->first();
        $gambes = Producte::where('nom', 'Gambes')->first();
        $enciam = Producte::where('nom', 'Enciam')->first();
        $formatge = Producte::where('nom', 'Formatge')->first();
        $pasta_p = Producte::where('nom', 'Pasta')->first();
        $vinagre = Producte::where('nom', 'Vinagre')->first();

        // Paella mixta
        LiniaRecepta::create([
            'recepta_id' => $paella->id,
            'producte_id' => $arros->id,
            'quantitat_per_porcio' => 0.100,
            'temperatura_coccio' => 100
        ]);
        
        LiniaRecepta::create([
            'recepta_id' => $paella->id,
            'producte_id' => $pollastre->id,
            'quantitat_per_porcio' => 0.120,
            'temperatura_coccio' => 180
        ]);

        LiniaRecepta::create([
            'recepta_id' => $paella->id,
            'producte_id' => $gambes->id,
            'quantitat_per_porcio' => 0.080
        ]);

        LiniaRecepta::create([
            'recepta_id' => $paella->id,
            'producte_id' => $oli->id,
            'quantitat_per_porcio' => 0.020
        ]);

        // Pasta boloñesa
        LiniaRecepta::create([
            'recepta_id' => $pasta->id,
            'producte_id' => $pasta_p->id,
            'quantitat_per_porcio' => 0.120
        ]);

        LiniaRecepta::create([
            'recepta_id' => $pasta->id,
            'producte_id' => $vedella->id,
            'quantitat_per_porcio' => 0.150,
            'temperatura_coccio' => 160
        ]);

        LiniaRecepta::create([
            'recepta_id' => $pasta->id,
            'producte_id' => $tomaquet->id,
            'quantitat_per_porcio' => 0.100
        ]);

        LiniaRecepta::create([
            'recepta_id' => $pasta->id,
            'producte_id' => $ceba->id,
            'quantitat_per_porcio' => 0.050
        ]);

        // Amanida mediterrània
        LiniaRecepta::create([
            'recepta_id' => $amanida->id,
            'producte_id' => $enciam->id,
            'quantitat_per_porcio' => 0.100
        ]);

        LiniaRecepta::create([
            'recepta_id' => $amanida->id,
            'producte_id' => $tomaquet->id,
            'quantitat_per_porcio' => 0.200
        ]);

        LiniaRecepta::create([
            'recepta_id' => $amanida->id,
            'producte_id' => $oli->id,
            'quantitat_per_porcio' => 0.020
        ]);

        LiniaRecepta::create([
            'recepta_id' => $amanida->id,
            'producte_id' => $vinagre->id,
            'quantitat_per_porcio' => 0.010
        ]);

        LiniaRecepta::create([
            'recepta_id' => $amanida->id,
            'producte_id' => $formatge->id,
            'quantitat_per_porcio' => 0.050
        ]);

        // Croquetes de vedella
        LiniaRecepta::create([
            'recepta_id' => $croquetes->id,
            'producte_id' => $vedella->id,
            'quantitat_per_porcio' => 0.080,
            'temperatura_coccio' => 180
        ]);

        LiniaRecepta::create([
            'recepta_id' => $croquetes->id,
            'producte_id' => $farina->id,
            'quantitat_per_porcio' => 0.040
        ]);

        LiniaRecepta::create([
            'recepta_id' => $croquetes->id,
            'producte_id' => $llet->id,
            'quantitat_per_porcio' => 0.060
        ]);

        LiniaRecepta::create([
            'recepta_id' => $croquetes->id,
            'producte_id' => $ous->id,
            'quantitat_per_porcio' => 0.500
        ]);

        // Truita de patates
        LiniaRecepta::create([
            'recepta_id' => $truita->id,
            'producte_id' => $patata->id,
            'quantitat_per_porcio' => 0.200
        ]);

        LiniaRecepta::create([
            'recepta_id' => $truita->id,
            'producte_id' => $ous->id,
            'quantitat_per_porcio' => 1.000
        ]);

        LiniaRecepta::create([
            'recepta_id' => $truita->id,
            'producte_id' => $ceba->id,
            'quantitat_per_porcio' => 0.080
        ]);

        LiniaRecepta::create([
            'recepta_id' => $truita->id,
            'producte_id' => $oli->id,
            'quantitat_per_porcio' => 0.030
        ]);

        // Peix espasa a la planxa
        LiniaRecepta::create([
            'recepta_id' => $peix->id,
            'producte_id' => $peixEspasa->id,
            'quantitat_per_porcio' => 0.250,
            'temperatura_coccio' => 200
        ]);

        LiniaRecepta::create([
            'recepta_id' => $peix->id,
            'producte_id' => $oli->id,
            'quantitat_per_porcio' => 0.020
        ]);

        LiniaRecepta::create([
            'recepta_id' => $peix->id,
            'producte_id' => $patata->id,
            'quantitat_per_porcio' => 0.150
        ]);

        // Arròs negre
        LiniaRecepta::create([
            'recepta_id' => $arrosNegre->id,
            'producte_id' => $arros->id,
            'quantitat_per_porcio' => 0.100,
            'temperatura_coccio' => 100
        ]);

        LiniaRecepta::create([
            'recepta_id' => $arrosNegre->id,
            'producte_id' => $gambes->id,
            'quantitat_per_porcio' => 0.100
        ]);

        LiniaRecepta::create([
            'recepta_id' => $arrosNegre->id,
            'producte_id' => $oli->id,
            'quantitat_per_porcio' => 0.020
        ]);

        LiniaRecepta::create([
            'recepta_id' => $arrosNegre->id,
            'producte_id' => $ceba->id,
            'quantitat_per_porcio' => 0.060
        ]);
    }
}