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
            'data' => '2025-01-01',
            'estat' => 'esborrany',
            'observacions' => 'Albarà de prova',
        ]);

        Albaran::create([
            'proveidor_id' => 1,
            'usuari_id' => 1,
            'data' => '2025-01-02',
            'estat' => 'esborrany',
            'observacions' => 'Albarà de prova',
        ]);

        Albaran::create([
            'proveidor_id' => 1,
            'usuari_id' => 1,
            'data' => '2025-01-03',
            'estat' => 'esborrany',
            'observacions' => 'Albarà de prova',
        ]);
    }
}