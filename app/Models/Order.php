<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;
use Override;

/**
 * @property int $id
 * @property string $order_number
 * @property int $user_id
 * @property string $total_price
 * @property string $shipping_address
 * @property int|null $courier_id
 * @property string|null $courier_name
 * @property string $shipping_cost
 * @property Carbon|null $shipped_at
 * @property Carbon|null $completed_at
 * @property OrderStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'order_number',
    'user_id',
    'total_price',
    'shipping_address',
    'status',
    'courier_id',
    'courier_name',
    'shipping_cost',
    'shipped_at',
    'completed_at',
])]
class Order extends Model
{
    protected $table = 'orders';

    #[Override]
    protected function casts(): array
    {
        return [
            'total_price' => 'decimal:2',
            'status' => OrderStatus::class,
            'shipping_cost' => 'integer',
            'shipped_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<OrderItem, $this> */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /** @return HasOne<Payment, $this> */
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    /** @return HasMany<Review, $this> */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /** @return BelongsTo<Courier, $this> */
    public function courier(): BelongsTo
    {
        return $this->belongsTo(Courier::class);
    }
}
