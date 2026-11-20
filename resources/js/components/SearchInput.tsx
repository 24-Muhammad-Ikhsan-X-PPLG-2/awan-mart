import { formatPrice } from '@/lib/utils';
import { Search, X, LoaderCircle, PackageSearch } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

type Product = {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string | null;
    category: string | null;
};

const SearchInput = () => {
    const [keyword, setKeyword] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const query = keyword.trim();

        if (query.length < 2) {
            setProducts([]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `/search/products?keyword=${encodeURIComponent(query)}`,
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error('Failed to search products');
                }

                const data: Product[] = await response.json();

                setProducts(data);
                setIsOpen(true);
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error(error);
                    setProducts([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }, 300);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [keyword]);

    const handleClear = () => {
        setKeyword('');
        setProducts([]);
        setIsOpen(false);
    };

    const showDropdown = isOpen && keyword.trim().length >= 2;

    return (
        <div className="group relative w-full lg:w-64">
            <div className="flex h-10 items-center rounded-lg border border-[#E2E6ED] bg-[#F8F9FB] transition-all duration-300 focus-within:border-[#203452] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#203452]/5">
                <label
                    htmlFor="search"
                    className="flex shrink-0 items-center pl-3"
                >
                    <Search
                        size={17}
                        strokeWidth={1.8}
                        className="text-[#98A2B3] transition-colors group-focus-within:text-[#203452]"
                    />
                </label>

                <input
                    id="search"
                    type="search"
                    placeholder="Cari produk..."
                    autoComplete="off"
                    className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-[12px] font-medium text-[#203452] outline-none placeholder:font-normal placeholder:text-[#98A2B3]"
                    value={keyword}
                    onFocus={() => {
                        if (keyword.trim().length >= 2) {
                            setIsOpen(true);
                        }
                    }}
                    onChange={({ target: { value } }) => {
                        setKeyword(value);
                        setIsOpen(true);
                    }}
                />

                {loading && (
                    <LoaderCircle
                        size={15}
                        className="mr-2 animate-spin text-[#98A2B3]"
                    />
                )}

                <AnimatePresence mode="wait">
                    {keyword.length > 0 && !loading && (
                        <motion.button
                            key="clear"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.15 }}
                            type="button"
                            aria-label="Clear search"
                            className="mr-2 flex shrink-0 cursor-pointer items-center text-[#98A2B3] transition-colors hover:text-[#203452]"
                            onClick={handleClear}
                        >
                            <X size={15} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{
                            duration: 0.18,
                            ease: 'easeOut',
                        }}
                        className="absolute top-full left-0 z-50 mt-2 w-full min-w-[300px] overflow-hidden rounded-xl border border-[#E2E6ED] bg-white shadow-[0_12px_35px_rgba(32,52,82,0.10)]"
                    >
                        <div className="border-b border-[#F0F1F4] px-4 py-3">
                            <p className="text-[10px] font-semibold tracking-[0.12em] text-[#98A2B3]">
                                SEARCH RESULTS
                            </p>
                        </div>

                        {products.length > 0 ? (
                            <div className="max-h-[360px] overflow-y-auto p-2">
                                {products.map((product, index) => (
                                    <motion.a
                                        key={product.id}
                                        href={`/products/${product.slug}`}
                                        initial={{
                                            opacity: 0,
                                            y: 5,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            duration: 0.16,
                                            delay: index * 0.025,
                                        }}
                                        className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-[#F8F9FB]"
                                    >
                                        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F3F5F8]">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                <PackageSearch
                                                    size={20}
                                                    className="text-[#98A2B3]"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-semibold text-[#203452]">
                                                {product.name}
                                            </p>

                                            <p className="mt-1 text-[10px] text-[#98A2B3]">
                                                {product.category ?? 'Produk'}
                                            </p>

                                            <p className="mt-1 text-xs font-semibold text-[#526B91]">
                                                {formatPrice(product.price)}
                                            </p>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center px-4 py-8 text-center">
                                <PackageSearch
                                    size={28}
                                    strokeWidth={1.5}
                                    className="text-[#98A2B3]"
                                />

                                <p className="mt-3 text-xs font-semibold text-[#203452]">
                                    Produk tidak ditemukan
                                </p>

                                <p className="mt-1 text-[11px] text-[#98A2B3]">
                                    Coba gunakan kata kunci lainnya.
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchInput;
