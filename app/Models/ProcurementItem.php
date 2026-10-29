<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Override;

/**
 * @property int $id
 * @property int $procurement_id
 * @property int $product_id
 * @property int $quantity
 * @property string $price
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ProcurementItem extends Model
{
    protected $table = 'procurement_items';

    #[Override]
    protected function casts()
    {
        return [
            'price' => 'decimal:2'
        ];
    }

    public function procurement(): BelongsTo
    {
        return $this->belongsTo(Procurement::class);
    }
}
