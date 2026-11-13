import { iconMap } from "@/constant";
import { Category } from "@/types/types";
import { Link } from "@inertiajs/react";
import { ArrowRight, Laptop, LayoutGridCircles } from "lucide-react";
import { FC } from "react";

type Props = {
    categories: Category[] | null;
};

const CategoriesSection: FC<Props> = ({ categories }) => {
    if (!categories) return <></>;
    return (
        <section
            id="kategori"
            className="mx-auto mt-12 w-full max-w-7xl px-4 text-[#203452] sm:mt-16 sm:px-6 lg:px-10"
        >
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold tracking-[0.25em] text-[#526B91] sm:text-sm">
                        KATEGORI
                    </p>

                    <h2 className="mt-2 font-playfair text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                        Belanja Berdasarkan Kategori
                    </h2>
                </div>

                <Link
                    href="/categories"
                    className="group inline-flex w-fit items-center gap-2 text-sm font-semibold transition-colors hover:text-[#526B91]"
                >
                    Lihat semua
                    <ArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                </Link>
            </div>

            <div className="-mx-4 overflow-x-auto px-4 py-4 sm:mx-0 sm:px-0">
                <div className="flex w-max gap-3 sm:gap-4">
                    {categories.map((item) => (
                        <CategoryRender category={item} key={item.name} />
                    ))}
                </div>
            </div>
        </section>
    );
};

type PropsCategoryRender = {
    category: Category;
};

const CategoryRender: FC<PropsCategoryRender> = ({ category }) => {
    const Icon = category.icon
        ? (iconMap[category.icon] ?? LayoutGridCircles)
        : LayoutGridCircles;
    return (
        <Link
            href={`/categories/${category.name.toLowerCase()}`}
            className="group flex h-36 w-36 shrink-0 flex-col items-center justify-center gap-3 rounded-xl border border-[#E2E6ED] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#526B91]/40 hover:shadow-lg sm:h-40 sm:w-44 lg:h-44 lg:w-52"
        >
            <Icon
                size={42}
                strokeWidth={1.6}
                className="text-[#526B91] transition-transform duration-300 group-hover:scale-110 sm:size-12"
            />

            <span className="max-w-[85%] text-center text-sm font-semibold sm:text-base">
                {category.name}
            </span>
        </Link>
    );
};

export default CategoriesSection;
