import { Address } from '@/types/types';
import { AnimatePresence, motion } from 'motion/react';
import { FC, useEffect, useState } from 'react';
import {
    AlertCircle,
    MapPin,
    X,
    User,
    Phone,
    MapPinned,
    Building2,
    Hash,
    LoaderCircle,
} from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formAddress, TypeFormAddress } from '../form';

type Props = {
    address: Address | null;
    setAddress: (v: Address | null) => void;
    onAddAddress?: (address: TypeFormAddress) => void | Promise<void>;
};

const ShippingAddress: FC<Props> = ({ address, onAddAddress, setAddress }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { register, handleSubmit } = useForm<TypeFormAddress>({
        resolver: zodResolver(formAddress),
        defaultValues: {
            address: address?.address ?? '',
            city: address?.city ?? '',
            phone: address?.phone ?? '',
            postal_code: address?.postal_code ?? '',
            province: address?.province ?? '',
            recipient_name: address?.recipient_name ?? '',
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const closeModal = () => {
        if (isSubmitting) return;
        setIsModalOpen(false);
        setSubmitError(null);
    };

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        if (isModalOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isModalOpen, isSubmitting]);

    const handleSubmitAddress: SubmitHandler<TypeFormAddress> = async (
        dataForm,
    ) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            if (onAddAddress) {
                await onAddAddress(dataForm);
            }
            const csrfToken = document.querySelector<HTMLMetaElement>(
                'meta[name="csrf-token"]',
            )?.content;
            const response = await fetch('/user/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken ?? '',
                },
                body: JSON.stringify(dataForm),
            });

            let data: {
                message?: string;
                errors?: Record<string, string | string[]>;
            };
            try {
                data = (await response.json()) as {
                    message?: string;
                    errors?: Record<string, string | string[]>;
                };
            } catch {
                throw new Error(
                    'Server tidak memberikan respons yang valid. Silakan coba lagi.',
                );
            }

            const serverErrors = Object.values(data.errors ?? {}).flat();

            if (
                !response.ok ||
                serverErrors.length > 0 ||
                data.message !== 'Successfully update address.'
            ) {
                setSubmitError(
                    serverErrors.length > 0
                        ? serverErrors.join(' ')
                        : (data.message ??
                              'Alamat gagal disimpan. Silakan coba lagi.'),
                );
                return;
            }

            setAddress(dataForm);
            setIsModalOpen(false);
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : 'Terjadi kesalahan saat menyimpan alamat. Silakan coba lagi.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        'w-full rounded-lg border border-[#E2E6ED] bg-white px-4 py-3 text-sm text-[#203452] outline-none transition placeholder:text-[#A0A8B5] focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10';

    return (
        <>
            <section className="rounded-2xl border border-[#E2E6ED] bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-[#F0F3F8] p-2.5 text-[#203452]">
                            <MapPin size={19} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-[#203452]">
                                Alamat Pengiriman
                            </h2>
                            <p className="mt-0.5 text-xs text-[#98A2B3]">
                                Tujuan pengiriman pesananmu
                            </p>
                        </div>
                    </div>

                    {address && (
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="text-sm font-semibold text-[#526B91] transition hover:text-[#203452]"
                        >
                            Ubah
                        </button>
                    )}
                </div>

                {address ? (
                    <div className="rounded-xl border border-[#E2E6ED] bg-[#F8F9FC] p-4">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-[#203452]">
                                {address.recipient_name}
                            </span>

                            <span className="text-xs text-[#98A2B3]">
                                {address.phone}
                            </span>

                            <span className="rounded-md bg-[#203452] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                                Utama
                            </span>
                        </div>

                        <p className="text-sm leading-relaxed text-[#526B91]">
                            {address.address}, {address.city},{' '}
                            {address.province}, {address.postal_code}
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-[#E2E6ED] p-6 text-center">
                        <MapPin
                            size={24}
                            className="mx-auto mb-2 text-[#98A2B3]"
                        />

                        <p className="text-sm font-semibold text-[#203452]">
                            Belum ada alamat pengiriman
                        </p>

                        <p className="mt-1 text-xs text-[#98A2B3]">
                            Tambahkan alamat untuk melanjutkan pesanan.
                        </p>

                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="mt-3 text-sm font-semibold text-[#526B91] transition hover:text-[#203452]"
                        >
                            + Tambah Alamat
                        </button>
                    </div>
                )}
            </section>

            {/* Address Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) {
                                closeModal();
                            }
                        }}
                        className="fixed inset-0 z-[100] flex h-screen items-center justify-center overflow-y-auto bg-[#142238]/50 p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 24, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.97 }}
                            transition={{
                                duration: 0.25,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="address-modal-title"
                            className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-[#E2E6ED] bg-white shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="flex items-start justify-between border-b border-[#E2E6ED] px-5 py-5 sm:px-7">
                                <div>
                                    <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-[#F0F3F8] text-[#203452]">
                                        <MapPinned size={20} />
                                    </div>

                                    <h2
                                        id="address-modal-title"
                                        className="font-serif text-2xl font-semibold text-[#203452]"
                                    >
                                        {address
                                            ? 'Ubah Alamat'
                                            : 'Tambah Alamat Baru'}
                                    </h2>

                                    <p className="mt-1 text-xs text-[#98A2B3]">
                                        Lengkapi informasi alamat pengirimanmu.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                    className="rounded-lg p-2 text-[#98A2B3] transition hover:bg-[#F1F3F7] hover:text-[#203452]"
                                    aria-label="Tutup modal"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleSubmit(handleSubmitAddress)}>
                                <div className="max-h-[65vh] space-y-5 overflow-y-auto px-5 py-6 sm:px-7">
                                    {submitError && (
                                        <div
                                            role="alert"
                                            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
                                        >
                                            <AlertCircle
                                                size={19}
                                                className="mt-0.5 shrink-0 text-red-600"
                                            />
                                            <p className="text-sm leading-relaxed text-red-600">
                                                {submitError}
                                            </p>
                                        </div>
                                    )}

                                    {/* Recipient */}
                                    <div>
                                        <label
                                            htmlFor="recipient_name"
                                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#203452]"
                                        >
                                            <User size={15} />
                                            Nama Penerima
                                        </label>

                                        <input
                                            id="recipient_name"
                                            type="text"
                                            required
                                            autoFocus
                                            maxLength={100}
                                            placeholder="Nama lengkap penerima"
                                            className={inputClass}
                                            {...register('recipient_name')}
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#203452]"
                                        >
                                            <Phone size={15} />
                                            Nomor Telepon
                                        </label>

                                        <input
                                            id="phone"
                                            type="tel"
                                            required
                                            maxLength={20}
                                            placeholder="Contoh: 081234567890"
                                            className={inputClass}
                                            {...register('phone')}
                                        />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label
                                            htmlFor="address"
                                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#203452]"
                                        >
                                            <MapPin size={15} />
                                            Alamat Lengkap
                                        </label>

                                        <textarea
                                            id="address"
                                            required
                                            rows={3}
                                            maxLength={500}
                                            placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, dan detail lainnya"
                                            className={`${inputClass} resize-none`}
                                            {...register('address')}
                                        />
                                    </div>

                                    {/* City & Province */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="city"
                                                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#203452]"
                                            >
                                                <Building2 size={15} />
                                                Kota / Kabupaten
                                            </label>

                                            <input
                                                id="city"
                                                type="text"
                                                required
                                                maxLength={100}
                                                placeholder="Contoh: Jakarta Selatan"
                                                className={inputClass}
                                                {...register('city')}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="province"
                                                className="mb-2 block text-sm font-semibold text-[#203452]"
                                            >
                                                Provinsi
                                            </label>

                                            <input
                                                id="province"
                                                type="text"
                                                required
                                                maxLength={100}
                                                placeholder="Contoh: DKI Jakarta"
                                                className={inputClass}
                                                {...register('province')}
                                            />
                                        </div>
                                    </div>

                                    {/* Postal Code */}
                                    <div>
                                        <label
                                            htmlFor="postal_code"
                                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#203452]"
                                        >
                                            <Hash size={15} />
                                            Kode Pos
                                        </label>

                                        <input
                                            id="postal_code"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]{5}"
                                            required
                                            maxLength={5}
                                            placeholder="Contoh: 12345"
                                            className={inputClass}
                                            {...register('postal_code')}
                                        />
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex flex-col-reverse gap-3 border-t border-[#E2E6ED] bg-[#F8F9FB] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={isSubmitting}
                                        className="rounded-lg border border-[#E2E6ED] bg-white px-5 py-3 text-sm font-semibold text-[#526B91] transition hover:bg-[#F1F3F7] disabled:opacity-50"
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#203452] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#314D73] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <LoaderCircle
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            'Simpan Alamat'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ShippingAddress;
