import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminPagination } from '../types';

const AdminResourcePagination = <T,>({
    pagination,
}: {
    pagination: AdminPagination<T>;
}) => {
    if (pagination.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E5E8EE] px-4 py-4 sm:flex-row">
            <p className="text-xs text-[#667085]">
                Menampilkan {pagination.from ?? 0}–{pagination.to ?? 0} dari{' '}
                {pagination.total}
            </p>
            <nav aria-label="Navigasi halaman" className="flex items-center gap-1">
                {pagination.links.map((link, index) => {
                    if (index === 0 || index === pagination.links.length - 1) {
                        const isPrevious = index === 0;
                        const Icon = isPrevious ? ChevronLeft : ChevronRight;

                        return link.url ? (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url}
                                preserveScroll
                                aria-label={
                                    isPrevious
                                        ? 'Halaman sebelumnya'
                                        : 'Halaman berikutnya'
                                }
                                className="flex size-9 items-center justify-center rounded-lg border border-[#E2E6EE] text-[#526B91] hover:bg-[#F8F9FC]"
                            >
                                <Icon size={16} />
                            </Link>
                        ) : (
                            <span
                                key={`${link.label}-${index}`}
                                className="flex size-9 items-center justify-center rounded-lg border border-[#E2E6EE] text-[#C2C9D3]"
                            >
                                <Icon size={16} />
                            </span>
                        );
                    }

                    return link.url ? (
                        <Link
                            key={`${link.label}-${index}`}
                            href={link.url}
                            preserveScroll
                            aria-current={link.active ? 'page' : undefined}
                            className={`flex size-9 items-center justify-center rounded-lg text-xs font-semibold ${
                                link.active
                                    ? 'bg-[#203452] text-white'
                                    : 'border border-[#E2E6EE] text-[#526B91] hover:bg-[#F8F9FC]'
                            }`}
                        >
                            {link.label.replace('&raquo;', '').replace('&laquo;', '')}
                        </Link>
                    ) : null;
                })}
            </nav>
        </div>
    );
};

export default AdminResourcePagination;
