import Navbar from "@/components/navbar";
import { Pagination, ProductType } from "@/types/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { Link, router } from "@inertiajs/react";
import {
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    Package,
    Search,
    ShoppingCart,
    SlidersHorizontal,
} from "lucide-react";
import { FormEvent, useState } from "react";

type CategoryOption = {
    id: number;
    name: string;
};

type Filters = {
    q: string;
    category: string | number;
    min_price: string | number;
    max_price: string | number;
    sort: string;
};

type Props = {
    products: Pagination<ProductType>;
    categories: CategoryOption[];
    filters: Filters;
};

const ProductsPage = ({ products, categories, filters }: Props) => {
    const [query, setQuery] = useState(filters.q);
    const [category, setCategory] = useState(String(filters.category));
    const [minPrice, setMinPrice] = useState(String(filters.min_price));
    const [maxPrice, setMaxPrice] = useState(String(filters.max_price));
    const [sort, setSort] = useState(filters.sort || "latest");

    const applyFilters = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(
            "/products",
            {
                q: query || null,
                category: category || null,
                min_price: minPrice || null,
                max_price: maxPrice || null,
                sort,
                page: 1,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const clearFilters = () => {
        setQuery("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        setSort("latest");
        router.get(
            "/products",
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <main className="min-h-screen bg-[#F8F9FC]">
            <Navbar activePage="products" />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
                <header className="mb-8">
                    <p className="text-xs font-bold tracking-[0.25em] text-[#526B91]">
                        KATALOG AWANMART
                    </p>
                    <h1 className="font-playfair mt-2 text-3xl font-bold text-[#203452] sm:text-4xl">
                        Jelajahi Semua Produk
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#718096]">
                        Temukan produk yang sesuai dengan kebutuhanmu. Gunakan
                        filter untuk mempersempit pilihan.
                    </p>
                </header>

                <form
                    onSubmit={applyFilters}
                    className="mb-7 rounded-2xl border border-[#E2E6ED] bg-white p-4 shadow-sm sm:p-5"
                >
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#203452]">
                        <SlidersHorizontal size={17} />
                        Filter Produk
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                        <label className="relative sm:col-span-2 lg:col-span-2">
                            <span className="sr-only">Cari produk</span>
                            <Search
                                size={17}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-[#98A2B3]"
                            />
                            <input
                                type="search"
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Cari nama atau deskripsi produk"
                                className="h-11 w-full rounded-lg border border-[#E2E6ED] bg-white pr-3 pl-10 text-sm text-[#203452] transition outline-none placeholder:text-[#98A2B3] focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
                            />
                        </label>

                        <label>
                            <span className="sr-only">Kategori</span>
                            <select
                                value={category}
                                onChange={(event) =>
                                    setCategory(event.target.value)
                                }
                                className="h-11 w-full rounded-lg border border-[#E2E6ED] bg-white px-3 text-sm text-[#203452] outline-none focus:border-[#526B91]"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <span className="sr-only">Harga minimum</span>
                            <input
                                type="number"
                                min="0"
                                value={minPrice}
                                onChange={(event) =>
                                    setMinPrice(event.target.value)
                                }
                                placeholder="Harga minimum"
                                className="h-11 w-full rounded-lg border border-[#E2E6ED] bg-white px-3 text-sm text-[#203452] outline-none placeholder:text-[#98A2B3] focus:border-[#526B91]"
                            />
                        </label>

                        <label>
                            <span className="sr-only">Harga maksimum</span>
                            <input
                                type="number"
                                min="0"
                                value={maxPrice}
                                onChange={(event) =>
                                    setMaxPrice(event.target.value)
                                }
                                placeholder="Harga maksimum"
                                className="h-11 w-full rounded-lg border border-[#E2E6ED] bg-white px-3 text-sm text-[#203452] outline-none placeholder:text-[#98A2B3] focus:border-[#526B91]"
                            />
                        </label>

                        <label>
                            <span className="sr-only">Urutkan produk</span>
                            <select
                                value={sort}
                                onChange={(event) =>
                                    setSort(event.target.value)
                                }
                                className="h-11 w-full rounded-lg border border-[#E2E6ED] bg-white px-3 text-sm text-[#203452] outline-none focus:border-[#526B91]"
                            >
                                <option value="latest">Terbaru</option>
                                <option value="price_asc">
                                    Harga terendah
                                </option>
                                <option value="price_desc">
                                    Harga tertinggi
                                </option>
                                <option value="name_asc">Nama A-Z</option>
                            </select>
                        </label>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-[#98A2B3]">
                            {products.total} produk ditemukan
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-lg border border-[#E2E6ED] px-4 py-2.5 text-sm font-semibold text-[#526B91] transition hover:bg-[#F8F9FC]"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-[#203452] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#314D73]"
                            >
                                Terapkan Filter
                            </button>
                        </div>
                    </div>
                </form>

                {products.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.data.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <p className="text-sm text-[#718096]">
                                Menampilkan {products.from ?? 0}-
                                {products.to ?? 0} dari {products.total} produk
                            </p>
                            <nav
                                aria-label="Navigasi halaman produk"
                                className="flex items-center gap-2"
                            >
                                {products.prev_page_url ? (
                                    <Link
                                        href={products.prev_page_url}
                                        preserveScroll
                                        className="flex size-10 items-center justify-center rounded-lg border border-[#E2E6ED] bg-white text-[#526B91] transition hover:bg-[#F1F3F7]"
                                        aria-label="Halaman sebelumnya"
                                    >
                                        <ChevronLeft size={18} />
                                    </Link>
                                ) : (
                                    <span className="flex size-10 items-center justify-center rounded-lg border border-[#E2E6ED] bg-[#F1F3F7] text-[#B8C0CC]">
                                        <ChevronLeft size={18} />
                                    </span>
                                )}
                                <span className="px-2 text-sm font-semibold text-[#203452]">
                                    Halaman {products.current_page} dari{" "}
                                    {products.last_page}
                                </span>
                                {products.next_page_url ? (
                                    <Link
                                        href={products.next_page_url}
                                        preserveScroll
                                        className="flex size-10 items-center justify-center rounded-lg border border-[#E2E6ED] bg-white text-[#526B91] transition hover:bg-[#F1F3F7]"
                                        aria-label="Halaman berikutnya"
                                    >
                                        <ChevronRight size={18} />
                                    </Link>
                                ) : (
                                    <span className="flex size-10 items-center justify-center rounded-lg border border-[#E2E6ED] bg-[#F1F3F7] text-[#B8C0CC]">
                                        <ChevronRight size={18} />
                                    </span>
                                )}
                            </nav>
                        </div>
                    </>
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#D8DEE8] bg-white px-6 py-16 text-center">
                        <Package
                            size={34}
                            className="mx-auto mb-3 text-[#98A2B3]"
                        />
                        <h2 className="font-semibold text-[#203452]">
                            Produk tidak ditemukan
                        </h2>
                        <p className="mt-1 text-sm text-[#98A2B3]">
                            Coba ubah kata kunci atau filter pencarianmu.
                        </p>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-4 text-sm font-semibold text-[#526B91] hover:text-[#203452]"
                        >
                            Hapus semua filter
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

const ProductCard = ({ product }: { product: ProductType }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const incrementCount = useCartStore((state) => state.incrementCount);

    const addToCart = () => {
        if (isAdding || product.stock <= 0) return;

        router.post(
            "/cart/item",
            { product_id: product.id, quantity: 1 },
            {
                preserveScroll: true,
                onStart: () => setIsAdding(true),
                onSuccess: () => {
                    incrementCount(1);
                    setAdded(true);
                    window.setTimeout(() => setAdded(false), 1800);
                },
                onFinish: () => setIsAdding(false),
            },
        );
    };

    return (
        <article className="group flex flex-col overflow-hidden rounded-xl border border-[#E2E6ED] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <Link
                href={`/products/${product.slug}`}
                className="flex h-52 items-center justify-center overflow-hidden bg-[#F8F9FC] p-5"
            >
                {product.product_images[0]?.image ? (
                    <img
                        src={product.product_images[0].image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <Package size={42} className="text-[#B8C0CC]" />
                )}
            </Link>
            <div className="flex flex-1 flex-col p-4">
                <p className="text-[11px] font-semibold tracking-wider text-[#98A2B3] uppercase">
                    {product.category.name}
                </p>
                <Link
                    href={`/products/${product.slug}`}
                    className="mt-1 line-clamp-2 min-h-11 text-sm font-semibold text-[#203452] transition hover:text-[#526B91]"
                >
                    {product.name}
                </Link>
                <p className="mt-3 text-lg font-bold text-[#203452]">
                    {formatPrice(Number(product.price))}
                </p>
                <p className="mt-1 text-xs text-[#98A2B3]">
                    {product.stock > 0 ? `Stok ${product.stock}` : "Stok habis"}
                </p>
                <button
                    type="button"
                    onClick={addToCart}
                    disabled={isAdding || product.stock <= 0}
                    className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#203452] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#314D73] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isAdding ? (
                        <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                        <ShoppingCart size={16} />
                    )}
                    {isAdding
                        ? "Menambahkan..."
                        : added
                          ? "Berhasil ditambahkan"
                          : "Tambah ke Keranjang"}
                </button>
            </div>
        </article>
    );
};

export default ProductsPage;
