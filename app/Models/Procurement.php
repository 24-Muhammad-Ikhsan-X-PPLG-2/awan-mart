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
 * @property int $admin_id
 * @property Carbon $tanggal_pengadaan
 * @property Carbon|null $tanggal_pengiriman
 * @property ProcurementStatus $status
 * @property string|null $catatan
 * @property string|null $alasan_penolakan
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'supplier_id',
    'admin_id',
    'tanggal_pengadaan',
    'tanggal_pengiriman',
    'status',
    'catatan',
    'alasan_penolakan',
])]
class Procurement extends Model
{
    protected $table = 'procurements';

    #[Override]
    protected function casts()
    {
        return [
            'tanggal_pengadaan' => 'datetime',
            'tanggal_pengiriman' => 'datetime',
            'status' => ProcurementStatus::class,
        ];
    }

    /** @return BelongsTo<Supplier, $this> */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /** @return BelongsTo<Admin, $this> */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    /** @return HasMany<ProcurementItem, $this> */
    public function procurement_items(): HasMany
    {
        return $this->hasMany(ProcurementItem::class);
    }
}
