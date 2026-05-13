<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Proveidor;

class ProveidorsSeeder extends Seeder
{
    public function run(): void
    {
        Proveidor::create([
            'nom' => 'Carns i Grans Miquel SL',
            'nif' => 'B12345678',
            'telefon' => '646372819',
            'adreca' => 'Barcelona',
            'email' => 'carnsmiquelsl@mail.com',
        ]);

        Proveidor::create([
            'nom' => 'Peixos Costa Brava',
            'nif' => 'B23456789',
            'telefon' => '683928736',
            'adreca' => 'Girona',
            'email' => 'peixoscostabrava@mail.com',
        ]);

        Proveidor::create([
            'nom' => 'Fruites del Camp',
            'nif' => 'B34637271',
            'telefon' => '674225637',
            'adreca' => 'Barcelona',
            'email' => 'fruitesdelcamp@mail.com',
        ]);

        Proveidor::create([
            'nom' => 'Làctics Can Puig',
            'nif' => 'B34567890',
            'telefon' => '690289736',
            'adreca' => 'Barcelona',
            'email' => 'lacticsscanpuig@mail.com',
        ]);

        Proveidor::create([
            'nom' => 'Distribuïdora Secs i Condiments',
            'nif' => 'B45678901',
            'telefon' => '611233445',
            'adreca' => 'Barcelona',
            'email' => 'secsicondiments@mail.com',
        ]);
    }
}