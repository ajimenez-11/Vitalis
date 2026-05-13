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
            'numero_lot' => 'ARR-2026-001',
            'quantitat' => 50.000,
            'data_caducitat' => '2027-06-01',
        ]);

        Lot::create([
            'linia_albaran_id' => 2,
            'numero_lot' => 'POL-2026-001',
            'quantitat' => 30.000,
            'data_caducitat' => '2026-07-15',
        ]);

        Lot::create([
            'linia_albaran_id' => 3,
            'numero_lot' => 'VED-2026-001',
            'quantitat' => 20.000,
            'data_caducitat' => '2026-07-20',
        ]);

        Lot::create([
            'linia_albaran_id' => 4,
            'numero_lot' => 'PAT-2026-001',
            'quantitat' => 40.000,
            'data_caducitat' => '2026-09-01',
        ]);

        Lot::create([
            'linia_albaran_id' => 5,
            'numero_lot' => 'PEX-2026-001',
            'quantitat' => 20.000,
            'data_caducitat' => '2026-07-05',
        ]);

        Lot::create([
            'linia_albaran_id' => 6,
            'numero_lot' => 'GAM-2026-001',
            'quantitat' => 15.000,
            'data_caducitat' => '2026-07-03',
        ]);

        Lot::create([
            'linia_albaran_id' => 7,
            'numero_lot' => 'TOM-2026-001',
            'quantitat' => 60.000,
            'data_caducitat' => '2026-08-01',
        ]);

        Lot::create([
            'linia_albaran_id' => 8,
            'numero_lot' => 'CEB-2026-001',
            'quantitat' => 40.000,
            'data_caducitat' => '2026-08-15',
        ]);

        Lot::create([
            'linia_albaran_id' => 9,
            'numero_lot' => 'ENC-2026-001',
            'quantitat' => 50.000,
            'data_caducitat' => '2026-07-20',
        ]);

        Lot::create([
            'linia_albaran_id' => 10,
            'numero_lot' => 'OLI-2026-001',
            'quantitat' => 30.000,
            'data_caducitat' => '2027-12-31',
        ]);

        Lot::create([
            'linia_albaran_id' => 11,
            'numero_lot' => 'LLT-2026-001',
            'quantitat' => 40.000,
            'data_caducitat' => '2026-08-10',
        ]);

        Lot::create([
            'linia_albaran_id' => 12,
            'numero_lot' => 'OUS-2026-001',
            'quantitat' => 60.000,
            'data_caducitat' => '2026-08-20',
        ]);

        Lot::create([
            'linia_albaran_id' => 13,
            'numero_lot' => 'FOR-2026-001',
            'quantitat' => 10.000,
            'data_caducitat' => '2026-09-15',
        ]);

        Lot::create([
            'linia_albaran_id' => 14,
            'numero_lot' => 'FAR-2026-001',
            'quantitat' => 50.000,
            'data_caducitat' => '2027-06-01',
        ]);

        Lot::create([
            'linia_albaran_id' => 15,
            'numero_lot' => 'VIN-2026-001',
            'quantitat' => 25.000,
            'data_caducitat' => '2027-06-01',
        ]);

        Lot::create([
            'linia_albaran_id' => 16,
            'numero_lot' => 'PAS-2026-001',
            'quantitat' => 20.000,
            'data_caducitat' => '2027-03-01',
        ]);

        Lot::create([
            'linia_albaran_id' => 17,
            'numero_lot' => 'SAL-2026-001',
            'quantitat' => 20.000,
            'data_caducitat' => '2028-01-01',
        ]);

        Lot::create([
            'linia_albaran_id' => 18,
            'numero_lot' => 'SUC-2026-001',
            'quantitat' => 12.000,
            'data_caducitat' => '2027-12-31',
        ]);

        Lot::create([
            'linia_albaran_id' => 19,
            'numero_lot' => 'MAN-2026-001',
            'quantitat' => 10.000,
            'data_caducitat' => '2026-08-01',
        ]);
    }
}