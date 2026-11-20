import { Link } from '@inertiajs/react';
import { FC } from 'react';

type Props = {
    category: string;
    productName: string;
    categoryId: number;
};

const BreadcrumbNav: FC<Props> = ({ category, productName, categoryId }) => {
    return (
        <>
            <section className="mb-7 flex flex-wrap items-center gap-2 bg-gray-200 px-14 py-3.5 text-xs text-gray-500 sm:mb-10 sm:text-sm">
                <Link
                    href="/"
                    className="transition-colors hover:text-[#203452]"
                >
                    Beranda
                </Link>

                <span>/</span>

                <Link
                    href="/categories"
                    className="transition-colors hover:text-[#203452]"
                >
                    Kategori
                </Link>

                <span>/</span>

                <Link
                    href={`/products?category=${categoryId}`}
                    className="transition-colors hover:text-[#203452]"
                >
                    {category}
                </Link>

                <span>/</span>

                <span className="font-semibold text-[#203452]">
                    {productName}
                </span>
            </section>
        </>
    );
};

export default BreadcrumbNav;
