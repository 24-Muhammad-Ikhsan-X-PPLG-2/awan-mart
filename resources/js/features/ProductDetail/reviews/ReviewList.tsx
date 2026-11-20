import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "./ReviewCard";
import { Review, ReviewSort } from "./types";

type Props = {
    reviews: Review[];
    sort: ReviewSort;
    page: number;
    pageSize: number;
    onSortChange: (sort: ReviewSort) => void;
    onPageChange: (page: number) => void;
};

const ReviewList = ({
    reviews,
    sort,
    page,
    pageSize,
    onSortChange,
    onPageChange,
}: Props) => {
    const pageCount = Math.max(1, Math.ceil(reviews.length / pageSize));
    const visibleReviews = reviews.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-[#203452]">
                    {reviews.length} ulasan ditampilkan
                </p>
                <label className="flex items-center gap-2 text-sm text-[#667085]">
                    Urutkan
                    <select
                        value={sort}
                        onChange={(event) => onSortChange(event.target.value as ReviewSort)}
                        className="h-10 rounded-lg border border-[#D0D5DD] bg-white px-3 text-sm font-medium text-[#203452] outline-none focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
                    >
                        <option value="latest">Terbaru</option>
                        <option value="highest">Rating Tertinggi</option>
                        <option value="lowest">Rating Terendah</option>
                    </select>
                </label>
            </div>

            <div className="space-y-4">
                {visibleReviews.length > 0 ? (
                    visibleReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#D0D5DD] bg-white px-5 py-10 text-center">
                        <p className="font-semibold text-[#203452]">
                            Belum ada ulasan
                        </p>
                        <p className="mt-1 text-sm text-[#667085]">
                            Jadilah pelanggan pertama yang membagikan pengalaman.
                        </p>
                    </div>
                )}
            </div>

            {pageCount > 1 && (
                <nav
                    className="mt-6 flex items-center justify-center gap-2"
                    aria-label="Navigasi halaman ulasan"
                >
                    <button
                        type="button"
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="flex size-10 items-center justify-center rounded-lg border border-[#D0D5DD] text-[#203452] disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Halaman sebelumnya"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: pageCount }).map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                            <button
                                key={pageNumber}
                                type="button"
                                onClick={() => onPageChange(pageNumber)}
                                aria-current={page === pageNumber ? "page" : undefined}
                                className={`size-10 rounded-lg text-sm font-semibold transition ${
                                    page === pageNumber
                                        ? "bg-[#203452] text-white"
                                        : "border border-[#D0D5DD] text-[#526B91] hover:bg-[#F1F3F7]"
                                }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() => onPageChange(Math.min(pageCount, page + 1))}
                        disabled={page === pageCount}
                        className="flex size-10 items-center justify-center rounded-lg border border-[#D0D5DD] text-[#203452] disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Halaman berikutnya"
                    >
                        <ChevronRight size={18} />
                    </button>
                </nav>
            )}
        </div>
    );
};

export default ReviewList;
