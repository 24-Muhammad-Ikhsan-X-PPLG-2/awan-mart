import { Star } from "lucide-react";

const Rating = () => {
    return (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                ))}
            </div>

            <span className="font-semibold">4.8</span>

            <span className="text-gray-300">|</span>

            <span className="text-gray-500">12 ulasan</span>

            <span className="text-gray-300">|</span>

            <span className="text-gray-500">120 terjual</span>
        </div>
    );
};

export default Rating;
