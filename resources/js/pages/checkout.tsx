import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import Navbar from '@/components/navbar';
import Breadcrumb from '@/features/Checkout/components/breadcrumb';
import HeadingCheckout from '@/features/Checkout/components/HeadingCheckout';
import EmptyCheckout from '@/features/Checkout/components/EmptyCheckout';
import CheckoutContent from '@/features/Checkout/components/CheckoutContent';
import type { CourierOption } from '@/features/Checkout/components/CourierSelector';
import { Address, CheckoutItem } from '@/types/types';

type CheckoutProps = {
    items: CheckoutItem[];
    address: Address | null;
    couriers: CourierOption[];
};

type CheckoutResponse = {
    message?: string;
    data?: {
        order_number?: string;
        snap_token?: string;
    };
};

type PaymentConfirmationResponse = {
    message?: string;
};

const CheckoutPage = ({
    items,
    address: addressServer,
    couriers,
}: CheckoutProps) => {
    const [address, setAddress] = useState<Address | null>(addressServer);
    const [selectedCourierId, setSelectedCourierId] = useState<number | null>(
        couriers[0]?.id ?? null,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const subtotal = useMemo(
        () =>
            items.reduce(
                (total, item) =>
                    total +
                    Math.round(Number(item.product.price)) * item.quantity,
                0,
            ),
        [items],
    );

    const selectedCourier = couriers.find(
        (courier) => courier.id === selectedCourierId,
    );
    const shippingCost = selectedCourier?.shippingCost ?? 0;
    const total = subtotal + shippingCost;

    const handleCheckout = async () => {
        if (!address || !selectedCourier || isSubmitting) return;

        setIsSubmitting(true);
        setCheckoutError(null);

        try {
            if (!window.snap) {
                throw new Error(
                    'Layanan pembayaran belum siap. Silakan coba lagi.',
                );
            }

            const csrfToken = document.querySelector<HTMLMetaElement>(
                'meta[name="csrf-token"]',
            )?.content;
            const response = await fetch('/checkout/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken ?? '',
                },
                body: JSON.stringify({
                    shipping_address: address.address,
                    courier_id: selectedCourier.id,
                    items: items.map((item) => ({
                        product_id: item.product.id,
                        quantity: item.quantity,
                    })),
                }),
            });

            let data: CheckoutResponse;
            try {
                data = (await response.json()) as CheckoutResponse;
            } catch {
                throw new Error(
                    'Server tidak memberikan respons pembayaran yang valid. Silakan coba lagi.',
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.message ?? 'Pesanan tidak dapat diproses.',
                );
            }
            if (!data.data?.snap_token || !data.data.order_number) {
                throw new Error(
                    'Informasi pembayaran tidak lengkap. Silakan coba lagi.',
                );
            }
            const snapToken = data.data.snap_token;
            const orderNumber = data.data.order_number;

            window.snap.pay(snapToken, {
                onSuccess: async () => {
                    try {
                        const confirmationResponse = await fetch(
                            '/checkout/confirm-payment',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json',
                                    'X-CSRF-TOKEN': csrfToken ?? '',
                                },
                                body: JSON.stringify({
                                    order_number: orderNumber,
                                }),
                            },
                        );
                        const confirmation =
                            (await confirmationResponse.json()) as PaymentConfirmationResponse;

                        if (!confirmationResponse.ok) {
                            throw new Error(
                                confirmation.message ??
                                    'Pembayaran berhasil, tetapi status pesanan belum dapat diperbarui. Silakan muat ulang beberapa saat lagi.',
                            );
                        }

                        router.visit(
                            `/checkout/payment/${encodeURIComponent(orderNumber)}`,
                        );
                    } catch (error) {
                        setCheckoutError(
                            error instanceof Error
                                ? error.message
                                : 'Pembayaran berhasil, tetapi status pesanan belum dapat diperbarui. Silakan muat ulang beberapa saat lagi.',
                        );
                        setIsSubmitting(false);
                    }
                },
                onPending: () =>
                    router.visit(
                        `/checkout/payment/${encodeURIComponent(orderNumber)}`,
                    ),
                onError: () => {
                    setCheckoutError(
                        'Pembayaran belum berhasil. Pesanan tetap tersimpan dan bisa dicoba kembali.',
                    );
                    setIsSubmitting(false);
                },
                onClose: () => {
                    router.visit(
                        `/checkout/payment/${encodeURIComponent(orderNumber)}`,
                    );
                },
            });
        } catch (error) {
            setCheckoutError(
                error instanceof Error
                    ? error.message
                    : 'Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.',
            );
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F8F9FC]">
            <Navbar activePage="cart" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <Breadcrumb />

                {/* Heading */}
                <HeadingCheckout />

                {items.length === 0 ? (
                    <EmptyCheckout />
                ) : (
                    <CheckoutContent
                        setAddress={setAddress}
                        couriers={couriers}
                        selectedCourierId={selectedCourierId}
                        setSelectedCourierId={setSelectedCourierId}
                        courierName={selectedCourier?.name ?? null}
                        address={address}
                        handleCheckout={handleCheckout}
                        isSubmitting={isSubmitting}
                        checkoutError={checkoutError}
                        items={items}
                        shippingCost={shippingCost}
                        subtotal={subtotal}
                        total={total}
                    />
                )}
            </div>
        </main>
    );
};

export default CheckoutPage;
