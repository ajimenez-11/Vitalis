<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Producte;

class ProductesSeeder extends Seeder
{
    public function run(): void
    {
        Producte::create([
            'nom' => 'Arròs',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 80,
            'estoc_minim' => 10,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Producte::create([
            'nom' => 'Pollastre',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 45,
            'estoc_minim' => 8,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Producte::create([
            'nom' => 'Vedella',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 30,
            'estoc_minim' => 6,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Producte::create([
            'nom' => 'Tomàquet',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 120,
            'estoc_minim' => 15,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Producte::create([
            'nom' => 'Ceba',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 95,
            'estoc_minim' => 12,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Producte::create([
            'nom' => 'Oli',
            'unitat_mesura' => 'l',
            'estoc_actual' => 60,
            'estoc_minim' => 10,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Producte::create([
            'nom' => 'Farina',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 100,
            'estoc_minim' => 14,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Producte::create([
            'nom' => 'Llet',
            'unitat_mesura' => 'l',
            'estoc_actual' => 75,
            'estoc_minim' => 12,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Producte::create([
            'nom' => 'Ous',
            'unitat_mesura' => 'unitats',
            'estoc_actual' => 140,
            'estoc_minim' => 24,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Producte::create([
            'nom' => 'Sal',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 50,
            'estoc_minim' => 5,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}