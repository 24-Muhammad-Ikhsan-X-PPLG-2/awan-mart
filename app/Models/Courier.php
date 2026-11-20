<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Override;

/**
 * @property int $id
 * @property int $supplier_id
 * @property string $name
 * @property int $shipping_cost
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['supplier_id', 'name', 'shipping_cost', 'is_active'])]
class Courier extends Model
{
    protected $table = 'couriers';

    #[Override]
    protected function casts(): array
    {
        return [
            'shipping_cost' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /** @return BelongsTo<Supplier, $this> */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /** @return HasMany<Order, $this> */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
