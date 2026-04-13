<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceptaConsum extends Model
{
    protected $table = 'recepta_consums';

    protected $fillable = [
        'recepta_id',
        'usuari_id',
        'porcions',
        'data',
        'observacions',
    ];

    public function recepta()
    {
        return $this->belongsTo(Recepta::class, 'recepta_id');
    }

    public function usuari()
    {
        return $this->belongsTo(User::class, 'usuari_id');
    }

    public function moviments()
    {
        return $this->hasMany(MovimentStock::class, 'recepta_consum_id');
    }
}
