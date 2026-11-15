<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $alamat
 * @property string $telp
 */
#[Fillable(['user_id', 'alamat', 'name', 'telp'])]
class Admin extends Model
{
    protected $table = 'admin';

    public $timestamps = false;

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<Procurement, $this> */
    public function procurements(): HasMany
    {
        return $this->hasMany(Procurement::class);
    }
}
