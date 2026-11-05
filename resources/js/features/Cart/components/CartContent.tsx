import { formatPrice } from "@/lib/utils";
import { Link, router } from "@inertiajs/react";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "../types/carts";
import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import { useCartStore } from "@/stores/cart-store";
import { motion, AnimatePresence } from "motion/react";

type Props = {
    allSelected: boolean;
    toggleSelectAll: () => void;
    removeSelected: () => void;
    selectedItems: CartItem[];
    cart: CartItem[];
    setCart: Dispatch<SetStateAction<CartItem[]>>;
    toggleItem: (v: number) => void;
    removeItem: (v: number) => void;
};

const CartContent: FC<Props> = ({
    allSelected,
    cart,
    removeSelected,
    selectedItems,
    toggleSelectAll,
    toggleItem,
    removeItem,
    setCart,
}) => {
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
    const { setCartCount, cartCount } = useCartStore();

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);
    // Update quantity
    const updateQuantity = (id: number, amount: number) => {
        const selected = cart.find((item) => item.id == id);
        if (typeof selected === "undefined") return;
        setCartCount(cartCount + amount);
        setCart((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantity: Math.min(
                              item.product.stock,
                              Math.max(1, item.quantity + amount),
                          ),
                      }
                    : item,
            ),
        );
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            router.patch(
                `/cart/item/${id}`,
                {
                    quantity: Math.min(
                        selected.product.stock,
                        Math.max(1, selected.quantity + amount),
                    ),
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }, 800);
    };
    return (
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
                <AnimatePresence mode="sync">
                    {cart.map((item) => (
                        <motion.div
                            exit={{
                                x: -1000,
                                backgroundColor: "red",
                            }}
                            transition={{
                                duration: 0.3,
                            }}
                            key={item.id}
                            className={`grid grid-cols-1 gap-5 p-5 transition-colors sm:p-6 md:grid-cols-[1fr_130px_120px_40px] md:items-center md:gap-4 ${
                                item.product.selected
                                    ? "bg-white"
                                    : "bg-[#FCFCFD]"
                            }`}
                        >
                            {/* Product */}
                            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                                <input
                                    type="checkbox"
                                    checked={item.product.selected}
                                    onChange={() => toggleItem(item.id)}
                                    className="size-4 shrink-0 cursor-pointer accent-[#203452]"
                                    aria-label={`Pilih ${item.product.name}`}
                                />

                                <div className="flex size-24 shrink-0 items-center justify-center rounded-lg bg-[#F1F3F7] p-3 sm:size-28">
                                    <img
                                        src={
                                            item.product.product_images[0].image
                                        }
                                        alt={item.product.name}
                                        className="h-full w-full object-contain"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="mb-1 text-xs font-medium text-[#667085]">
                                        {item.product.category.name}
                                    </p>

                                    <h3 className="font-semibold text-[#203452] sm:text-base">
                                        {item.product.name}
                                    </h3>

                                    <p className="mt-2 text-xs text-[#667085]">
                                        Stok tersedia: {item.product.stock}
                                    </p>

                                    <p className="mt-2 font-semibold text-[#203452] md:hidden">
                                        {formatPrice(
                                            Number(item.product.price),
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="hidden text-center md:block">
                                <p className="text-sm font-semibold">
                                    {formatPrice(Number(item.product.price))}
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
                                            updateQuantity(item.id, -1)
                                        }
                                        disabled={item.quantity <= 1}
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
                                            updateQuantity(item.id, 1)
                                        }
                                        disabled={
                                            item.quantity >= item.product.stock
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
                                    onClick={() => removeItem(item.id)}
                                    className="flex size-9 items-center justify-center rounded-lg text-[#98A2B3] transition hover:bg-red-50 hover:text-red-600"
                                    aria-label={`Hapus ${item.product.name}`}
                                >
                                    <Trash2 size={17} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
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
    );
};

export default CartContent;
