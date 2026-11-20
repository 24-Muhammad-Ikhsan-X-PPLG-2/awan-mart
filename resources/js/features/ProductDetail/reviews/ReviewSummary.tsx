import { RatingDistribution } from './types';
import RatingStars from './RatingStars';

type Props = {
    average: number;
    total: number;
    distribution: RatingDistribution;
};

const ReviewSummary = ({ average, total, distribution }: Props) => {
    return (
        <div className="grid gap-8 rounded-2xl border border-[#E2E6ED] bg-white p-5 shadow-[0_8px_30px_rgba(32,52,82,0.04)] sm:p-7 lg:grid-cols-[240px_1fr] lg:items-center">
            <div className="border-[#E2E6ED] lg:border-r lg:pr-8">
                <p className="text-sm font-medium text-[#667085]">
                    Rating rata-rata
                </p>
                <div className="mt-2 flex items-end gap-3">
                    <span className="font-playfair text-5xl leading-none font-bold text-[#203452]">
                        {average.toFixed(1)}
                    </span>
                    <span className="pb-1 text-sm text-[#667085]">/ 5</span>
                </div>
                <div className="mt-4">
                    <RatingStars value={average} size={20} />
                </div>
                <p className="mt-3 text-sm text-[#667085]">{total} ulasan</p>
            </div>

            <div className="space-y-2.5">
                {[5, 4, 3, 2, 1].map((rating) => {
                    const count =
                        distribution[rating as keyof RatingDistribution];
                    const percentage = total ? (count / total) * 100 : 0;

                    return (
                        <div
                            key={rating}
                            className="grid grid-cols-[58px_1fr_42px] items-center gap-3"
                        >
                            <div className="flex items-center gap-1 text-sm font-semibold text-[#526B91]">
                                {rating}
                                <span
                                    className="text-amber-400"
                                    aria-hidden="true"
                                >
                                    ★
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-[#EDF0F5]">
                                <div
                                    className="h-full rounded-full bg-amber-400 transition-[width] duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-right text-xs font-medium text-[#667085]">
                                {count}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReviewSummary;
