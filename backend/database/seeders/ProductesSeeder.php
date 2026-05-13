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
            'estoc_actual' => 0,
            'estoc_minim' => 10,
        ]);

        Producte::create([
            'nom' => 'Pollastre',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 8,
        ]);

        Producte::create([
            'nom' => 'Vedella',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 6,
        ]);

        Producte::create([
            'nom' => 'Tomàquet',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 15,
        ]);

        Producte::create([
            'nom' => 'Ceba',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 12,
        ]);

        Producte::create([
            'nom' => 'Oli',
            'unitat_mesura' => 'l',
            'estoc_actual' => 0,
            'estoc_minim' => 10,
        ]);

        Producte::create([
            'nom' => 'Farina',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 14,
        ]);

        Producte::create([
            'nom' => 'Llet',
            'unitat_mesura' => 'l',
            'estoc_actual' => 0,
            'estoc_minim' => 12,
        ]);

        Producte::create([
            'nom' => 'Ous',
            'unitat_mesura' => 'unitats',
            'estoc_actual' => 0,
            'estoc_minim' => 24,
        ]);

        Producte::create([
            'nom' => 'Sal',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 5,
        ]);

        Producte::create([
            'nom' => 'Pebre negre',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 5,
        ]);

        Producte::create([
            'nom' => 'Mantega',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 8,
        ]);

        Producte::create([
            'nom' => 'Patata',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 15,
        ]);

        Producte::create([
            'nom' => 'Enciam',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 8,
        ]);
        // ID 15
        Producte::create([
            'nom' => 'Peix espasa',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 5,
        ]);

        Producte::create([
            'nom' => 'Gambes',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 4,
        ]);

        Producte::create([
            'nom' => 'Pasta',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 10,
        ]);

        Producte::create([
            'nom' => 'Formatge',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 3,
        ]);

        Producte::create([
            'nom' => 'Vinagre',
            'unitat_mesura' => 'l',
            'estoc_actual' => 0,
            'estoc_minim' => 3,
        ]);

        Producte::create([
            'nom' => 'Sucre',
            'unitat_mesura' => 'kg',
            'estoc_actual' => 0,
            'estoc_minim' => 5,
        ]);
    }
}