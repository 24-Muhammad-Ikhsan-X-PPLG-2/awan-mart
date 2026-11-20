import { useState } from 'react';
import { Star } from 'lucide-react';

type Props = {
    value: number;
    interactive?: boolean;
    size?: number;
    onChange?: (value: number) => void;
};

const RatingStars = ({
    value,
    interactive = false,
    size = 18,
    onChange,
}: Props) => {
    const [hovered, setHovered] = useState(0);

    return (
        <div
            className="flex items-center gap-1"
            onMouseLeave={() => interactive && setHovered(0)}
            aria-label={`Rating ${value} dari 5`}
        >
            {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const active = interactive
                    ? starValue <= (hovered || value)
                    : starValue <= Math.round(value);

                return interactive ? (
                    <button
                        key={starValue}
                        type="button"
                        onClick={() => onChange?.(starValue)}
                        onMouseEnter={() => setHovered(starValue)}
                        aria-label={`${starValue} bintang`}
                        aria-pressed={starValue <= value}
                        className="rounded-sm text-amber-400 transition-transform hover:scale-110 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:outline-none"
                    >
                        <Star
                            size={size}
                            fill={active ? 'currentColor' : 'none'}
                        />
                    </button>
                ) : (
                    <Star
                        key={starValue}
                        size={size}
                        fill={active ? 'currentColor' : 'none'}
                        className={active ? 'text-amber-400' : 'text-[#D0D5DD]'}
                    />
                );
            })}
        </div>
    );
};

export default RatingStars;
