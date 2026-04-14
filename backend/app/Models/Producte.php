<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producte extends Model
{
    protected $table = 'productes';

    protected $fillable = [
        'nom',
        'unitat_mesura',
        'estoc_actual',
        'estoc_minim',
    ];

    public function liniesAlbaran()
    {
        return $this->hasMany(LiniaAlbaran::class, 'producte_id');
    }

    public function liniesRecepta()
    {
        return $this->hasMany(LiniaRecepta::class, 'producte_id');
    }

    public function moviments()
    {
        return $this->hasMany(MovimentStock::class, 'producte_id');
    }
}
