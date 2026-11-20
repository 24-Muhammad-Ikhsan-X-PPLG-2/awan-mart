import { ProductType } from '@/types/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    LoaderCircle,
    ShoppingCart,
    Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FC, useEffect, useRef, useState } from 'react';

type Props = {
    products: ProductType[];
};

const ProductSection: FC<Props> = ({ products }) => {
    return (
        <section
            id="produk-unggulan"
            className="mx-auto mt-14 w-full max-w-7xl px-4 text-[#203452] sm:mt-16 sm:px-6 lg:px-10"
        >
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold tracking-[0.25em] text-[#526B91] sm:text-sm">
                        PRODUK UNGGULAN
                    </p>

                    <h2 className="font-playfair mt-2 text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl">
                        Pilihan Terbaik untuk Anda
                    </h2>

                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#667085]">
                        Temukan produk pilihan dengan kualitas terbaik untuk
                        menunjang kebutuhan Anda.
                    </p>
                </div>

                <Link
                    href="/products"
                    className="group inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold transition-colors hover:text-[#526B91]"
                >
                    Lihat semua produk
                    <ArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                </Link>
            </div>

            <div className="-mx-4 overflow-x-auto px-4 pb-5 sm:mx-0 sm:px-0">
                <div className="flex w-max gap-4">
                    {products.map((product) => (
                        <CardProduct key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

type CardProductProps = {
    product: ProductType;
};

type ButtonStatus = 'idle' | 'loading' | 'success';

const CardProduct = ({ product }: CardProductProps) => {
    const [status, setStatus] = useState<ButtonStatus>('idle');
    const { incrementCount } = useCartStore();

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    const handleAddToCart = () => {
        if (status !== 'idle' || product.stock <= 0) return;

        router.post(
            '/cart/item',
            {
                product_id: product.id,
                quantity: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,

                onStart: () => {
                    setStatus('loading');
                },

                onSuccess: () => {
                    setStatus('success');
                    incrementCount(1);
                    timeoutRef.current = setTimeout(() => {
                        setStatus('idle');
                    }, 2200);
                },

                onError: () => {
                    setStatus('idle');
                },

                onCancel: () => {
                    setStatus('idle');
                },
            },
        );
    };
    const buttonStyles = {
        idle: 'bg-[#203452] hover:bg-[#2c4568] text-white shadow-none',
        loading: 'bg-[#344968] text-white cursor-wait',
        success:
            'bg-emerald-600 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-600/20',
    };

    const buttonLabels = {
        idle: 'Tambah ke Keranjang',
        loading: 'Menambahkan...',
        success: 'Berhasil Ditambahkan!',
    };
    return (
        <article className="group flex w-64 shrink-0 flex-col overflow-hidden rounded-xl border border-[#E2E6ED] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-68 lg:w-72">
            {/* Product Image */}
            <Link
                href={`/products/${product.slug}`}
                className="relative flex h-48 items-center justify-center overflow-hidden bg-[#F8F9FC] p-5 sm:h-52"
            >
                <img
                    src={product.product_images[0].image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            <div className="flex flex-1 flex-col p-4">
                {/* Category & Name */}
                <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold tracking-wider text-[#98A2B3] uppercase">
                        {product.category.name}
                    </p>

                    <Link href={`/products/${product.slug}`} className="block">
                        <h3 className="line-clamp-2 min-h-11 text-[15px] leading-snug font-semibold text-[#203452] transition-colors group-hover:text-[#526B91]">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Price */}
                <div className="mt-2.5">
                    <p className="text-lg leading-tight font-bold text-[#203452]">
                        {formatPrice(Number(product.price))}
                    </p>
                </div>

                {/* Rating */}
                <div className="mt-2.5 flex items-center gap-1.5 text-xs">
                    <Star
                        size={15}
                        fill="#EAB308"
                        className="shrink-0 text-yellow-500"
                    />

                    <span className="font-semibold text-[#203452]">
                        {Number(product.reviews_avg_rating ?? 0).toFixed(1)}
                    </span>

                    <span className="text-[#98A2B3]">
                        ({product.reviews_count ?? 0} ulasan)
                    </span>
                </div>

                {/* Add to Cart */}
                <motion.button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={
                        product.stock <= 0 ||
                        (status !== 'idle' && status !== 'success')
                    }
                    whileHover={status === 'idle' ? { scale: 1.02 } : {}}
                    whileTap={status === 'idle' ? { scale: 0.97 } : {}}
                    animate={{
                        scale: status === 'success' ? [1, 1.035, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`mt-4 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${buttonStyles[status]}`}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={status}
                            initial={{ opacity: 0, y: 8, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center gap-2"
                        >
                            {status === 'idle' && <ShoppingCart size={18} />}

                            {status === 'loading' && (
                                <LoaderCircle
                                    size={18}
                                    className="animate-spin"
                                />
                            )}

                            {status === 'success' && (
                                <motion.span
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 12,
                                    }}
                                >
                                    <Check size={19} strokeWidth={3} />
                                </motion.span>
                            )}

                            {buttonLabels[status]}
                        </motion.span>
                    </AnimatePresence>
                </motion.button>
            </div>
        </article>
    );
};

export default ProductSection;
