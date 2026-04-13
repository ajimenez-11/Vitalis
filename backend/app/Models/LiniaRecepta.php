<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiniaRecepta extends Model
{
    protected $table = 'linies_recepta';

    protected $fillable = [
        'recepta_id',
        'producte_id',
        'quantitat_per_porcio',
        'temperatura_coccio',
    ];

    public function recepta()
    {
        return $this->belongsTo(Recepta::class, 'recepta_id');
    }

    public function producte()
    {
        return $this->belongsTo(Producte::class, 'producte_id');
    }
}
