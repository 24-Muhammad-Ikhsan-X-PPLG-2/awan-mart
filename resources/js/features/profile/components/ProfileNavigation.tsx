import { CircleUserRound, ShoppingBag, UserRound } from 'lucide-react';
import { ProfileSection } from '../types';

type Props = {
    activeSection: ProfileSection;
    onNavigate: (section: ProfileSection) => void;
    compact?: boolean;
};

const items: {
    id: ProfileSection;
    label: string;
    icon: typeof CircleUserRound;
}[] = [
    { id: 'overview', label: 'Ringkasan', icon: CircleUserRound },
    { id: 'personal', label: 'Informasi Pribadi', icon: UserRound },
    { id: 'orders', label: 'Pesanan Saya', icon: ShoppingBag },
];

const ProfileNavigation = ({
    activeSection,
    onNavigate,
    compact = false,
}: Props) => (
    <nav
        aria-label="Navigasi akun"
        className={compact ? 'flex min-w-max gap-2' : 'flex flex-col gap-1'}
    >
        {items.map(({ id, label, icon: Icon }) => (
            <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={activeSection === id ? 'location' : undefined}
                className={`flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-left text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526B91] ${
                    compact ? 'border' : 'w-full'
                } ${
                    activeSection === id
                        ? 'border-[#D9E1EC] bg-[#F0F3F8] text-[#203452]'
                        : 'border-transparent text-[#667085] hover:bg-[#F8F9FC] hover:text-[#203452]'
                }`}
            >
                <Icon size={17} />
                {label}
            </button>
        ))}
    </nav>
);

export default ProfileNavigation;
