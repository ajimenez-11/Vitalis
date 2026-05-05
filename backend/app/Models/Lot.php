<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lot extends Model
{
    protected $table = 'lots';

    protected $fillable = [
        'linia_albaran_id',
        'numero_lot',
        'quantitat',
        'data_caducitat',
    ];

    public function liniaAlbaran()
    {
        return $this->belongsTo(LiniaAlbaran::class, 'linia_albaran_id');
    }

    public function moviments()
    {
        return $this->hasMany(MovimentStock::class, 'lot_id');
    }
}
