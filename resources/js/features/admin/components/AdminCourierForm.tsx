import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const courierSchema = z.object({
    name: z.string().trim().min(2, 'Nama layanan minimal 2 karakter.').max(100),
    supplier_id: z.string().min(1, 'Pilih akun supplier.'),
    shipping_cost: z
        .string()
        .regex(/^\d+$/, 'Ongkos kirim harus berupa bilangan bulat.'),
    is_active: z.boolean(),
});

type CourierFormValues = z.infer<typeof courierSchema>;
type SupplierOption = { id: number; name: string; email: string };
type Courier = {
    id: number;
    name: string;
    supplier_id: string;
    shipping_cost: string;
    is_active: boolean;
} | null;

const inputClass =
    'mt-1.5 h-10 w-full rounded-lg border border-[#D0D5DD] bg-white px-3 text-xs text-[#344054] outline-none focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10';

const AdminCourierForm = ({
    courier,
    suppliers,
}: {
    courier: Courier;
    suppliers: SupplierOption[];
}) => {
    const [submitting, setSubmitting] = useState(false);
    const form = useForm<CourierFormValues>({
        resolver: zodResolver(courierSchema),
        defaultValues: {
            name: courier?.name ?? '',
            supplier_id: courier?.supplier_id ?? '',
            shipping_cost: courier?.shipping_cost ?? '',
            is_active: courier?.is_active ?? true,
        },
    });

    const submit = form.handleSubmit((values) => {
        setSubmitting(true);
        const payload = {
            ...values,
            supplier_id: Number(values.supplier_id),
            shipping_cost: Number(values.shipping_cost),
        };
        const options = {
            preserveScroll: true,
            onError: (errors: Record<string, string>) => {
                Object.entries(errors).forEach(([field, message]) => {
                    if (field in form.getValues()) {
                        form.setError(field as keyof CourierFormValues, {
                            message,
                        });
                    }
                });
            },
            onFinish: () => setSubmitting(false),
        };
        if (courier) {
            router.put(`/admin/couriers/${courier.id}`, payload, options);
        } else {
            router.post('/admin/couriers', payload, options);
        }
    });

    return (
        <form
            onSubmit={submit}
            className="max-w-3xl overflow-hidden rounded-xl border border-[#E5E8EE] bg-white shadow-sm"
        >
            <div className="space-y-5 p-5 sm:p-7">
                <Field
                    label="Nama layanan kurir"
                    error={form.formState.errors.name?.message}
                >
                    <input
                        {...form.register('name')}
                        className={inputClass}
                        placeholder="Contoh: Pengiriman Reguler"
                    />
                </Field>
                <Field
                    label="Akun supplier / kurir"
                    error={form.formState.errors.supplier_id?.message}
                >
                    <select
                        {...form.register('supplier_id')}
                        className={inputClass}
                    >
                        <option value="">Pilih akun supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name} — {supplier.email}
                            </option>
                        ))}
                    </select>
                    {!suppliers.length && (
                        <span className="mt-1.5 block text-[11px] font-normal text-amber-700">
                            Semua akun supplier sudah terdaftar sebagai kurir.
                        </span>
                    )}
                </Field>
                <Field
                    label="Ongkos kirim (Rp)"
                    error={form.formState.errors.shipping_cost?.message}
                >
                    <input
                        {...form.register('shipping_cost')}
                        inputMode="numeric"
                        className={inputClass}
                        placeholder="Contoh: 15000"
                    />
                    <span className="mt-1.5 block text-[11px] font-normal text-[#8A95A5]">
                        Masukkan nominal rupiah tanpa titik atau koma.
                    </span>
                </Field>
                <label className="flex items-start gap-3 rounded-lg border border-[#E5E8EE] p-4 text-xs text-[#344054]">
                    <input
                        type="checkbox"
                        {...form.register('is_active')}
                        className="mt-0.5 size-4 accent-[#203452]"
                    />
                    <span>
                        <span className="block font-semibold">Kurir aktif</span>
                        <span className="mt-1 block text-[11px] text-[#8A95A5]">
                            Kurir aktif dapat dipilih pelanggan saat checkout.
                        </span>
                    </span>
                </label>
            </div>
            <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#E5E8EE] px-5 py-4 sm:flex-row sm:px-7">
                <a
                    href="/admin/couriers"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#E2E6EE] px-4 text-xs font-semibold text-[#526B91] hover:bg-[#F8F9FC]"
                >
                    <ArrowLeft size={15} /> Kembali
                </a>
                <button
                    type="submit"
                    disabled={
                        submitting || (!courier && suppliers.length === 0)
                    }
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-5 text-xs font-semibold text-white hover:bg-[#314D73] disabled:opacity-60"
                >
                    {submitting ? (
                        <LoaderCircle size={15} className="animate-spin" />
                    ) : (
                        <Save size={15} />
                    )}
                    {courier ? 'Simpan perubahan' : 'Buat kurir'}
                </button>
            </div>
        </form>
    );
};

const Field = ({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) => (
    <label className="block text-xs font-semibold text-[#344054]">
        {label}
        {children}
        {error && (
            <span className="mt-1.5 block text-[11px] font-medium text-red-600">
                {error}
            </span>
        )}
    </label>
);

export default AdminCourierForm;
