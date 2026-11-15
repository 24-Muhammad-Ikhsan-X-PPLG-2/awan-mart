import { CalendarDays, Menu } from 'lucide-react';
import { formatDate } from '../formatters';

const DashboardHeader = ({
    title,
    description,
    generatedAt,
    onMenuOpen,
}: {
    title: string;
    description: string;
    generatedAt: string;
    onMenuOpen: () => void;
}) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };

    return (
        <header className="mb-7 flex items-start justify-between gap-4 sm:mb-8">
            <div className="flex min-w-0 items-start gap-3">
                <button
                    type="button"
                    aria-label="Buka menu navigasi"
                    onClick={onMenuOpen}
                    className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#E2E6ED] bg-white text-[#203452] lg:hidden"
                >
                    <Menu size={19} />
                </button>
                <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-semibold tracking-[0.2em] text-[#8390A3]">
                        RINGKASAN TOKO
                    </p>
                    <h1 className="font-playfair text-3xl leading-tight font-semibold tracking-tight text-[#203452] sm:text-[34px]">
                        {title}
                    </h1>
                    <p className="mt-1.5 text-sm text-[#667085]">
                        {description}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#8390A3] sm:hidden">
                        <CalendarDays size={13} />
                        <time dateTime={generatedAt}>
                            {formatDate(generatedAt, dateOptions)}
                        </time>
                    </p>
                </div>
            </div>
            <div className="hidden shrink-0 items-center gap-2 rounded-lg border border-[#E2E6ED] bg-white px-3.5 py-2.5 text-xs font-medium text-[#526B91] sm:flex">
                <CalendarDays size={15} strokeWidth={1.8} />
                <time dateTime={generatedAt}>
                    {formatDate(generatedAt, dateOptions)}
                </time>
            </div>
        </header>
    );
};

export default DashboardHeader;
