<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Albaran;

class AlbaransSeeder extends Seeder
{
    public function run(): void
    {

        Albaran::create([
            'proveidor_id' => 1,
            'usuari_id' => 1,
            'data' => '2026-06-02',
            'estat' => 'esborrany',
            'observacions' => 'Comanda de carns i cereals',
        ]);

        Albaran::create([
            'proveidor_id' => 2,
            'usuari_id' => 1,
            'data' => '2026-06-15',
            'estat' => 'esborrany',
            'observacions' => 'Comanda de peix i marisc',
        ]);

        Albaran::create([
            'proveidor_id' => 3,
            'usuari_id' => 1,
            'data' => '2026-07-03',
            'estat' => 'esborrany',
            'observacions' => 'Comanda de verdures i hortalisses',
        ]);

        Albaran::create([
            'proveidor_id' => 4,
            'usuari_id' => 1,
            'data' => '2026-07-08',
            'estat' => 'esborrany',
            'observacions' => 'Comanda de làctics i ous',
        ]);

        Albaran::create([
            'proveidor_id' => 5,
            'usuari_id' => 2,
            'data' => '2026-07-10',
            'estat' => 'esborrany',
            'observacions' => 'Comanda de productes secs',
        ]);

        Albaran::create([
            'proveidor_id' => 5,
            'usuari_id' => 2,
            'data' => '2026-07-12',
            'estat' => 'esborrany',
            'observacions' => 'Comanda de condiments i greixos',
        ]);
    }
}