import { Review } from './types';
import RatingStars from './RatingStars';

type Props = {
    review: Review;
};

const formatDate = (date: string) =>
    new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));

const ReviewCard = ({ review }: Props) => {
    return (
        <article className="rounded-2xl border border-[#E2E6ED] bg-white p-5 shadow-[0_6px_24px_rgba(32,52,82,0.035)] sm:p-6">
            <div className="flex items-start gap-3">
                <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${review.avatarColor}`}
                    aria-label={review.name}
                >
                    {review.initials}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <h3 className="font-semibold text-[#203452]">
                                {review.name}
                            </h3>
                        </div>
                        <time
                            dateTime={review.date}
                            className="text-xs text-[#667085]"
                        >
                            {formatDate(review.date)}
                        </time>
                    </div>

                    <div className="mt-3">
                        <RatingStars value={review.rating} size={16} />
                    </div>
                    <h4 className="mt-3 text-sm font-bold text-[#203452] sm:text-base">
                        {review.title}
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-[#667085]">
                        {review.content}
                    </p>

                    {review.images.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {review.images.map((image, index) => (
                                <img
                                    key={`${image}-${index}`}
                                    src={image}
                                    alt={`Lampiran ulasan ${review.name} ${index + 1}`}
                                    className="size-20 rounded-xl border border-[#E2E6ED] bg-[#F8F9FC] object-cover"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

export default ReviewCard;
