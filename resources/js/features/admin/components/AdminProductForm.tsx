import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ArrowLeft, ImagePlus, LoaderCircle, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { AdminProductFormProps } from '../types';

const productSchema = z.object({
    name: z.string().trim().min(2, 'Nama produk minimal 2 karakter.').max(100),
    description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter.').max(10000),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Masukkan harga yang valid.').refine((value) => Number(value) > 0, 'Harga harus lebih dari 0.'),
    stock: z.string().regex(/^\d+$/, 'Stok harus berupa bilangan bulat.').refine((value) => Number(value) <= 2147483647, 'Stok melebihi batas.'),
    category_id: z.string().min(1, 'Pilih kategori produk.'),
    images: z.array(z.instanceof(File))
        .max(5, 'Maksimal 5 gambar baru.')
        .refine((files) => files.every((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)), 'Format gambar harus JPG, PNG, atau WebP.')
        .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), 'Ukuran setiap gambar maksimal 5 MB.'),
    remove_images: z.array(z.number()),
});

type ProductFormValues = z.infer<typeof productSchema>;

const AdminProductForm = ({
    product,
    categories,
}: Pick<AdminProductFormProps, 'product' | 'categories'>) => {
    const [serverError, setServerError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const defaults: ProductFormValues = {
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product?.price ?? '',
        stock: product?.stock ?? '0',
        category_id: product?.category_id ?? '',
        images: [],
        remove_images: [],
    };
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: defaults,
    });
    const selectedFiles = form.watch('images');
    const removeImages = form.watch('remove_images');
    const previews = useMemo(
        () => selectedFiles.map((file) => URL.createObjectURL(file)),
        [selectedFiles],
    );

    useEffect(
        () => () => previews.forEach((preview) => URL.revokeObjectURL(preview)),
        [previews],
    );

    const submit = form.handleSubmit((values) => {
        setServerError('');
        const remainingImageCount =
            (product?.images.filter(
                (image) => !values.remove_images.includes(image.id),
            ).length ?? 0) + values.images.length;
        if (remainingImageCount < 1 || remainingImageCount > 5) {
            form.setError('images', {
                message: 'Produk harus memiliki 1 sampai 5 foto.',
            });
            return;
        }
        setSubmitting(true);
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onError: (errors: Record<string, string>) => {
                Object.entries(errors).forEach(([key, message]) => {
                    const field = key as keyof ProductFormValues;
                    if (field in form.getValues()) {
                        form.setError(field, { message });
                    } else {
                        setServerError(message);
                    }
                });
            },
            onFinish: () => setSubmitting(false),
        };

        if (product) {
            router.post(
                `/admin/products/${product.id}`,
                { ...values, _method: 'put' },
                options,
            );
        } else {
            router.post('/admin/products', values, options);
        }
    });

    const errors = form.formState.errors;

    return (
        <form
            onSubmit={submit}
            className="overflow-hidden rounded-xl border border-[#E5E8EE] bg-white shadow-sm"
        >
            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-5">
                    <Field label="Nama produk" error={errors.name?.message}>
                        <input {...form.register('name')} className={inputClass} placeholder="Contoh: Headphone Wireless" />
                    </Field>
                    <Field label="Deskripsi" error={errors.description?.message}>
                        <textarea {...form.register('description')} rows={7} className={`${inputClass} h-auto py-3`} placeholder="Jelaskan spesifikasi dan keunggulan produk." />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Harga (Rp)" error={errors.price?.message}>
                            <input {...form.register('price')} inputMode="decimal" className={inputClass} placeholder="150000" />
                        </Field>
                        <Field label="Stok" error={errors.stock?.message}>
                            <input {...form.register('stock')} inputMode="numeric" className={inputClass} placeholder="20" />
                        </Field>
                    </div>
                    <Field label="Kategori" error={errors.category_id?.message}>
                        <select {...form.register('category_id')} className={inputClass}>
                            <option value="">Pilih kategori</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </Field>
                    {serverError && <p role="alert" className="text-sm text-red-600">{serverError}</p>}
                </div>

                <div>
                    <p className="text-xs font-semibold text-[#344054]">Foto produk</p>
                    <p className="mt-1 text-[11px] leading-5 text-[#8A95A5]">JPG, PNG, atau WebP. Maksimal 5 MB per file dan 5 gambar.</p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        {product?.images.filter((image) => !removeImages.includes(image.id)).map((image) => (
                            <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg border border-[#E5E8EE]">
                                <img src={image.url} alt="Foto produk" className="h-full w-full object-cover" />
                                <button type="button" aria-label="Hapus foto produk" onClick={() => form.setValue('remove_images', [...removeImages, image.id], { shouldDirty: true })} className="absolute top-1 right-1 flex size-7 items-center justify-center rounded-full bg-white/90 text-red-600 shadow">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        {previews.map((preview, index) => (
                            <div key={`${preview}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border border-[#E5E8EE]">
                                <img src={preview} alt={`Pratinjau foto ${index + 1}`} className="h-full w-full object-cover" />
                                <button type="button" aria-label={`Hapus pratinjau ${index + 1}`} onClick={() => form.setValue('images', selectedFiles.filter((_, fileIndex) => fileIndex !== index), { shouldValidate: true })} className="absolute top-1 right-1 flex size-7 items-center justify-center rounded-full bg-white/90 text-red-600 shadow">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        {(!product || product.images.filter((image) => !removeImages.includes(image.id)).length + previews.length < 5) && (
                            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#C5CEDA] text-[#526B91] hover:bg-[#F8F9FC]">
                                <ImagePlus size={20} />
                                <span className="mt-1 text-[10px] font-semibold">Tambah</span>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    className="sr-only"
                                    onChange={(event) => {
                                        const files = Array.from(event.target.files ?? []);
                                        form.setValue('images', [...selectedFiles, ...files].slice(0, 5), { shouldValidate: true });
                                        event.target.value = '';
                                    }}
                                />
                            </label>
                        )}
                    </div>
                    {errors.images?.message && <p className="mt-2 text-xs text-red-600">{errors.images.message}</p>}
                    {errors.images?.root?.message && <p className="mt-2 text-xs text-red-600">{errors.images.root.message}</p>}
                </div>
            </div>
            <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#E5E8EE] px-5 py-4 sm:flex-row sm:px-7">
                <a href="/admin/products" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#E2E6EE] px-4 text-xs font-semibold text-[#526B91] hover:bg-[#F8F9FC]">
                    <ArrowLeft size={15} /> Kembali
                </a>
                <button type="submit" disabled={submitting} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-5 text-xs font-semibold text-white hover:bg-[#314D73] disabled:opacity-60">
                    {submitting ? <LoaderCircle size={15} className="animate-spin" /> : <ImagePlus size={15} />}
                    {product ? 'Simpan perubahan' : 'Buat produk'}
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

export default AdminProductForm;
