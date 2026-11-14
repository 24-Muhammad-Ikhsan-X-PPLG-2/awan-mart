<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $icon
 * @property string $name
 * @property string|null $description
 * @property-read int|null $products_count
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'description', 'icon'])]
class Category extends Model
{
    protected $table = 'categories';

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
