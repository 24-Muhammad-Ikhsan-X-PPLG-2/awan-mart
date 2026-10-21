<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;
use Override;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Process = 'process';
    case Shipped = 'shipped';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
}

/**
 * @property int $id
 * @property int $user_id
 * @property string $total_price
 * @property string $shipping_address
 * @property OrderStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'total_price', 'shipping_address', 'status'])]
class Order extends Model
{
    protected $table = 'orders';
    #[Override]
    protected function casts()
    {
        return [
            'total_price' => 'decimal:2'
        ];
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function order_items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
