import type { DashboardProps } from '../types';
import { formatDate } from '../formatters';

const DashboardFooter = ({
    generatedAt,
}: {
    generatedAt: DashboardProps['generatedAt'];
}) => (
    <footer className="mt-8 flex items-center justify-between border-t border-[#E5E8EE] pt-4 text-[10px] text-[#98A2B3]">
        <span>AwanMart Admin</span>
        <span>
            Diperbarui{' '}
            {formatDate(generatedAt, {
                hour: '2-digit',
                minute: '2-digit',
            })}
        </span>
    </footer>
);

export default DashboardFooter;
