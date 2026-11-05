import { useMemo } from "react";
import { router } from "@inertiajs/react";
import Navbar from "@/components/navbar";
import {
    MapPin,
    Package,
    CreditCard,
    ShieldCheck,
    ChevronRight,
    Truck,
    CheckCircle2,
    ShoppingBag,
} from "lucide-react";
import { ProductType } from "@/features/ProductDetail/types/products";
import { formatPrice } from "@/lib/utils";

type CheckoutItem = {
    id: number;
    quantity: number;
    subtotal: number;
    product: ProductType;
};

type Address = {
    recipient_name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
};

type CheckoutProps = {
    items: CheckoutItem[];
    address: Address | null;
};

const CheckoutPage = ({ items, address }: CheckoutProps) => {
    const subtotal = useMemo(
        () =>
            items.reduce(
                (total, item) =>
                    total + Number(item.product.price) * item.quantity,
                0,
            ),
        [items],
    );

    // Ongkir sementara, nantinya bisa dihubungkan ke perhitungan ongkir.
    const shippingCost = items.length > 0 ? 15000 : 0;
    const total = subtotal + shippingCost;

    const handleCheckout = () => {
        router.post("/checkout", {
            items: items.map((item) => ({
                cart_item_id: item.id,
                quantity: item.quantity,
            })),
        });
    };

    return (
        <main className="min-h-screen bg-[#F8F9FC]">
            <Navbar activePage="cart" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm text-[#98A2B3]">
                    <span>Keranjang</span>
                    <ChevronRight size={15} />
                    <span className="font-semibold text-[#203452]">
                        Checkout
                    </span>
                </div>

                {/* Heading */}
                <div className="mb-8">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#526B91]">
                        Almost yours
                    </p>
                    <h1 className="font-playfair text-3xl font-bold text-[#203452] sm:text-4xl">
                        Checkout
                    </h1>
                    <p className="mt-2 text-sm text-[#98A2B3]">
                        Periksa kembali pesanan dan informasi pengirimanmu.
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="rounded-2xl border border-[#E2E6ED] bg-white px-6 py-16 text-center shadow-sm">
                        <ShoppingBag
                            size={42}
                            className="mx-auto mb-4 text-[#98A2B3]"
                        />
                        <h2 className="font-playfair text-xl font-bold text-[#203452]">
                            Belum ada produk
                        </h2>
                        <p className="mt-2 text-sm text-[#98A2B3]">
                            Pilih produk dari keranjang sebelum melanjutkan
                            checkout.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_380px]">
                        {/* Left Content */}
                        <div className="space-y-5">
                            {/* Shipping Address */}
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

                                    <button
                                        type="button"
                                        className="text-sm font-semibold text-[#526B91] transition hover:text-[#203452]"
                                    >
                                        Ubah
                                    </button>
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
                                            <span className="rounded-md bg-[#203452] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                                Utama
                                            </span>
                                        </div>

                                        <p className="text-sm leading-relaxed text-[#526B91]">
                                            {address.address}, {address.city},{" "}
                                            {address.province},{" "}
                                            {address.postal_code}
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
                                            Tambahkan alamat untuk melanjutkan
                                            pesanan.
                                        </p>
                                        <button
                                            type="button"
                                            className="mt-3 text-sm font-semibold text-[#526B91] hover:text-[#203452]"
                                        >
                                            + Tambah Alamat
                                        </button>
                                    </div>
                                )}
                            </section>

                            {/* Products */}
                            <section className="rounded-2xl border border-[#E2E6ED] bg-white p-5 shadow-sm sm:p-6">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="rounded-xl bg-[#F0F3F8] p-2.5 text-[#203452]">
                                        <Package size={19} />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-[#203452]">
                                            Produk Pesanan
                                        </h2>
                                        <p className="mt-0.5 text-xs text-[#98A2B3]">
                                            {items.length} produk dipilih
                                        </p>
                                    </div>
                                </div>

                                <div className="divide-y divide-[#E2E6ED]">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 py-4 first:pt-0 last:pb-0"
                                        >
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F8F9FC]">
                                                {item.product
                                                    .product_images[0] ? (
                                                    <img
                                                        src={
                                                            item.product
                                                                .product_images[0]
                                                                .image
                                                        }
                                                        alt={item.product.name}
                                                        className="h-full w-full object-contain p-2"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-[#98A2B3]">
                                                        <Package size={27} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex min-w-0 flex-1 flex-col justify-center">
                                                <h3 className="line-clamp-2 text-sm font-semibold text-[#203452]">
                                                    {item.product.name}
                                                </h3>
                                                <p className="mt-1 text-xs text-[#98A2B3]">
                                                    Jumlah: {item.quantity}
                                                </p>
                                                <p className="mt-2 text-sm font-bold text-[#203452]">
                                                    {formatPrice(
                                                        Number(
                                                            item.product.price,
                                                        ) * item.quantity,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="rounded-2xl border border-[#E2E6ED] bg-white p-5 shadow-sm sm:p-6">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="rounded-xl bg-[#F0F3F8] p-2.5 text-[#203452]">
                                        <CreditCard size={19} />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-[#203452]">
                                            Metode Pembayaran
                                        </h2>
                                        <p className="mt-0.5 text-xs text-[#98A2B3]">
                                            Pembayaran aman melalui Midtrans
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 rounded-xl border-2 border-[#203452] bg-[#F8F9FC] p-4">
                                    <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                                        <span className="text-lg font-black italic tracking-tight text-[#203452]">
                                            mid
                                            <span className="text-[#526B91]">
                                                trans
                                            </span>
                                        </span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-sm font-semibold text-[#203452]">
                                                Midtrans Payment
                                            </p>
                                            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                                SANDBOX
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-[#98A2B3]">
                                            Transfer bank, e-wallet, QRIS, dan
                                            lainnya.
                                        </p>
                                    </div>

                                    <CheckCircle2
                                        size={21}
                                        className="shrink-0 text-[#203452]"
                                    />
                                </div>

                                <div className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-[#98A2B3]">
                                    <ShieldCheck
                                        size={16}
                                        className="mt-0.5 shrink-0 text-[#526B91]"
                                    />
                                    <p>
                                        Transaksi diproses melalui sistem
                                        pembayaran Midtrans yang aman.
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Right Summary */}
                        <aside className="lg:sticky lg:top-24">
                            <section className="rounded-2xl border border-[#E2E6ED] bg-white p-5 shadow-sm sm:p-6">
                                <h2 className="font-playfair text-xl font-bold text-[#203452]">
                                    Ringkasan Pesanan
                                </h2>

                                <p className="mt-1 text-xs text-[#98A2B3]">
                                    Detail pembayaran pesananmu
                                </p>

                                <div className="mt-6 space-y-3 border-b border-[#E2E6ED] pb-5 text-sm">
                                    <div className="flex justify-between gap-3">
                                        <span className="text-[#98A2B3]">
                                            Total produk
                                        </span>
                                        <span className="font-medium text-[#203452]">
                                            {items.reduce(
                                                (sum, item) =>
                                                    sum + item.quantity,
                                                0,
                                            )}{" "}
                                            item
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-3">
                                        <span className="text-[#98A2B3]">
                                            Subtotal
                                        </span>
                                        <span className="font-medium text-[#203452]">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-3">
                                        <span className="flex items-center gap-1.5 text-[#98A2B3]">
                                            <Truck size={15} />
                                            Ongkos kirim
                                        </span>
                                        <span className="font-medium text-[#203452]">
                                            {formatPrice(shippingCost)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3 py-5">
                                    <span className="text-sm font-semibold text-[#203452]">
                                        Total Pembayaran
                                    </span>
                                    <span className="text-xl font-bold text-[#203452]">
                                        {formatPrice(total)}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCheckout}
                                    disabled={!address || items.length === 0}
                                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#203452] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#526B91] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Buat Pesanan
                                    <ChevronRight size={17} />
                                </button>

                                <p className="mt-4 text-center text-[11px] leading-relaxed text-[#98A2B3]">
                                    Dengan melanjutkan, kamu menyetujui
                                    ketentuan pembelian dan kebijakan layanan
                                    AwanMart.
                                </p>
                            </section>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#98A2B3]">
                                <ShieldCheck size={15} />
                                Pembayaran aman dan terpercaya
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
};

export default CheckoutPage;
