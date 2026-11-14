import { router } from '@inertiajs/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ProfileData } from '../types';

const profileSchema = z.object({
    name: z.string().trim().min(2, 'Nama minimal 2 karakter.').max(255),
    email: z.email('Format email tidak valid.').max(255),
    phone: z.string().max(20, 'Nomor telepon maksimal 20 karakter.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm = ({ profile }: { profile: ProfileData }) => {
    const [saved, setSaved] = useState(false);
    const {
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<z.input<typeof profileSchema>, unknown, ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
        },
    });

    useEffect(() => {
        reset({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
        });
    }, [profile.name, profile.email, profile.phone, reset]);

    const submitProfile: SubmitHandler<ProfileFormValues> = (values) => {
        setSaved(false);
        router.put('/profile', values, {
            preserveScroll: true,
            preserveState: true,
            onError: (serverErrors) => {
                Object.entries(serverErrors).forEach(([field, message]) => {
                    if (
                        field === 'name' ||
                        field === 'email' ||
                        field === 'phone'
                    ) {
                        setError(field, { message });
                    }
                });
            },
            onSuccess: () => {
                reset(values);
                setSaved(true);
            },
        });
    };

    const fieldClass =
        'mt-1.5 h-11 w-full rounded-lg border border-[#E2E6ED] bg-white px-3.5 text-sm text-[#203452] outline-none transition placeholder:text-[#98A2B3] focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10 disabled:bg-[#F8F9FC]';

    return (
        <form onSubmit={handleSubmit(submitProfile)} className="mt-6">
            {saved && (
                <div
                    role="status"
                    className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800"
                >
                    <Check size={17} />
                    Informasi profil berhasil diperbarui.
                </div>
            )}

            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-[#203452]">
                    Nama Lengkap
                    <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <input
                                {...field}
                                autoComplete="name"
                                disabled={isSubmitting}
                                className={fieldClass}
                                aria-invalid={Boolean(errors.name)}
                                onChange={(event) => {
                                    field.onChange(event);
                                    clearErrors('name');
                                }}
                            />
                        )}
                    />
                    {errors.name && (
                        <FieldError message={errors.name.message} />
                    )}
                </label>
                <label className="block text-sm font-semibold text-[#203452]">
                    Email Address
                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <input
                                {...field}
                                type="email"
                                autoComplete="email"
                                disabled={isSubmitting}
                                className={fieldClass}
                                aria-invalid={Boolean(errors.email)}
                                onChange={(event) => {
                                    field.onChange(event);
                                    clearErrors('email');
                                }}
                            />
                        )}
                    />
                    {errors.email && (
                        <FieldError message={errors.email.message} />
                    )}
                </label>
                <label className="block text-sm font-semibold text-[#203452] sm:col-span-2">
                    Nomor Telepon
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <input
                                {...field}
                                type="tel"
                                autoComplete="tel"
                                disabled={isSubmitting}
                                placeholder="Tambahkan nomor telepon (opsional)"
                                className={fieldClass}
                                aria-invalid={Boolean(errors.phone)}
                                onChange={(event) => {
                                    field.onChange(event);
                                    clearErrors('phone');
                                }}
                            />
                        )}
                    />
                    <span className="mt-1.5 block text-xs font-normal text-[#98A2B3]">
                        Digunakan untuk informasi terkait pesanan Anda.
                    </span>
                    {errors.phone && (
                        <FieldError message={errors.phone.message} />
                    )}
                </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#E2E6ED] pt-5 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={() => {
                        reset();
                        clearErrors();
                        setSaved(false);
                    }}
                    disabled={isSubmitting}
                    className="min-h-11 rounded-lg border border-[#E2E6ED] bg-white px-4 text-sm font-semibold text-[#526B91] transition hover:bg-[#F8F9FC] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#203452] px-5 text-sm font-semibold text-white transition hover:bg-[#314D73] disabled:cursor-not-allowed disabled:opacity-55"
                >
                    {isSubmitting ? (
                        <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                        <Check size={16} />
                    )}
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </form>
    );
};

const FieldError = ({ message }: { message?: string }) =>
    message ? (
        <span className="mt-1.5 flex items-center gap-1.5 text-xs font-normal text-red-600">
            <AlertCircle size={14} />
            {message}
        </span>
    ) : null;

export default ProfileForm;
