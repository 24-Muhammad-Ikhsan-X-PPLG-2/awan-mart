<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Override;

enum PaymentStatus: string
{
    case Pending = 'pending';
    case Success = 'success';
    case Failed = 'failed';
    case Expired = 'expired';
    case Canceled = 'canceled';
}

/**
 * @property int $id
 * @property int $order_id
 * @property string $provider
 * @property string $provider_order_id
 * @property string|null $transaction_id
 * @property string|null $snap_token
 * @property string|null $redirect_url
 * @property string|null $method
 * @property string $amount
 * @property PaymentStatus $status
 * @property string|null $transaction_status
 * @property string|null $fraud_status
 * @property Carbon|null $paid_at
 * @property Carbon|null $expired_at
 * @property array|null $metadata
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'order_id',
    'provider',
    'provider_order_id',
    'transaction_id',
    'snap_token',
    'redirect_url',
    'method',
    'amount',
    'status',
    'transaction_status',
    'fraud_status',
    'paid_at',
    'expired_at',
    'metadata',
])]
class Payment extends Model
{
    protected $table = 'payments';

    #[Override]
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'status' => PaymentStatus::class,
            'paid_at' => 'datetime',
            'expired_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
