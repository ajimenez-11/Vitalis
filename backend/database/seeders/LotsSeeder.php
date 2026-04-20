<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Lot;

class LotsSeeder extends Seeder
{
    public function run(): void
    {
        Lot::create([
            'linia_albaran_id' => 1,
            'numero_lot' => 'ARR-1234',
            'data_caducitat' => '2025-03-01',
            'quantitat' => 50.000,
        ]);

        Lot::create([
            'linia_albaran_id' => 2,
            'numero_lot' => 'POL-5678',
            'data_caducitat' => '2025-03-15',
            'quantitat' => 100.000,
        ]);

        Lot::create([
            'linia_albaran_id' => 3,
            'numero_lot' => 'VED-9101',
            'data_caducitat' => '2025-02-20',
            'quantitat' => 30.500,
        ]);
    }
}