import { Star } from 'lucide-react';

type Props = {
    average: number;
    total: number;
};

const Rating = ({ average, total }: Props) => {
    return (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                        key={index}
                        size={16}
                        fill={index < Math.round(average) ? 'currentColor' : 'none'}
                        className={index < Math.round(average) ? '' : 'text-[#D0D5DD]'}
                    />
                ))}
            </div>

            <span className="font-semibold">{average.toFixed(1)}</span>

            <span className="text-gray-300">|</span>

            <a href="#ulasan-pelanggan" className="text-gray-500 hover:text-[#203452]">
                {total} ulasan
            </a>
        </div>
    );
};

export default Rating;
