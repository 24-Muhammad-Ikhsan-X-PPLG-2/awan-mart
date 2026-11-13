<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Override;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property array|null $alamat
 * @property string|null $telp
 */
#[Fillable(['alamat', 'user_id', 'name', 'telp'])]
class Pelanggan extends Model
{
    protected $table = 'pelanggan';
    public $timestamps = false;

    #[Override]
    protected function casts()
    {
        return [
            'alamat' => 'array'
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
