<?php

namespace App\Http\Controllers;

use App\Models\Procurement;
use App\Models\ProcurementItem;
use App\Models\ProcurementStatus;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller yang menangani portal supplier untuk melihat dan memproses procurement.
 *
 * Fokus utamanya adalah membatasi akses ke procurement milik supplier yang sedang login,
 * lalu mengizinkan hanya transisi status yang valid seperti pending -> approved,
 * approved -> shipped, dan reject jika diperlukan.
 */
class SupplierProcurementController extends Controller
{
    /**
     * Menampilkan daftar procurement milik supplier yang sedang login.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', Rule::in($this->statusValues())],
        ]);
        $supplier = $this->supplierFor($request->user());
        $counts = Procurement::query()
            ->where('supplier_id', $supplier->id)
            ->select('status')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');
        $search = trim($filters['search'] ?? '');
        $searchId = $this->procurementIdFromSearch($search);

        $procurements = Procurement::query()
            ->where('supplier_id', $supplier->id)
            ->withCount('procurement_items')
            ->addSelect([
                'total_quantity' => ProcurementItem::query()
                    ->selectRaw('COALESCE(SUM(quantity), 0)')
                    ->whereColumn('procurement_id', 'procurements.id'),
                'total_cost' => ProcurementItem::query()
                    ->selectRaw('COALESCE(SUM(quantity * price), 0)')
                    ->whereColumn('procurement_id', 'procurements.id'),
            ])
            ->when($search !== '', function (Builder $query) use ($searchId): void {
                if ($searchId !== null) {
                    $query->whereKey($searchId);

                    return;
                }

                $query->whereRaw('1 = 0');
            })
            ->when(
                isset($filters['status']),
                fn (Builder $query) => $query->where('status', $filters['status'])
            )
            ->orderByDesc('tanggal_pengadaan')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Procurement $procurement): array => [
                'id' => $procurement->id,
                'number' => $this->procurementNumber($procurement->id),
                'date' => $procurement->tanggal_pengadaan->toISOString(),
                'itemsCount' => $procurement->procurement_items_count,
                'totalQuantity' => (int) $procurement->getAttribute('total_quantity'),
                'totalCost' => (float) $procurement->getAttribute('total_cost'),
                'status' => $procurement->status->value,
            ]);

        return Inertia::render('supplier/procurements/index', [
            'supplier' => $this->supplierData($supplier, $request->user()),
            'generatedAt' => now()->toISOString(),
            'filters' => [
                'search' => $search,
                'status' => $filters['status'] ?? null,
            ],
            'stats' => [
                'total' => (int) $counts->sum(),
                'pending' => (int) $counts->get(ProcurementStatus::Pending->value, 0),
                'approved' => (int) $counts->get(ProcurementStatus::Approved->value, 0),
                'shipped' => (int) $counts->get(ProcurementStatus::Shipped->value, 0),
            ],
            'statusCounts' => collect(ProcurementStatus::cases())
                ->map(fn (ProcurementStatus $status): array => [
                    'value' => $status->value,
                    'count' => (int) $counts->get($status->value, 0),
                ])
                ->values(),
            'procurements' => $procurements,
            'success' => $request->session()->get('success'),
        ]);
    }

    /**
     * Menampilkan detail procurement milik supplier termasuk item, ringkasan, dan aksi.
     */
    public function show(Request $request, Procurement $procurement): Response
    {
        $supplier = $this->supplierFor($request->user());
        $procurement = $this->ownedProcurement($supplier, $procurement->id);
        $procurement->load('procurement_items.product.product_images');
        $items = $procurement->procurement_items
            ->map(fn (ProcurementItem $item): array => [
                'id' => $item->id,
                'productName' => $item->product->name,
                'image' => $item->product->product_images->first()?->image,
                'quantity' => $item->quantity,
                'price' => (float) $item->price,
                'subtotal' => (float) $item->price * $item->quantity,
            ])
            ->values();

        return Inertia::render('supplier/procurements/show', [
            'supplier' => $this->supplierData($supplier, $request->user()),
            'generatedAt' => now()->toISOString(),
            'success' => $request->session()->get('success'),
            'procurement' => [
                'id' => $procurement->id,
                'number' => $this->procurementNumber($procurement->id),
                'date' => $procurement->tanggal_pengadaan->toISOString(),
                'updatedAt' => $procurement->updated_at?->toISOString(),
                'shippedAt' => $procurement->tanggal_pengiriman?->toISOString(),
                'status' => $procurement->status->value,
                'notes' => $procurement->catatan,
                'rejectionReason' => $procurement->alasan_penolakan,
                'canAccept' => $procurement->status === ProcurementStatus::Pending,
                'canReject' => $procurement->status === ProcurementStatus::Pending,
                'canShip' => $procurement->status === ProcurementStatus::Approved,
                'items' => $items,
                'summary' => [
                    'itemsCount' => $items->count(),
                    'totalQuantity' => (int) $items->sum('quantity'),
                    'totalCost' => (float) $items->sum('subtotal'),
                ],
            ],
        ]);
    }

