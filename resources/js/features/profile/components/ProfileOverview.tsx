import {
    ArrowRight,
    BadgeCheck,
    Clock3,
    ShoppingBag,
    UserRound,
} from 'lucide-react';
import { ProfileData, ProfileSection } from '../types';

type Props = {
    profile: ProfileData;
    stats: {
        orders: number;
        completed: number;
        pending: number;
    };
    onNavigate: (section: ProfileSection) => void;
};

const ProfileOverview = ({ profile, stats, onNavigate }: Props) => (
    <div className="rounded-xl border border-[#E2E6ED] bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
                <Avatar name={profile.name} />
                <div className="min-w-0">
                    <p className="text-xs font-medium text-[#98A2B3]">
                        Welcome back,
                    </p>
                    <h2 className="font-playfair mt-1 truncate text-2xl font-semibold text-[#203452]">
                        {profile.name || 'AwanMart Customer'}
                    </h2>
                    <p className="mt-1 truncate text-sm text-[#667085]">
                        {profile.email}
                    </p>
                    {profile.createdAt && (
                        <p className="mt-2 text-xs text-[#98A2B3]">
                            Bergabung{' '}
                            {formatDate(profile.createdAt, {
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex shrink-0 gap-2">
                <button
                    type="button"
                    onClick={() => onNavigate('personal')}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#E2E6ED] px-4 text-sm font-semibold text-[#526B91] transition hover:border-[#526B91] hover:bg-[#F8F9FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
                >
                    <UserRound size={16} />
                    Edit Profil
                </button>
                <button
                    type="button"
                    onClick={() => onNavigate('orders')}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-4 text-sm font-semibold text-white transition hover:bg-[#314D73] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91]"
                >
                    Pesanan
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 border-t border-[#E2E6ED] pt-5 sm:grid-cols-3">
            <StatCard
                icon={ShoppingBag}
                label="Total Pesanan"
                value={stats.orders}
            />
            <StatCard
                icon={BadgeCheck}
                label="Pesanan Selesai"
                value={stats.completed}
            />
            <StatCard
                icon={Clock3}
                label="Menunggu Pembayaran"
                value={stats.pending}
            />
        </div>
    </div>
);

const Avatar = ({ name }: { name: string }) => {
    const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');

    return (
        <div
            aria-hidden="true"
            className="font-playfair flex size-16 shrink-0 items-center justify-center rounded-full bg-[#203452] text-xl font-semibold text-white sm:size-[76px] sm:text-2xl"
        >
            {initials || <UserRound size={25} />}
        </div>
    );
};

type StatCardProps = {
    icon: typeof ShoppingBag;
    label: string;
    value: number;
};

const StatCard = ({ icon: Icon, label, value }: StatCardProps) => (
    <div className="flex items-center gap-3 rounded-lg bg-[#F8F9FC] px-4 py-3.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#526B91]">
            <Icon size={18} />
        </span>
        <div>
            <p className="text-xl leading-none font-semibold text-[#203452]">
                {value}
            </p>
            <p className="mt-1.5 text-xs text-[#667085]">{label}</p>
        </div>
    </div>
);

const formatDate = (
    value: string,
    options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    },
) => new Intl.DateTimeFormat('id-ID', options).format(new Date(value));

export default ProfileOverview;
