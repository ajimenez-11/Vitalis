<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UsersSeeder::class,
            ProveidorsSeeder::class,
            ProductesSeeder::class,
            ReceptesSeeder::class,
            LiniaReceptaSeeder::class,
            AlbaransSeeder::class,
            LiniaAlbaranSeeder::class,
            LotsSeeder::class,
        ]);
    }
}
