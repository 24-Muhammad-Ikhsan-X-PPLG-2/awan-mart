import { FC, useEffect, useRef, useState } from 'react';
import { ProductType } from '../types/products';
import { Check, Heart, LoaderCircle, ShoppingCart } from 'lucide-react';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCartStore } from '@/stores/cart-store';

type Props = {
    product: ProductType;
    quantity: number;
    setQuantity: (v: number) => void;
};

type ButtonStatus = 'idle' | 'loading' | 'success';

const Actions: FC<Props> = ({ product, quantity, setQuantity }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
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
                quantity,
            },
            {
                preserveState: true,
                preserveScroll: true,

                onStart: () => {
                    setStatus('loading');
                },

                onSuccess: () => {
                    setStatus('success');
                    incrementCount(quantity);
                    setQuantity(1);
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
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
                className={`relative flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg px-5 py-3 text-sm font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${buttonStyles[status]}`}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={status}
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center gap-2"
                    >
                        {status === 'idle' && <ShoppingCart size={19} />}

                        {status === 'loading' && (
                            <LoaderCircle size={19} className="animate-spin" />
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
                                <Check size={20} strokeWidth={3} />
                            </motion.span>
                        )}

                        {buttonLabels[status]}
                    </motion.span>
                </AnimatePresence>
            </motion.button>

            <motion.button
                type="button"
                onClick={() => setIsWishlisted((current) => !current)}
                aria-label="Tambahkan ke wishlist"
                aria-pressed={isWishlisted}
                whileTap={{ scale: 0.85 }}
                animate={{
                    scale: isWishlisted ? [1, 1.2, 1] : 1,
                }}
                className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition-colors ${
                    isWishlisted
                        ? 'border-red-200 bg-red-50 text-red-600'
                        : 'border-[#E2E6ED] bg-white text-[#203452] hover:bg-[#F1F3F7]'
                }`}
            >
                <Heart
                    size={19}
                    fill={isWishlisted ? 'currentColor' : 'none'}
                />
                <span className="sm:hidden">Wishlist</span>
            </motion.button>
        </div>
    );
};

export default Actions;
