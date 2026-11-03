import { useMemo, useState } from "react";
import { Link, router } from "@inertiajs/react";
import Navbar from "@/components/navbar";
import { formatPrice } from "@/lib/utils";
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    ArrowRight,
    ArrowLeft,
    ShieldCheck,
    Truck,
} from "lucide-react";

type CartItem = {
    id: number;
    name: string;
    category: string;
    image: string;
    price: number;
    stock: number;
    quantity: number;
    selected: boolean;
};

const initialCart: CartItem[] = [
    {
        id: 1,
        name: "MacBook Air M2",
        category: "Laptop",
        image: "/image/macbook-air-m2.webp",
        price: 15000000,
        stock: 12,
        quantity: 1,
        selected: true,
    },
    {
        id: 2,
        name: "Logitech MX Master 3S",
        category: "Aksesoris",
        image: "/image/logitech-mx-master-3s.webp",
        price: 1450000,
        stock: 8,
        quantity: 2,
        selected: true,
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        category: "Audio",
        image: "/image/sony-wh-1000xm5.webp",
        price: 4999000,
        stock: 5,
        quantity: 1,
        selected: false,
    },
];

const CartPage = () => {
    const [cart, setCart] = useState<CartItem[]>(initialCart);

    // Derived data
    const selectedItems = useMemo(
        () => cart.filter((item) => item.selected),
        [cart],
    );

    const selectedCount = useMemo(
        () => selectedItems.reduce((total, item) => total + item.quantity, 0),
        [selectedItems],
    );

    const subtotal = useMemo(
        () =>
            selectedItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0,
            ),
        [selectedItems],
    );

    const allSelected = cart.length > 0 && cart.every((item) => item.selected);

    // Toggle individual product
    const toggleItem = (id: number) => {
        setCart((current) =>
            current.map((item) =>
                item.id === id ? { ...item, selected: !item.selected } : item,
            ),
        );
    };

    // Toggle all products
    const toggleSelectAll = () => {
        setCart((current) =>
            current.map((item) => ({
                ...item,
                selected: !allSelected,
            })),
        );
    };

    // Update quantity
    const updateQuantity = (id: number, amount: number) => {
        setCart((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantity: Math.min(
                              item.stock,
                              Math.max(1, item.quantity + amount),
                          ),
                      }
                    : item,
            ),
        );
    };

    // Remove product
    const removeItem = (id: number) => {
        setCart((current) => current.filter((item) => item.id !== id));
    };

    // Remove selected products
    const removeSelected = () => {
        setCart((current) => current.filter((item) => !item.selected));
    };

    // Checkout selected products
    const handleCheckout = () => {
        if (selectedItems.length === 0) return;

        const checkoutItems = selectedItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
        }));

        // TODO: Ganti URL sesuai route checkout Laravel.
        // Harga harus dihitung ulang oleh backend.
        router.post("/checkout", {
            items: checkoutItems,
        });
    };

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <main className="min-h-screen bg-[#FAFAFC] text-[#203452]">
            <Navbar activePage="cart" />

            <section className="mx-auto max-w-360 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
                {/* Breadcrumb */}
                <div className="mb-8 flex items-center gap-2 text-sm text-[#667085]">
                    <Link href="/" className="transition hover:text-[#203452]">
                        Beranda
                    </Link>
                    <span>/</span>
                    <span className="font-medium text-[#203452]">
                        Keranjang
                    </span>
                </div>

                {/* Heading */}
                <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#526B91]">
                            Your Shopping Cart
                        </p>

                        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                            Keranjang Belanja
                        </h1>

                        <p className="mt-3 text-sm text-[#667085] sm:text-base">
                            Periksa kembali produk pilihanmu sebelum melanjutkan
                            pembelian.
                        </p>
                    </div>

                    <p className="text-sm font-medium text-[#667085]">
                        {totalItems} produk dalam keranjang
                    </p>
                </div>

                {cart.length > 0 ? (
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_380px]">
                        {/* Cart Content */}
                        <div className="overflow-hidden rounded-xl border border-[#E2E6ED] bg-white">
                            {/* Select All */}
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E6ED] bg-[#F8F9FB] px-5 py-4 sm:px-6">
                                <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleSelectAll}
                                        className="size-4 cursor-pointer accent-[#203452]"
                                    />
                                    Pilih Semua ({cart.length} produk)
                                </label>

                                <button
                                    type="button"
                                    onClick={removeSelected}
                                    disabled={selectedItems.length === 0}
                                    className="flex items-center gap-2 text-xs font-semibold text-[#98A2B3] transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Trash2 size={15} />
                                    Hapus Dipilih
                                </button>
                            </div>

                            {/* Table Header */}
                            <div className="hidden grid-cols-[1fr_130px_120px_40px] items-center gap-4 border-b border-[#E2E6ED] px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#667085] md:grid">
                                <span>Produk</span>
                                <span className="text-center">Harga</span>
                                <span className="text-center">Jumlah</span>
                                <span />
                            </div>

                            {/* Cart Items */}
                            <div className="divide-y divide-[#E2E6ED]">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`grid grid-cols-1 gap-5 p-5 transition-colors sm:p-6 md:grid-cols-[1fr_130px_120px_40px] md:items-center md:gap-4 ${
                                            item.selected
                                                ? "bg-white"
                                                : "bg-[#FCFCFD]"
                                        }`}
                                    >
                                        {/* Product */}
                                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                                            <input
                                                type="checkbox"
                                                checked={item.selected}
                                                onChange={() =>
                                                    toggleItem(item.id)
                                                }
                                                className="size-4 shrink-0 cursor-pointer accent-[#203452]"
                                                aria-label={`Pilih ${item.name}`}
                                            />

                                            <div className="flex size-24 shrink-0 items-center justify-center rounded-lg bg-[#F1F3F7] p-3 sm:size-28">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="mb-1 text-xs font-medium text-[#667085]">
                                                    {item.category}
                                                </p>

                                                <h3 className="font-semibold text-[#203452] sm:text-base">
                                                    {item.name}
                                                </h3>

                                                <p className="mt-2 text-xs text-[#667085]">
                                                    Stok tersedia: {item.stock}
                                                </p>

                                                <p className="mt-2 font-semibold text-[#203452] md:hidden">
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="hidden text-center md:block">
                                            <p className="text-sm font-semibold">
                                                {formatPrice(item.price)}
                                            </p>
                                        </div>

                                        {/* Quantity */}
                                        <div className="flex items-center justify-between md:justify-center">
                                            <span className="text-xs font-medium text-[#667085] md:hidden">
                                                Jumlah
                                            </span>

                                            <div className="flex items-center rounded-lg border border-[#E2E6ED]">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            -1,
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                    className="flex size-9 items-center justify-center text-[#667085] transition hover:bg-[#F1F3F7] disabled:cursor-not-allowed disabled:opacity-30"
                                                    aria-label="Kurangi jumlah"
                                                >
                                                    <Minus size={14} />
                                                </button>

                                                <span className="w-9 text-center text-sm font-semibold">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            1,
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity >=
                                                        item.stock
                                                    }
                                                    className="flex size-9 items-center justify-center text-[#667085] transition hover:bg-[#F1F3F7] disabled:cursor-not-allowed disabled:opacity-30"
                                                    aria-label="Tambah jumlah"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Remove */}
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(item.id)
                                                }
                                                className="flex size-9 items-center justify-center rounded-lg text-[#98A2B3] transition hover:bg-red-50 hover:text-red-600"
                                                aria-label={`Hapus ${item.name}`}
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cart Footer */}
                            <div className="flex flex-col gap-3 border-t border-[#E2E6ED] bg-[#F8F9FB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#526B91] transition hover:text-[#203452]"
                                >
                                    <ArrowLeft size={16} />
                                    Lanjutkan Belanja
                                </Link>

                                <span className="text-xs text-[#667085]">
                                    Harga belum termasuk ongkos kirim.
                                </span>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <aside className="rounded-xl border border-[#E2E6ED] bg-white p-6 lg:sticky lg:top-24">
                            <h2 className="font-serif text-2xl font-semibold">
                                Ringkasan Pesanan
                            </h2>

                            <div className="mt-7 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#667085]">
                                        Produk dipilih
                                    </span>
                                    <span className="font-medium">
                                        {selectedItems.length} produk
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#667085]">
                                        Total kuantitas
                                    </span>
                                    <span className="font-medium">
                                        {selectedCount} item
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#667085]">
                                        Subtotal
                                    </span>
                                    <span className="font-medium">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#667085]">
                                        Pengiriman
                                    </span>
                                    <span className="text-xs font-medium text-[#526B91]">
                                        Dihitung saat checkout
                                    </span>
                                </div>
                            </div>

                            <div className="my-6 border-t border-dashed border-[#E2E6ED]" />

                            <div className="flex items-center justify-between gap-3">
                                <span className="font-semibold">
                                    Total sementara
                                </span>
                                <span className="text-xl font-bold tracking-tight">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleCheckout}
                                disabled={selectedItems.length === 0}
                                className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-[#203452] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#314D73] disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                Checkout ({selectedCount})
                                <ArrowRight size={17} />
                            </button>

                            {selectedItems.length === 0 && (
                                <p className="mt-3 text-center text-xs text-[#98A2B3]">
                                    Pilih minimal satu produk untuk checkout.
                                </p>
                            )}

                            <div className="mt-6 space-y-4 border-t border-[#E2E6ED] pt-5">
                                <div className="flex items-center gap-3">
                                    <Truck
                                        size={19}
                                        className="shrink-0 text-[#526B91]"
                                    />

                                    <div>
                                        <p className="text-xs font-semibold">
                                            Pengiriman terpercaya
                                        </p>
                                        <p className="mt-0.5 text-xs text-[#667085]">
                                            Informasi pengiriman saat checkout.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <ShieldCheck
                                        size={19}
                                        className="shrink-0 text-[#526B91]"
                                    />

                                    <div>
                                        <p className="text-xs font-semibold">
                                            Belanja lebih aman
                                        </p>
                                        <p className="mt-0.5 text-xs text-[#667085]">
                                            Informasi pesanan tercatat dengan
                                            baik.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                ) : (
                    /* Empty Cart */
                    <div className="flex min-h-105 flex-col items-center justify-center rounded-xl border border-dashed border-[#D5DAE3] bg-white px-6 py-16 text-center">
                        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[#F1F3F7]">
                            <ShoppingBag
                                size={34}
                                strokeWidth={1.5}
                                className="text-[#526B91]"
                            />
                        </div>

                        <h2 className="font-serif text-3xl font-semibold">
                            Keranjangmu masih kosong
                        </h2>

                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#667085]">
                            Sepertinya belum ada produk yang menarik
                            perhatianmu. Yuk, temukan teknologi yang kamu
                            butuhkan!
                        </p>

                        <Link
                            href="/"
                            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#203452] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#314D73]"
                        >
                            Mulai Belanja
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
};

export default CartPage;
