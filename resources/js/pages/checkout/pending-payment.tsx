import Navbar from "@/components/navbar";
import { formatPrice } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    LoaderCircle,
    XCircle,
} from "lucide-react";
import { useState } from "react";

type Props = {
    orderNumber: string;
    amount: number;
    snapToken: string | null;
    paymentStatus: "pending" | "success" | "failed" | "expired" | "canceled";
};

type ActionResponse = {
    message?: string;
    status?: Props["paymentStatus"];
};

const PendingPaymentPage = ({
    orderNumber,
    amount,
    snapToken,
    paymentStatus: initialStatus,
}: Props) => {
    const [paymentStatus, setPaymentStatus] = useState(initialStatus);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const getCsrfToken = () =>
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.content ?? "";

    const confirmPayment = async () => {
        const response = await fetch("/checkout/confirm-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-TOKEN": getCsrfToken(),
            },
            body: JSON.stringify({ order_number: orderNumber }),
        });
        const result = (await response.json()) as ActionResponse;

        if (!response.ok) {
            throw new Error(
                result.message ?? "Status pembayaran belum dapat dikonfirmasi.",
            );
        }

        setPaymentStatus("success");
        setMessage(
            "Pembayaran berhasil dikonfirmasi. Pesanan sedang diproses.",
        );
    };

    const continuePayment = () => {
        if (!snapToken || !window.snap || isSubmitting) return;

        setIsSubmitting(true);
        setMessage(null);

        window.snap.pay(snapToken, {
            onSuccess: () => {
                void confirmPayment()
                    .catch((error: unknown) => {
                        setMessage(
                            error instanceof Error
                                ? error.message
                                : "Pembayaran berhasil, tetapi status belum dapat diperbarui.",
                        );
                    })
                    .finally(() => setIsSubmitting(false));
            },
            onPending: () => {
                setMessage("Pembayaran masih menunggu konfirmasi.");
                setIsSubmitting(false);
            },
            onError: () => {
                setMessage("Pembayaran belum berhasil. Silakan coba lagi.");
                setIsSubmitting(false);
            },
            onClose: () => {
                setMessage(
                    "Pembayaran belum selesai. Kamu bisa melanjutkan kapan saja.",
                );
                setIsSubmitting(false);
            },
        });
    };

    const cancelPayment = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch(
                `/checkout/payment/${encodeURIComponent(orderNumber)}/cancel`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN": getCsrfToken(),
                    },
                },
            );
            const result = (await response.json()) as ActionResponse;

            if (result.status === "success") {
                setPaymentStatus("success");
                setMessage(
                    result.message ??
                        "Pembayaran sudah berhasil. Pesanan tidak dibatalkan.",
                );
                return;
            }

            if (!response.ok) {
                throw new Error(
                    result.message ??
                        "Transaksi gagal dibatalkan. Silakan coba lagi.",
                );
            }

            setPaymentStatus(result.status ?? "canceled");
            setMessage(result.message ?? "Transaksi berhasil dibatalkan.");
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan. Silakan coba lagi.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const isPending = paymentStatus === "pending";

    return (
        <main className="min-h-screen bg-[#F8F9FC]">
            <Navbar activePage="cart" />

            <div className="mx-auto flex max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
                <section className="w-full rounded-2xl border border-[#E2E6ED] bg-white p-6 text-center shadow-sm sm:p-10">
                    <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[#F0F3F8] text-[#526B91]">
                        {paymentStatus === "success" ? (
                            <CheckCircle2 size={32} />
                        ) : isPending ? (
                            <CreditCard size={30} />
                        ) : (
                            <XCircle size={32} />
                        )}
                    </div>

                    <h1 className="font-playfair text-2xl font-bold text-[#203452] sm:text-3xl">
                        {paymentStatus === "success"
                            ? "Pembayaran Berhasil"
                            : isPending
                              ? "Pembayaran Belum Selesai"
                              : "Transaksi Dibatalkan"}
                    </h1>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#718096]">
                        {paymentStatus === "success"
                            ? "Pembayaranmu sudah dikonfirmasi dan pesanan sedang diproses."
                            : isPending
                              ? "Kamu menutup halaman pembayaran. Transaksi masih tersimpan dan bisa dilanjutkan atau dibatalkan."
                              : "Transaksi ini sudah tidak aktif. Kamu bisa kembali ke beranda."}
                    </p>

                    <div className="mx-auto mt-7 max-w-md rounded-xl border border-[#E2E6ED] bg-[#F8F9FC] p-4 text-left">
                        <div className="flex justify-between gap-4 text-sm">
                            <span className="text-[#98A2B3]">
                                Nomor Pesanan
                            </span>
                            <span className="font-semibold text-[#203452]">
                                {orderNumber}
                            </span>
                        </div>
                        <div className="mt-3 flex justify-between gap-4 text-sm">
                            <span className="text-[#98A2B3]">
                                Total Pembayaran
                            </span>
                            <span className="font-bold text-[#203452]">
                                {formatPrice(amount)}
                            </span>
                        </div>
                    </div>

                    {message && (
                        <div
                            role="alert"
                            className={`mx-auto mt-5 flex max-w-md items-start gap-2 rounded-xl border p-3 text-left text-sm ${
                                paymentStatus === "success"
                                    ? "border-green-200 bg-green-50 text-green-700"
                                    : "border-amber-200 bg-amber-50 text-amber-800"
                            }`}
                        >
                            <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />
                            <p>{message}</p>
                        </div>
                    )}

                    <div className="mx-auto mt-7 flex max-w-md justify-center flex-col gap-3 sm:flex-row">
                        {isPending && (
                            <>
                                <button
                                    type="button"
                                    onClick={continuePayment}
                                    disabled={isSubmitting || !snapToken}
                                    className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#203452] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#314D73] disabled:cursor-not-allowed cursor-pointer disabled:opacity-60 text-nowrap"
                                >
                                    {isSubmitting ? (
                                        <LoaderCircle
                                            size={17}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <CreditCard size={17} />
                                    )}
                                    Lanjutkan Pembayaran
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelPayment}
                                    disabled={isSubmitting}
                                    className="min-h-12 flex-1 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 text-nowrap cursor-pointer"
                                >
                                    Batalkan Transaksi
                                </button>
                            </>
                        )}
                        <Link
                            href="/"
                            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#E2E6ED] bg-white px-4 py-3 text-sm font-semibold text-[#526B91] transition hover:bg-[#F1F3F7] text-nowrap cursor-pointer"
                        >
                            <ArrowLeft size={17} />
                            Kembali ke Beranda
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default PendingPaymentPage;