    /**
     * Menerima permintaan procurement yang masih dalam status pending.
     */
    public function accept(Request $request, Procurement $procurement): RedirectResponse
    {
        $this->transition(
            $request,
            $procurement,
            ProcurementStatus::Pending,
            ProcurementStatus::Approved
        );

        return back()->with('success', 'Permintaan pengadaan berhasil diterima.');
    }

    /**
     * Menolak procurement dengan alasan yang wajib diisi oleh supplier.
     */
    public function reject(Request $request, Procurement $procurement): RedirectResponse
    {
        $reason = $request->input('reason');
        if (is_string($reason)) {
            $request->merge(['reason' => trim($reason)]);
        }

        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:5', 'max:500'],
        ]);

        $this->transition(
            $request,
            $procurement,
            ProcurementStatus::Pending,
            ProcurementStatus::Rejected,
            trim($validated['reason'])
        );

        return back()->with('success', 'Permintaan pengadaan berhasil ditolak.');
    }

    /**
     * Mengonfirmasi bahwa barang telah dikirim dari supplier ke admin.
     */
    public function ship(Request $request, Procurement $procurement): RedirectResponse
    {
        $this->transition(
            $request,
            $procurement,
            ProcurementStatus::Approved,
            ProcurementStatus::Shipped
        );

        return back()->with('success', 'Konfirmasi pengiriman berhasil dicatat.');
    }

    /**
     * Melakukan perubahan status hanya jika status saat ini sesuai dengan ekspetasi.
     *
     * Logika ini dijaga di backend agar supplier tidak bisa memaksa status yang tidak legal.
     */
    private function transition(
        Request $request,
        Procurement $procurement,
        ProcurementStatus $expected,
        ProcurementStatus $target,
        ?string $reason = null
    ): void {
        $supplier = $this->supplierFor($request->user());

        DB::transaction(function () use ($supplier, $procurement, $expected, $target, $reason): void {
            $lockedProcurement = Procurement::query()
                ->where('supplier_id', $supplier->id)
                ->whereKey($procurement->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedProcurement->status !== $expected) {
                throw ValidationException::withMessages([
                    'status' => 'Status pengadaan sudah berubah atau aksi ini tidak tersedia.',
                ]);
            }

            $lockedProcurement->update([
                'status' => $target,
                'alasan_penolakan' => $reason,
                'tanggal_pengiriman' => $target === ProcurementStatus::Shipped ? now() : null,
            ]);
        });
    }

    /**
     * Mengambil supplier aktif dari user login dan memaksa 403 bila user bukan supplier.
     */
    private function supplierFor(?User $user): Supplier
    {
        abort_if($user === null, 403);

        return $user->supplier()->firstOrFail();
    }

    /**
     * Mengambil procurement yang memang milik supplier login, bukan record supplier lain.
     */
    private function ownedProcurement(Supplier $supplier, int $id): Procurement
    {
        return Procurement::query()
            ->where('supplier_id', $supplier->id)
            ->findOrFail($id);
    }

    /**
     * @return array{id: int, name: string, email: string}
     */
    private function supplierData(Supplier $supplier, User $user): array
    {
        return [
            'id' => $supplier->id,
            'name' => $supplier->name,
            'email' => $user->email,
        ];
    }

    /**
     * Mengubah query search yang mungkin berupa nomor procurement menjadi ID integer.
     */
    private function procurementIdFromSearch(string $search): ?int
    {
        if (preg_match('/^PG-0*(\d+)$/i', $search, $matches) === 1) {
            return (int) $matches[1];
        }

        return ctype_digit($search) ? (int) $search : null;
    }

    /**
     * Membuat format nomor procurement yang konsisten untuk UI dan pencarian.
     */
    private function procurementNumber(int $id): string
    {
        return 'PG-'.str_pad((string) $id, 6, '0', STR_PAD_LEFT);
    }

    /**
     * @return array<int, string>
     */
    private function statusValues(): array
    {
        return array_map(
            fn (ProcurementStatus $status): string => $status->value,
            ProcurementStatus::cases()
        );
    }
}
