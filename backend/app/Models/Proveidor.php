<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proveidor extends Model
{
    
    protected $table = 'proveidors';

    protected $fillable = [
        'nom',
        'nif',
        'telefon',
        'email',
        'adreca',
    ];

    public function albarans()
    {
        return $this->hasMany(Albaran::class, 'proveidor_id');
    }
}
 