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
}

/**
 * @property int $id
 * @property int $order_id
 * @property string $method
 * @property string $amount
 * @property PaymentStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['order_id', 'method', 'status'])]
class Payment extends Model
{
    protected $table = 'payments';
    #[Override]
    protected function casts()
    {
        return [
            'amount' => 'decimal:2'
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
