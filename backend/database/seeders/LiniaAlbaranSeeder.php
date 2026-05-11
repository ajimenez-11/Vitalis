<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LiniaAlbaran;

class LiniaAlbaranSeeder extends Seeder
{
    public function run(): void
    {
        LiniaAlbaran::create([
            'albaran_id' => 1,
            'producte_id' => 1,
            'quantitat' => 50,
            'preu_unitari' => 1.20
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 1,
            'producte_id' => 2,
            'quantitat' => 30,
            'preu_unitari' => 4.50
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 1,
            'producte_id' => 3,
            'quantitat' => 20,
            'preu_unitari' => 8.00
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 1,
            'producte_id' => 13,
            'quantitat' => 40,
            'preu_unitari' => 1.80
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 2,
            'producte_id' => 15,
            'quantitat' => 20,
            'preu_unitari' => 12.00
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 2,
            'producte_id' => 16,
            'quantitat' => 15,
            'preu_unitari' => 18.00
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 3,
            'producte_id' => 4,
            'quantitat' => 60,
            'preu_unitari' => 1.50
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 3,
            'producte_id' => 5,
            'quantitat' => 40,
            'preu_unitari' => 0.90
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 3,
            'producte_id' => 14,
            'quantitat' => 50,
            'preu_unitari' => 0.60
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 3,
            'producte_id' => 6,
            'quantitat' => 30,
            'preu_unitari' => 3.50
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 4,
            'producte_id' => 8,
            'quantitat' => 40,
            'preu_unitari' => 0.95
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 4,
            'producte_id' => 9,
            'quantitat' => 60,
            'preu_unitari' => 0.25
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 4,
            'producte_id' => 18,
            'quantitat' => 10,
            'preu_unitari' => 6.00
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 5,
            'producte_id' => 7,
            'quantitat' => 50,
            'preu_unitari' => 0.80
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 5,
            'producte_id' => 19,
            'quantitat' => 25,
            'preu_unitari' => 1.10
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 5,
            'producte_id' => 17,
            'quantitat' => 20,
            'preu_unitari' => 2.00
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 6,
            'producte_id' => 10,
            'quantitat' => 20,
            'preu_unitari' => 0.50
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 6,
            'producte_id' => 20,
            'quantitat' => 12,
            'preu_unitari' => 2.50
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 6,
            'producte_id' => 12,
            'quantitat' => 10,
            'preu_unitari' => 7.00
        ]);
    }
}