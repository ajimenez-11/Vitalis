<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Albaran extends Model
{
    protected $table = 'albarans';

    protected $fillable = [
        'proveidor_id',
        'usuari_id',
        'data',
        'estat',
        'observacions',
    ];

    public function proveidor()
    {
        return $this->belongsTo(Proveidor::class, 'proveidor_id');
    }

    public function usuari()
    {
        return $this->belongsTo(User::class, 'usuari_id');
    }

    public function linies()
    {
        return $this->hasMany(LiniaAlbaran::class, 'albaran_id');
    }
}
