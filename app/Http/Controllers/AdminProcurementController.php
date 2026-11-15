<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Procurement;
use App\Models\ProcurementItem;
use App\Models\ProcurementStatus;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminProcurementController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', Rule::in($this->statusValues())],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);
        $search = trim($filters['search'] ?? '');
        $counts = Procurement::query()
            ->select('status')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');
        $searchNumber = null;
        if (preg_match('/^PG-0*(\d+)$/i', $search, $matches) === 1) {
            $searchNumber = (int) $matches[1];
        } elseif (ctype_digit($search)) {
            $searchNumber = (int) $search;
        }

        $procurements = Procurement::query()
            ->with('supplier:id,name')
            ->withCount('procurement_items')
            ->addSelect([
                'total_cost' => ProcurementItem::query()
                    ->selectRaw('COALESCE(SUM(quantity * price), 0)')
                    ->whereColumn('procurement_id', 'procurements.id'),
            ])
            ->when($search !== '', function (Builder $query) use ($search, $searchNumber): void {
                $query->where(function (Builder $query) use ($search, $searchNumber): void {
                    if ($searchNumber !== null) {
                        $query->orWhere('id', $searchNumber);
                    }

                    $query->orWhereHas('supplier', function (Builder $query) use ($search): void {
                        $query->where('name', 'like', "%{$search}%");
                    });
                });
            })
            ->when(
                isset($filters['status']),
                fn (Builder $query) => $query->where('status', $filters['status'])
            )
            ->when(
                isset($filters['date_from']),
                fn (Builder $query) => $query->whereDate('tanggal_pengadaan', '>=', $filters['date_from'])
            )
            ->when(
                isset($filters['date_to']),
                fn (Builder $query) => $query->whereDate('tanggal_pengadaan', '<=', $filters['date_to'])
            )
            ->orderByDesc('tanggal_pengadaan')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Procurement $procurement): array => [
                'id' => $procurement->id,
                'number' => $this->procurementNumber($procurement->id),
                'supplier' => $procurement->supplier->name,
                'date' => $procurement->tanggal_pengadaan->toISOString(),
                'itemsCount' => $procurement->procurement_items_count,
                'totalCost' => (float) $procurement->getAttribute('total_cost'),
                'status' => $procurement->status->value,
            ]);

        return Inertia::render('admin/procurements/index', [
            'admin' => $this->adminData($request),
            'generatedAt' => now()->toISOString(),
            'filters' => [
                'search' => $search,
                'status' => $filters['status'] ?? null,
                'dateFrom' => $filters['date_from'] ?? '',
                'dateTo' => $filters['date_to'] ?? '',
            ],
            'stats' => [
                'total' => (int) $counts->sum(),
                'pending' => (int) $counts->get(ProcurementStatus::Pending->value, 0),
                'approved' => (int) $counts->get(ProcurementStatus::Approved->value, 0),
                'completed' => (int) $counts->get(ProcurementStatus::Completed->value, 0),
            ],
            'procurements' => $procurements,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('admin/procurements/create', [
            'admin' => $this->adminData($request),
            'generatedAt' => now()->toISOString(),
            'suppliers' => $this->supplierOptions(''),
            'products' => $this->productOptions(''),
        ]);
    }

    public function options(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', Rule::in(['suppliers', 'products'])],
            'search' => ['nullable', 'string', 'max:100'],
        ]);
        $search = trim($validated['search'] ?? '');

        return response()->json([
            'options' => $validated['type'] === 'suppliers'
                ? $this->supplierOptions($search)
                : $this->productOptions($search),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'supplier_id' => ['required', 'integer', 'exists:supplier,id'],
            'tanggal_pengadaan' => ['required', 'date'],
            'catatan' => ['nullable', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1', 'max:100'],
            'items.*.product_id' => [
                'required',
                'integer',
                'distinct',
                'exists:products,id',
            ],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:4294967295'],
            'items.*.price' => ['required', 'numeric', 'gt:0', 'decimal:0,2', 'max:99999999.99'],
        ]);

        $admin = Admin::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
        $items = $this->normalizeItems($validated['items'] ?? null);

        $procurement = DB::transaction(function () use ($validated, $admin, $items): Procurement {
            $supplier = Supplier::query()
                ->whereKey($validated['supplier_id'])
                ->whereHas('user', fn (Builder $query) => $query->where('role', UserRole::Supplier))
                ->lockForUpdate()
                ->first();

            if ($supplier === null) {
                throw ValidationException::withMessages([
                    'supplier_id' => 'Supplier yang dipilih tidak valid.',
                ]);
            }

            $productIds = array_values(array_unique(array_column($items, 'product_id')));
            $products = Product::query()
                ->whereIn('id', $productIds)
                ->orderBy('id')
                ->lockForUpdate()
                ->get(['id'])
                ->keyBy('id');

            if ($products->count() !== count($productIds)) {
                throw ValidationException::withMessages([
                    'items' => 'Satu atau beberapa produk tidak lagi tersedia.',
                ]);
            }

            $procurement = Procurement::query()->create([
                'supplier_id' => $supplier->id,
                'admin_id' => $admin->id,
                'tanggal_pengadaan' => $validated['tanggal_pengadaan'],
                'status' => ProcurementStatus::Pending,
                'catatan' => $validated['catatan'] ?? null,
            ]);

            foreach ($items as $item) {
                $procurement->procurement_items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            return $procurement;
        });

        return redirect()
            ->route('admin.procurements.show', $procurement)
            ->with('success', 'Permintaan pengadaan berhasil dibuat.');
    }

    public function show(Request $request, Procurement $procurement): Response
    {
        $procurement->load([
            'supplier.user:id,email',
            'admin:id,name',
            'procurement_items.product.product_images',
        ]);
        $items = $procurement->procurement_items
            ->map(fn (ProcurementItem $item): array => [
                'id' => $item->id,
                'productId' => $item->product_id,
                'productName' => $item->product->name,
                'image' => $item->product->product_images->first()?->image,
                'quantity' => $item->quantity,
                'price' => (float) $item->price,
                'subtotal' => (float) $item->price * $item->quantity,
            ])
            ->values();
        $supplierTotals = DB::table('procurements')
            ->leftJoin('procurement_items', 'procurement_items.procurement_id', '=', 'procurements.id')
            ->where('procurements.supplier_id', $procurement->supplier_id)
            ->selectRaw('COUNT(DISTINCT procurements.id) as count, COALESCE(SUM(procurement_items.quantity * procurement_items.price), 0) as total')
            ->first();

        return Inertia::render('admin/procurements/show', [
            'admin' => $this->adminData($request),
            'generatedAt' => now()->toISOString(),
            'success' => $request->session()->get('success'),
            'procurement' => [
                'id' => $procurement->id,
                'number' => $this->procurementNumber($procurement->id),
                'date' => $procurement->tanggal_pengadaan->toISOString(),
                'createdAt' => $procurement->created_at?->toISOString(),
                'updatedAt' => $procurement->updated_at?->toISOString(),
                'status' => $procurement->status->value,
                'notes' => $procurement->catatan,
                'canApprove' => $procurement->status === ProcurementStatus::Pending,
                'canComplete' => $procurement->status === ProcurementStatus::Approved,
                'createdBy' => $procurement->admin->name,
                'supplier' => [
                    'id' => $procurement->supplier->id,
                    'name' => $procurement->supplier->name,
                    'email' => $procurement->supplier->user->email,
                    'phone' => $procurement->supplier->telp,
                    'address' => $procurement->supplier->alamat,
                    'procurementCount' => (int) $supplierTotals->count,
                    'procurementValue' => (float) $supplierTotals->total,
                ],
                'items' => $items,
                'summary' => [
                    'totalQuantity' => (int) $items->sum('quantity'),
                    'totalCost' => (float) $items->sum('subtotal'),
                ],
            ],
        ]);
    }

    public function updateStatus(Request $request, Procurement $procurement): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in([
                ProcurementStatus::Approved->value,
                ProcurementStatus::Completed->value,
            ])],
        ]);
        $targetStatus = ProcurementStatus::from($validated['status']);

        DB::transaction(function () use ($procurement, $targetStatus): void {
            $lockedProcurement = Procurement::query()
                ->lockForUpdate()
                ->findOrFail($procurement->id);

            if (
                $targetStatus === ProcurementStatus::Approved
                && $lockedProcurement->status === ProcurementStatus::Pending
            ) {
                $lockedProcurement->update(['status' => ProcurementStatus::Approved]);

                return;
            }

            if (
                $targetStatus !== ProcurementStatus::Completed
                || $lockedProcurement->status !== ProcurementStatus::Approved
            ) {
                throw ValidationException::withMessages([
                    'status' => 'Perubahan status pengadaan tidak valid.',
                ]);
            }

            $items = $lockedProcurement->procurement_items()
                ->select('product_id')
                ->selectRaw('SUM(quantity) as quantity')
                ->groupBy('product_id')
                ->orderBy('product_id')
                ->lockForUpdate()
                ->get();

            if ($items->isEmpty()) {
                throw ValidationException::withMessages([
                    'status' => 'Pengadaan tanpa item tidak dapat diselesaikan.',
                ]);
            }

            foreach ($items as $item) {
                $product = Product::query()
                    ->whereKey($item->product_id)
                    ->lockForUpdate()
                    ->firstOrFail();
                $product->increment('stock', (int) $item->quantity);
            }

            $lockedProcurement->update(['status' => ProcurementStatus::Completed]);
        });

        return back()->with(
            'success',
            $targetStatus === ProcurementStatus::Approved
                ? 'Pengadaan berhasil disetujui.'
                : 'Pengadaan selesai dan stok produk telah diperbarui.'
        );
    }

    /**
     * @return array<int, array{id: int, name: string, email: string, phone: string|null, address: string|null}>
     */
    private function supplierOptions(string $search): array
    {
        return Supplier::query()
            ->with('user:id,email')
            ->whereHas('user', fn (Builder $query) => $query->where('role', UserRole::Supplier))
            ->when($search !== '', fn (Builder $query) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->limit(20)
            ->get(['id', 'user_id', 'name', 'alamat', 'telp'])
            ->map(fn (Supplier $supplier): array => [
                'id' => $supplier->id,
                'name' => $supplier->name,
                'email' => $supplier->user->email,
                'phone' => $supplier->telp,
                'address' => $supplier->alamat,
            ])
            ->all();
    }

    /**
     * @return array<int, array{id: int, name: string, price: float, stock: int, image: string|null}>
     */
    private function productOptions(string $search): array
    {
        return Product::query()
            ->with('product_images:id,product_id,image')
            ->when($search !== '', fn (Builder $query) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->limit(20)
            ->get(['id', 'name', 'price', 'stock'])
            ->map(fn (Product $product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'image' => $product->product_images->first()?->image,
            ])
            ->all();
    }

    /**
     * @return list<array{product_id: int, quantity: int, price: string}>
     */
    private function normalizeItems(mixed $items): array
    {
        if (! is_array($items)) {
            throw ValidationException::withMessages([
                'items' => 'Item pengadaan tidak valid.',
            ]);
        }

        $normalized = [];
        foreach ($items as $item) {
            if (
                ! is_array($item)
                || ! isset($item['product_id'], $item['quantity'], $item['price'])
                || ! is_numeric($item['product_id'])
                || ! is_numeric($item['quantity'])
                || ! is_numeric($item['price'])
            ) {
                throw ValidationException::withMessages([
                    'items' => 'Item pengadaan tidak valid.',
                ]);
            }

            $normalized[] = [
                'product_id' => (int) $item['product_id'],
                'quantity' => (int) $item['quantity'],
                'price' => (string) $item['price'],
            ];
        }

        return $normalized;
    }

    /**
     * @return array{name: string, email: string}
     */
    private function adminData(Request $request): array
    {
        return [
            'name' => $request->user()->admin?->name ?: $request->user()->email,
            'email' => $request->user()->email,
        ];
    }

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
