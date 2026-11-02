import { Link } from "@inertiajs/react";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";

const products = [
    {
        id: 1,
        name: "MacBook Air M2",
        category: "Laptop",
        image: "/image/macbook-air-m2.webp",
        price: 15000000,
        originalPrice: 18292683,
        rating: 4.8,
        reviews: "1.2rb",
        discount: 18,
        slug: "macbook-air-m2",
    },
    {
        id: 2,
        name: "MacBook Air M2",
        category: "Laptop",
        image: "/image/macbook-air-m2.webp",
        price: 15000000,
        originalPrice: 18292683,
        rating: 4.8,
        reviews: "1.2rb",
        discount: 18,
        slug: "macbook-air-m2",
    },
    {
        id: 3,
        name: "MacBook Air M2",
        category: "Laptop",
        image: "/image/macbook-air-m2.webp",
        price: 15000000,
        originalPrice: 18292683,
        rating: 4.8,
        reviews: "1.2rb",
        discount: 18,
        slug: "macbook-air-m2",
    },
    {
        id: 4,
        name: "MacBook Air M2",
        category: "Laptop",
        image: "/image/macbook-air-m2.webp",
        price: 15000000,
        originalPrice: 18292683,
        rating: 4.8,
        reviews: "1.2rb",
        discount: 18,
        slug: "macbook-air-m2",
    },
    {
        id: 5,
        name: "MacBook Air M2",
        category: "Laptop",
        image: "/image/macbook-air-m2.webp",
        price: 15000000,
        originalPrice: 18292683,
        rating: 4.8,
        reviews: "1.2rb",
        discount: 18,
        slug: "macbook-air-m2",
    },
];

const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(price);

const ProductSection = () => {
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

                    <h2 className="mt-2 font-playfair text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
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

type Product = (typeof products)[number];

type CardProductProps = {
    product: Product;
};

const CardProduct = ({ product }: CardProductProps) => {
    return (
        <article className="group flex w-64 shrink-0 flex-col overflow-hidden rounded-xl border border-[#E2E6ED] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-68 lg:w-72">
            <Link
                href={`/products/${product.slug}`}
                className="relative flex h-48 items-center justify-center overflow-hidden bg-[#F8F9FC] p-5 sm:h-52"
            >
                {product.discount > 0 && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-[#203452] px-3 py-1 text-xs font-semibold text-white">
                        Diskon {product.discount}%
                    </span>
                )}

                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#98A2B3]">
                        {product.category}
                    </p>

                    <Link
                        href={`/products/${product.slug}`}
                        className="mt-1 block"
                    >
                        <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-snug text-[#203452] transition-colors group-hover:text-[#526B91]">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="mt-3">
                    <p className="text-lg font-bold text-[#203452]">
                        {formatPrice(product.price)}
                    </p>

                    {product.originalPrice > product.price && (
                        <p className="mt-0.5 text-sm text-[#98A2B3] line-through">
                            {formatPrice(product.originalPrice)}
                        </p>
                    )}
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-sm">
                    <Star
                        size={16}
                        fill="#EAB308"
                        className="shrink-0 text-yellow-500"
                    />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-[#98A2B3]">
                        ({product.reviews} ulasan)
                    </span>
                </div>

                <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#203452] px-3 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#2D466A] cursor-pointer active:scale-[0.98]"
                >
                    <ShoppingCart size={17} />
                    Tambah ke Keranjang
                </button>
            </div>
        </article>
    );
};

export default ProductSection;
