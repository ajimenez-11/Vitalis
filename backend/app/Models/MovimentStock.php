<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovimentStock extends Model
{
    protected $table = 'moviments_stock';

    protected $fillable = [
        'producte_id',
        'lot_id',
        'usuari_id',
        'recepta_consum_id',
        'tipus',
        'quantitat',
        'data',
        'observacions',
    ];

    public function producte()
    {
        return $this->belongsTo(Producte::class, 'producte_id');
    }

    public function lot()
    {
        return $this->belongsTo(Lot::class, 'lot_id');
    }

    public function usuari()
    {
        return $this->belongsTo(User::class, 'usuari_id');
    }

    public function receptaConsum()
    {
        return $this->belongsTo(ReceptaConsum::class, 'recepta_consum_id');
    }


}
