import Navbar from '@/components/navbar';
import { iconMap } from '@/constant';
import { Category } from '@/types/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowRight,
    CircuitBoard,
    LayoutGridCircles,
    MoveUpRight,
} from 'lucide-react';
import { FC } from 'react';

type Props = {
    categories: Category[];
};

const Categories: FC<Props> = ({ categories }) => {
    return (
        <main className="min-h-screen bg-[#F8F9FC]">
            <Head title="Categories" />
            <Navbar activePage="Kategori" />

            <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
                <header className="relative grid min-h-[390px] items-center gap-10 overflow-hidden border-b border-[#E2E6ED] py-14 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-20">
                    <div className="relative z-10 max-w-2xl">
                        <p className="text-[11px] font-bold tracking-[0.24em] text-[#526B91] sm:text-xs">
                            EXPLORE OUR COLLECTION
                        </p>
                        <h1 className="font-playfair mt-4 text-[2.6rem] leading-[1.08] font-semibold tracking-tight text-[#203452] sm:text-5xl lg:text-[3.6rem]">
                            Find the right technology for your world.
                        </h1>
                        <p className="mt-5 max-w-xl text-sm leading-7 text-[#667085] sm:text-base">
                            Explore our curated collection of electronics,
                            designed to support your productivity, creativity,
                            and everyday lifestyle.
                        </p>
                        <a
                            href="#category-collection"
                            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#203452] transition-colors hover:text-[#526B91] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#526B91]"
                        >
                            Browse collections
                            <ArrowDownRight size={17} />
                        </a>
                    </div>

                    <div
                        aria-hidden="true"
                        className="relative hidden h-[280px] items-center justify-center lg:flex"
                    >
                        <div className="absolute top-2 right-8 size-64 rounded-full border border-[#E2E6ED]" />
                        <div className="absolute top-10 right-16 size-48 rounded-full border border-[#E2E6ED]" />
                        <div className="relative flex size-36 items-center justify-center rounded-full bg-[#203452] text-white shadow-[0_20px_50px_rgba(32,52,82,0.16)]">
                            <CircuitBoard size={58} strokeWidth={1.1} />
                        </div>
                        <div className="absolute top-12 left-10 flex size-14 items-center justify-center rounded-2xl border border-[#E2E6ED] bg-white text-[#526B91] shadow-sm">
                            <span className="text-xs font-semibold tracking-widest">
                                01
                            </span>
                        </div>
                        <div className="absolute right-1 bottom-8 flex items-center gap-3 rounded-xl border border-[#E2E6ED] bg-white px-4 py-3 shadow-sm">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-[#F0F3F8] text-[#526B91]">
                                <LayoutGridCircles size={17} />
                            </span>
                            <span className="text-xs font-medium text-[#526B91]">
                                Thoughtfully selected
                            </span>
                        </div>
                        <span className="absolute bottom-7 left-8 text-[10px] font-semibold tracking-[0.2em] text-[#98A2B3]">
                            AWANMART / COLLECTIONS
                        </span>
                    </div>
                </header>

                <section
                    id="category-collection"
                    aria-labelledby="category-heading"
                    className="scroll-mt-24 pt-12 sm:pt-16"
                >
                    <div className="mb-7 flex flex-col justify-between gap-3 sm:mb-9 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-[11px] font-bold tracking-[0.2em] text-[#526B91]">
                                THE COLLECTION
                            </p>
                            <h2
                                id="category-heading"
                                className="font-playfair mt-2 text-2xl font-semibold text-[#203452] sm:text-3xl"
                            >
                                Explore by category
                            </h2>
                        </div>
                        <p className="max-w-md text-sm leading-6 text-[#667085]">
                            Find the right tools for work, play, and everything
                            in between.
                        </p>
                    </div>

                    {categories.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                            {categories.map((category, index) => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-[#D8DEE8] bg-white px-6 py-14 text-center">
                            <LayoutGridCircles
                                size={30}
                                className="mx-auto text-[#98A2B3]"
                            />
                            <p className="mt-3 text-sm font-medium text-[#526B91]">
                                Categories are coming soon.
                            </p>
                        </div>
                    )}
                </section>

                <section className="mt-14 overflow-hidden rounded-2xl bg-[#203452] px-6 py-9 text-white sm:mt-20 sm:px-10 sm:py-11 lg:px-14">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-xl">
                            <p className="text-[10px] font-semibold tracking-[0.22em] text-white/60">
                                AWANMART, FOR WHAT’S NEXT
                            </p>
                            <h2 className="font-playfair mt-3 text-2xl font-semibold sm:text-3xl">
                                Technology that moves you forward.
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-white/70">
                                Discover products that make every day more
                                productive.
                            </p>
                        </div>
                        <Link
                            href="/products"
                            className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#203452] transition-colors hover:bg-[#F0F3F8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                        >
                            Explore Products
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
};

type CategoryCardProps = {
    category: Category;
    index: number;
};

const CategoryCard: FC<CategoryCardProps> = ({ category, index }) => {
    const Icon = category.icon
        ? (iconMap[category.icon] ?? LayoutGridCircles)
        : LayoutGridCircles;
    const productCount = category.products_count ?? 0;

    return (
        <Link
            href={`/products?category=${category.id}`}
            aria-label={`Explore ${category.name}, ${productCount} ${
                productCount === 1 ? 'product' : 'products'
            }`}
            className="group relative flex min-h-48 flex-col justify-between overflow-hidden rounded-xl border border-[#E2E6ED] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#B9C6D8] hover:shadow-[0_12px_30px_rgba(32,52,82,0.07)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91] sm:min-h-52 sm:p-6"
        >
            <div className="flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-xl bg-[#F0F3F8] text-[#526B91] transition-colors duration-200 group-hover:bg-[#203452] group-hover:text-white">
                    <Icon size={23} strokeWidth={1.6} />
                </span>
                <span className="text-[10px] font-semibold tracking-[0.16em] text-[#A0A8B5]">
                    {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            <div className="mt-7">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="font-playfair text-xl font-semibold text-[#203452]">
                        {category.name}
                    </h3>
                    <MoveUpRight
                        size={17}
                        className="shrink-0 text-[#98A2B3] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#203452]"
                    />
                </div>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#667085]">
                    {category.description ||
                        'Explore products in this collection.'}
                </p>
                <p className="mt-4 text-xs font-medium text-[#526B91]">
                    {productCount} {productCount === 1 ? 'product' : 'products'}
                </p>
            </div>
        </Link>
    );
};

export default Categories;
