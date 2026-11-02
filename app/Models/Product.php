<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Override;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $user_id
 * @property string $image
 * @property string $slug
 * @property string $name
 * @property string $description
 * @property string $price
 * @property int $stock
 * @property int $category_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'image', 'name', 'description', 'price', 'stock', 'category_id'])]
class Product extends Model
{
    protected $table = 'products';
    #[Override]
    protected function casts()
    {
        return [
            'price' => 'decimal:2'
        ];
    }
    #[Override]
    protected static function booted()
    {
        static::saving(function (Product $product) {
            if ($product->isDirty('title')) {
                $product->slug = Str::slug($product->title);
            }
        });
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    public function order_items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
