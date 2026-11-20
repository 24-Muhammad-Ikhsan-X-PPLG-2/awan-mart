import { useMemo, useState } from 'react';
import ReviewList from './ReviewList';
import ReviewSummary from './ReviewSummary';
import { RatingDistribution, Review, ReviewSort } from './types';

type Props = {
    reviews: Review[];
    summary: {
        average: number;
        total: number;
        distribution: RatingDistribution;
    };
};

const ProductReviews = ({ reviews, summary }: Props) => {
    const [sort, setSort] = useState<ReviewSort>('latest');
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const sortedReviews = useMemo(
        () =>
            [...reviews].sort((a, b) => {
                if (sort === 'highest') {
                    return (
                        b.rating - a.rating ||
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
                }
                if (sort === 'lowest') {
                    return (
                        a.rating - b.rating ||
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
                }
                return (
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
            }),
        [reviews, sort],
    );

    return (
        <section
            id="ulasan-pelanggan"
            className="border-t border-[#E2E6ED] bg-[#F8F9FC] py-12 sm:py-16"
        >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
                <div className="mb-8">
                    <p className="text-xs font-bold tracking-[0.2em] text-[#526B91]">
                        ULASAN PRODUK
                    </p>
                    <h2 className="mt-2 font-playfair text-3xl font-bold text-[#203452] sm:text-4xl">
                        Ulasan Pelanggan
                    </h2>
                    <p className="mt-3 text-sm text-[#667085] sm:text-base">
                        Lihat pengalaman pelanggan lainnya terhadap produk ini.
                    </p>
                </div>

                <ReviewSummary
                    average={summary.average}
                    total={summary.total}
                    distribution={summary.distribution}
                />

                <div className="mt-8">
                    <ReviewList
                        reviews={sortedReviews}
                        sort={sort}
                        page={page}
                        pageSize={pageSize}
                        onSortChange={(value) => {
                            setSort(value);
                            setPage(1);
                        }}
                        onPageChange={setPage}
                    />
                </div>
            </div>
        </section>
    );
};

export default ProductReviews;
