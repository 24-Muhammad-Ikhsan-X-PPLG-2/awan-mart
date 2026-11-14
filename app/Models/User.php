<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

enum UserRole: string
{
    case Admin = 'admin';
    case Pelanggan = 'pelanggan';
    case Supplier = 'supplier';
}

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $phone
 * @property string $address
 * @property UserRole $role
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Pelanggan|null $pelanggan
 * @property-read Admin|null $admin
 * @property-read Supplier|null $supplier
 */
#[Fillable([
    'name',
    'email',
    'phone',
    'address',
    'role',
    'password',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

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
            'role' => UserRole::class,
        ];
    }

    /** @return HasMany<Product, $this> */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /** @return HasMany<Order, $this> */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /** @return HasOne<Cart, $this> */
    public function cart(): HasOne
    {
        return $this->hasOne(Cart::class);
    }

    /** @return HasOne<Pelanggan, $this> */
    public function pelanggan(): HasOne
    {
        return $this->hasOne(Pelanggan::class);
    }

    /** @return HasOne<Admin, $this> */
    public function admin(): HasOne
    {
        return $this->hasOne(Admin::class);
    }

    /** @return HasOne<Supplier, $this> */
    public function supplier(): HasOne
    {
        return $this->hasOne(Supplier::class);
    }
}
