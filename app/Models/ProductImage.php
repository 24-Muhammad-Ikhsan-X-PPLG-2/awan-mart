<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $product_id
 * @property string $image
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ProductImage extends Model
{
    protected $table = 'product_images';

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
