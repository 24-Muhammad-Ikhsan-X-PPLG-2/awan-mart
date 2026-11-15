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
 * @property ProcurementStatus $status
 * @property string|null $catatan
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['supplier_id', 'admin_id', 'tanggal_pengadaan', 'status', 'catatan'])]
class Procurement extends Model
{
    protected $table = 'procurements';

    #[Override]
    protected function casts()
    {
        return [
            'tanggal_pengadaan' => 'datetime',
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
