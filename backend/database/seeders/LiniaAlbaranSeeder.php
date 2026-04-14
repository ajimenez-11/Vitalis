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
            'preu_unitari' => 1.20,
        ]);
        LiniaAlbaran::create([
            'albaran_id' => 1,
            'producte_id' => 2, 
            'quantitat' => 30,
            'preu_unitari' => 4.50,
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 2,
            'producte_id' => 3, 
            'quantitat' => 20,
            'preu_unitari' => 8.00,
        ]);
        LiniaAlbaran::create([
            'albaran_id' => 2,
            'producte_id' => 4,
            'quantitat' => 40,
            'preu_unitari' => 0.90,
        ]);

        LiniaAlbaran::create([
            'albaran_id' => 3,
            'producte_id' => 5,
            'quantitat' => 35,
            'preu_unitari' => 0.70,
        ]);
        LiniaAlbaran::create([
            'albaran_id' => 3,
            'producte_id' => 6, 
            'quantitat' => 15,
            'preu_unitari' => 3.50,
        ]);
    }
}