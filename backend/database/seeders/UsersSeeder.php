<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        User::insert([
            [
                'nom' => 'Administrador',
                'email' => 'admin@vitalis.com',
                'password' => Hash::make('password'),
                'rol' => 'admin',
                'actiu' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Cap de Cuina',
                'email' => 'capcuina@vitalis.com',
                'password' => Hash::make('password'),
                'rol' => 'responsable_cuina',
                'actiu' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Cuiner',
                'email' => 'cuiner@vitalis.com',
                'password' => Hash::make('password'),
                'rol' => 'cuiner',
                'actiu' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}