<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\OrderStatus;
use App\Models\Pelanggan;
use App\Models\Supplier;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * Controller yang mengelola profil user, alamat, dan riwayat order terkait user.
 */
class UserController extends Controller
{
    /**
     * Menyimpan/ubah alamat pengiriman pelanggan dari request AJAX.
     */
    public function address(Request $req): JsonResponse
    {
        try {
            $validated = $req->validate([
                'recipient_name' => ['required', 'string', 'max:255'],
                'phone' => ['required', 'string', 'max:20'],
                'address' => ['required', 'string', 'max:1000'],
                'city' => ['required', 'string', 'max:100'],
                'province' => ['required', 'string', 'max:100'],
                'postal_code' => ['required', 'string', 'max:10'],
            ]);

            $user = Auth::user();
            if ($user->role->value === 'pelanggan') {
                // Field alamat pada tabel pelanggan disimpan sebagai payload object.
                Pelanggan::query()->where('user_id', '=', $user->id)->update([
                    'alamat' => $validated,
                ]);
            }

            return response()->json([
                'message' => 'Successfully update address.',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            report($e);

            return response()->json([
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Menampilkan halaman profil user dan daftar order yang sudah dibeli / difilter.
     */
    public function profile(): InertiaResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $user->loadMissing(['pelanggan', 'admin', 'supplier']);
        $profile = $this->profileRecord($user);

        $filters = request()->validate([
            'status' => [
                'nullable',
                Rule::in(array_map(
                    fn(OrderStatus $status) => $status->value,
                    OrderStatus::cases()
                )),
            ],
            'search' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $orders = $user->orders()
            ->with([
                'payment',
                'orderItems.product.product_images',
            ])
            ->when(
                $filters['status'] ?? null,
                fn(Builder $query, string $status) => $query->where('status', $status)
            )
            ->when($filters['search'] ?? null, function (Builder $query, string $search) {
                $query->where(function (Builder $query) use ($search) {
                    $query
                        ->where('order_number', 'like', "%{$search}%")
                        ->orWhereHas('payment', fn(Builder $paymentQuery) => $paymentQuery
                            ->where('provider_order_id', 'like', "%{$search}%"))
                        ->orWhereHas('orderItems.product', fn(Builder $productQuery) => $productQuery
                            ->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(6)
            ->withQueryString();

        return Inertia::render('profile/index', [
            'profile' => [
                'name' => $profile->name ?? '',
                'email' => $user->email,
                'phone' => $profile->telp ?? '',
                'createdAt' => $user->created_at?->toISOString(),
            ],
            'stats' => [
                'orders' => $user->orders()->count(),
                'completed' => $user->orders()->where('status', OrderStatus::Completed)->count(),
                'pending' => $user->orders()->where('status', OrderStatus::PendingPayment)->count(),
            ],
            'orders' => $orders,
            'filters' => [
                'status' => $filters['status'] ?? '',
                'search' => $filters['search'] ?? '',
            ],
        ]);
    }

    /**
     * Memperbarui data profile user, dengan pengecekan unique per tabel profil.
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $profile = $this->profileRecord($user);
        $profileTable = $this->profileTable($user);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique($profileTable, 'name')->ignore($profile?->getKey())],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        DB::transaction(function () use ($user, $validated) {
            $user->update(['email' => $validated['email']]);

            match ($user->role) {
                UserRole::Pelanggan => $user->pelanggan()->updateOrCreate([], [
                    'name' => $validated['name'],
                    'telp' => $validated['phone'] ?? null,
                ]),
                UserRole::Admin => $user->admin()->updateOrCreate([], [
                    'name' => $validated['name'],
                    'telp' => $validated['phone'] ?? null,
                ]),
                UserRole::Supplier => $user->supplier()->updateOrCreate([], [
                    'name' => $validated['name'],
                    'telp' => $validated['phone'] ?? null,
                ]),
            };
        });

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Mengembalikan record profil sesuai role user saat ini.
     */
    private function profileRecord(User $user): Pelanggan|Admin|Supplier|null
    {
        return match ($user->role) {
            UserRole::Pelanggan => $user->pelanggan,
            UserRole::Admin => $user->admin,
            UserRole::Supplier => $user->supplier,
        };
    }

    /**
     * Nama tabel profil yang dipakai untuk validasi unique berdasarkan role.
     */
    private function profileTable(User $user): string
    {
        return match ($user->role) {
            UserRole::Pelanggan => 'pelanggan',
            UserRole::Admin => 'admin',
            UserRole::Supplier => 'supplier',
        };
    }
}
