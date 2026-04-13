<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recepta extends Model
{
    protected $table = 'receptes';

    protected $fillable = [
        'usuari_id',
        'nom',
        'descripcio',
        'porcions_base',
    ];

    public function usuari()
    {
        return $this->belongsTo(User::class, 'usuari_id');
    }

    public function linies()
    {
        return $this->hasMany(LiniaRecepta::class, 'recepta_id');
    }

    public function consums()
    {
        return $this->hasMany(ReceptaConsum::class, 'recepta_id');
    }
}
