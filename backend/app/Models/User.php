<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

     protected $fillable = [
        'nom',
        'email',
        'password',
        'rol',
        'actiu',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'actiu'     => 'boolean',
        ];
    }

    public function albarans()
    {
        return $this->hasMany(Albaran::class, 'usuari_id');
    }

    public function receptes()
    {
        return $this->hasMany(Recepta::class, 'usuari_id');
    }

    public function consums()
    {
        return $this->hasMany(ReceptaConsum::class, 'usuari_id');
    }

    public function moviments()
    {
        return $this->hasMany(MovimentStock::class, 'usuari_id');
    }
}
