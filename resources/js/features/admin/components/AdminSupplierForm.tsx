import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { AdminSupplierFormProps } from '../types';

const supplierSchema = z
    .object({
        name: z.string().trim().min(2, 'Nama minimal 2 karakter.').max(255),
        email: z.string().trim().email('Masukkan email yang valid.').max(255),
        phone: z.string().max(20, 'Nomor telepon maksimal 20 karakter.'),
        address: z.string().max(1000, 'Alamat maksimal 1000 karakter.'),
        password: z.string().refine(
            (value) => value.length === 0 || value.length >= 8,
            'Kata sandi minimal 8 karakter.',
        ),
        password_confirmation: z.string(),
    })
    .refine((value) => value.password === value.password_confirmation, {
        path: ['password_confirmation'],
        message: 'Konfirmasi kata sandi tidak cocok.',
    })
    .refine(
        (value) =>
            value.password.length > 0 ||
            value.password_confirmation.length === 0,
        {
            path: ['password_confirmation'],
            message: 'Isi kata sandi terlebih dahulu.',
        },
    );

type SupplierFormValues = z.infer<typeof supplierSchema>;

const AdminSupplierForm = ({
    supplier,
}: Pick<AdminSupplierFormProps, 'supplier'>) => {
    const [submitting, setSubmitting] = useState(false);
    const form = useForm<SupplierFormValues>({
        resolver: zodResolver(
            supplier
                ? supplierSchema
                : supplierSchema.refine((value) => value.password.length >= 8, {
                      path: ['password'],
                      message: 'Kata sandi wajib diisi.',
                  }),
        ),
        defaultValues: {
            name: supplier?.name ?? '',
            email: supplier?.email ?? '',
            phone: supplier?.phone ?? '',
            address: supplier?.address ?? '',
            password: '',
            password_confirmation: '',
        },
    });

    const submit = form.handleSubmit((values) => {
        setSubmitting(true);
        const payload = {
            ...values,
            ...(supplier && !values.password ? { password: null } : {}),
            ...(supplier && !values.password_confirmation
                ? { password_confirmation: null }
                : {}),
        };
        const options = {
            preserveScroll: true,
            onError: (errors: Record<string, string>) => {
                Object.entries(errors).forEach(([field, message]) => {
                    if (field in form.getValues()) {
                        form.setError(field as keyof SupplierFormValues, {
                            message,
                        });
                    }
                });
            },
            onFinish: () => setSubmitting(false),
        };

        if (supplier) {
            router.put(`/admin/suppliers/${supplier.id}`, payload, options);
        } else {
            router.post('/admin/suppliers', payload, options);
        }
    });

    return (
        <form
            onSubmit={submit}
            className="max-w-3xl overflow-hidden rounded-xl border border-[#E5E8EE] bg-white shadow-sm"
        >
            <div className="space-y-5 p-5 sm:p-7">
                <Field
                    label="Nama supplier"
                    error={form.formState.errors.name?.message}
                >
                    <input
                        {...form.register('name')}
                        className={inputClass}
                        placeholder="Nama usaha atau supplier"
                    />
                </Field>
                <Field
                    label="Email akun"
                    error={form.formState.errors.email?.message}
                >
                    <input
                        {...form.register('email')}
                        type="email"
                        autoComplete="email"
                        className={inputClass}
                        placeholder="supplier@email.com"
                    />
                </Field>
                <Field
                    label="Nomor telepon"
                    error={form.formState.errors.phone?.message}
                >
                    <input
                        {...form.register('phone')}
                        type="tel"
                        className={inputClass}
                        placeholder="08xxxxxxxxxx"
                    />
                </Field>
                <Field
                    label="Alamat"
                    error={form.formState.errors.address?.message}
                >
                    <textarea
                        {...form.register('address')}
                        rows={3}
                        className={`${inputClass} h-auto py-3`}
                        placeholder="Alamat supplier"
                    />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                        label={
                            supplier
                                ? 'Kata sandi baru (opsional)'
                                : 'Kata sandi'
                        }
                        error={form.formState.errors.password?.message}
                    >
                        <input
                            {...form.register('password')}
                            type="password"
                            autoComplete="new-password"
                            className={inputClass}
                        />
                    </Field>
                    <Field
                        label="Konfirmasi kata sandi"
                        error={
                            form.formState.errors.password_confirmation
                                ?.message
                        }
                    >
                        <input
                            {...form.register('password_confirmation')}
                            type="password"
                            autoComplete="new-password"
                            className={inputClass}
                        />
                    </Field>
                </div>
                {supplier && (
                    <p className="text-[11px] text-[#8A95A5]">
                        Kosongkan kedua kolom kata sandi jika tidak ingin
                        menggantinya.
                    </p>
                )}
            </div>
            <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#E5E8EE] px-5 py-4 sm:flex-row sm:px-7">
                <a
                    href="/admin/suppliers"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#E2E6EE] px-4 text-xs font-semibold text-[#526B91] hover:bg-[#F8F9FC]"
                >
                    <ArrowLeft size={15} /> Kembali
                </a>
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-5 text-xs font-semibold text-white hover:bg-[#314D73] disabled:opacity-60"
                >
                    {submitting ? (
                        <LoaderCircle size={15} className="animate-spin" />
                    ) : (
                        <Save size={15} />
                    )}
                    {supplier ? 'Simpan perubahan' : 'Buat akun'}
                </button>
            </div>
        </form>
    );
};

const inputClass =
    'mt-1.5 h-10 w-full rounded-lg border border-[#D0D5DD] bg-white px-3 text-xs text-[#344054] outline-none focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10';

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

export default AdminSupplierForm;
