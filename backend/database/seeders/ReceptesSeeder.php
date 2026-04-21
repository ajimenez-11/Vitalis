<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Recepta;

class ReceptesSeeder extends Seeder
{
    public function run(): void
        {
        Recepta::create([
            'usuari_id' => 1,
            'nom' => 'Paella mixta',
            'descripcio' => 'Arròs amb carn i peix',
            'porcions_base' => 10,
        ]);

        Recepta::create([
            'usuari_id' => 1,
            'nom' => 'Pasta boloñesa',
            'descripcio' => 'Pasta amb salsa de carn',
            'porcions_base' => 8,
        ]);

        Recepta::create([
            'usuari_id' => 1,
            'nom' => 'Amanida mediterrània',
            'descripcio' => 'Amanida fresca variada',
            'porcions_base' => 6,
        ]);
    }
}