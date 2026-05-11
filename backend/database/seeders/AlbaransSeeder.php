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
            'observacions' => 'Albarà de prova',
        ]);
        
        Albaran::create([
            'proveidor_id' => 1,
            'usuari_id' => 1,
            'data' => '2026-06-15',
            'estat' => 'esborrany',
            'observacions' => 'Albarà de prova',
        ]);

        Albaran::create([
            'proveidor_id' => 1,
            'usuari_id' => 1,
            'data' => '2026-07-03',
            'estat' => 'esborrany',
            'observacions' => 'Albarà de prova',
        ]);

        Albaran::create([
            'proveidor_id' => 2,
            'usuari_id' => 1,
            'data' => '2026-07-08',
            'estat' => 'esborrany',
            'observacions' => 'Albarà pendent de revisió',
        ]);

        Albaran::create([
            'proveidor_id' => 2,
            'usuari_id' => 2,
            'data' => '2026-07-10',
            'estat' => 'esborrany',
            'observacions' => 'Albarà pendent de confirmar',
        ]);

        Albaran::create([
            'proveidor_id' => 3,
            'usuari_id' => 2,
            'data' => '2026-07-12',
            'estat' => 'esborrany',
            'observacions' => 'Albarà en procés de validació',
        ]);
    }
}