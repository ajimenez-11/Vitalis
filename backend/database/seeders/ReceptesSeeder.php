<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Recepta;

class ReceptesSeeder extends Seeder
{
    public function run(): void
    {
        Recepta::create([
            'usuari_id' => 1,
            'nom' => 'Paella mixta',
            'descripcio' => 'Arròs amb carn i peix',
            'porcions_base' => 10,
            'created_at' => '2026-05-01'
        ]);

        Recepta::create([
            'usuari_id' => 1,
            'nom' => 'Pasta boloñesa',
            'descripcio' => 'Pasta amb salsa de carn',
            'porcions_base' => 8,
            'created_at' => '2026-05-10'
        ]);

        Recepta::create([
            'usuari_id' => 1,
            'nom' => 'Amanida mediterrània',
            'descripcio' => 'Amanida fresca variada',
            'porcions_base' => 6,
            'created_at' => '2026-05-15'
        ]);

        Recepta::create([
            'usuari_id' => 2,
            'nom' => 'Croquetes de vedella',
            'descripcio' => 'Croquetes casolanes de vedella',
            'porcions_base' => 20,
            'created_at' => '2026-05-20'
        ]);

        Recepta::create([
            'usuari_id' => 2,
            'nom' => 'Truita de patates',
            'descripcio' => 'Truita clàssica amb ceba',
            'porcions_base' => 6,
            'created_at' => '2026-06-01'
        ]);

        Recepta::create([
            'usuari_id' => 1,
            'nom' => 'Peix espasa a la planxa',
            'descripcio' => 'Peix espasa amb guarnició',
            'porcions_base' => 4,
            'created_at' => '2026-06-10'
        ]);

        Recepta::create([
            'usuari_id' => 2,
            'nom' => 'Arròs negre',
            'descripcio' => 'Arròs amb tinta de calamar i gambes',
            'porcions_base' => 8,
            'created_at' => '2026-06-15'
        ]);
        
    }
}