import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { AdminCategoryFormProps } from '../types';

const categorySchema = z.object({
    name: z.string().trim().min(2, 'Nama kategori minimal 2 karakter.').max(100),
    description: z.string().trim().min(1, 'Deskripsi kategori wajib diisi.').max(2000, 'Deskripsi maksimal 2000 karakter.'),
    icon: z.string().max(255, 'Ikon maksimal 255 karakter.'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const AdminCategoryForm = ({
    category,
}: Pick<AdminCategoryFormProps, 'category'>) => {
    const [submitting, setSubmitting] = useState(false);
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category?.name ?? '',
            description: category?.description ?? '',
            icon: category?.icon ?? '',
        },
    });

    const submit = form.handleSubmit((values) => {
        setSubmitting(true);
        const options = {
            preserveScroll: true,
            onError: (errors: Record<string, string>) => {
                Object.entries(errors).forEach(([field, message]) => {
                    if (field in form.getValues()) {
                        form.setError(field as keyof CategoryFormValues, { message });
                    }
                });
            },
            onFinish: () => setSubmitting(false),
        };
        if (category) {
            router.put(`/admin/categories/${category.id}`, values, options);
        } else {
            router.post('/admin/categories', values, options);
        }
    });

    return (
        <form onSubmit={submit} className="max-w-3xl overflow-hidden rounded-xl border border-[#E5E8EE] bg-white shadow-sm">
            <div className="space-y-5 p-5 sm:p-7">
                <Field label="Nama kategori" error={form.formState.errors.name?.message}>
                    <input {...form.register('name')} className={inputClass} placeholder="Contoh: Peralatan Rumah" />
                </Field>
                <Field label="Deskripsi" error={form.formState.errors.description?.message}>
                    <textarea {...form.register('description')} rows={5} className={`${inputClass} h-auto py-3`} placeholder="Jelaskan kategori ini untuk pelanggan." />
                </Field>
                <Field label="Ikon (opsional)" error={form.formState.errors.icon?.message}>
                    <input {...form.register('icon')} className={inputClass} placeholder="Contoh: package atau emoji" />
                    <span className="mt-1.5 block text-[11px] font-normal text-[#8A95A5]">Nama ikon atau simbol untuk tampilan kategori.</span>
                </Field>
            </div>
            <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#E5E8EE] px-5 py-4 sm:flex-row sm:px-7">
                <a href="/admin/categories" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#E2E6EE] px-4 text-xs font-semibold text-[#526B91] hover:bg-[#F8F9FC]">
                    <ArrowLeft size={15} /> Kembali
                </a>
                <button type="submit" disabled={submitting} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-5 text-xs font-semibold text-white hover:bg-[#314D73] disabled:opacity-60">
                    {submitting ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}
                    {category ? 'Simpan perubahan' : 'Buat kategori'}
                </button>
            </div>
        </form>
    );
};

const inputClass = 'mt-1.5 h-10 w-full rounded-lg border border-[#D0D5DD] bg-white px-3 text-xs text-[#344054] outline-none focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10';

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <label className="block text-xs font-semibold text-[#344054]">
        {label}
        {children}
        {error && <span className="mt-1.5 block text-[11px] font-medium text-red-600">{error}</span>}
    </label>
);

export default AdminCategoryForm;
