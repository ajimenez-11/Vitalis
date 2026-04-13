<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiniaAlbaran extends Model
{
    protected $table = 'linies_albaran';

    protected $fillable = [
        'albaran_id',
        'producte_id',
        'quantitat',
        'preu_unitari',
    ];

    public function albaran()
    {
        return $this->belongsTo(Albaran::class, 'albaran_id');
    }

    public function producte()
    {
        return $this->belongsTo(Producte::class, 'producte_id');
    }

    public function lots()
    {
        return $this->hasMany(Lot::class, 'linia_albaran_id');
    }

}
