import { Link } from '@inertiajs/react';
import type { OrderPagination as OrderPaginationData } from '../types';

const OrderPagination = ({
    pagination,
}: {
    pagination: OrderPaginationData;
}) => {
    if (pagination.last_page <= 1) {
        return null;
    }

    return (
        <nav
            aria-label="Navigasi halaman pesanan"
            className="flex flex-col gap-3 border-t border-[#EEF0F4] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
            <p className="text-[11px] text-[#8A95A5]">
                Menampilkan{' '}
                <span className="font-semibold text-[#526072]">
                    {pagination.from ?? 0}–{pagination.to ?? 0}
                </span>{' '}
                dari{' '}
                <span className="font-semibold text-[#526072]">
                    {pagination.total}
                </span>{' '}
                pesanan
            </p>
            <div className="flex flex-wrap items-center gap-1">
                {pagination.links.map((link, index) => {
                    const label = link.label
                        .replace('&laquo;', '‹')
                        .replace('&raquo;', '›');

                    return link.url === null ? (
                        <span
                            key={`${index}-${label}`}
                            aria-disabled="true"
                            className="flex min-h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] text-[#C0C6D0]"
                        >
                            {label}
                        </span>
                    ) : (
                        <Link
                            key={`${index}-${label}`}
                            href={link.url}
                            preserveScroll
                            aria-current={link.active ? 'page' : undefined}
                            className={`flex min-h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-medium transition-colors ${
                                link.active
                                    ? 'bg-[#203452] text-white'
                                    : 'text-[#667085] hover:bg-[#F3F5F8] hover:text-[#203452]'
                            }`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default OrderPagination;
