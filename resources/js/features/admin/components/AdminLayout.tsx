import type { ReactNode } from 'react';
import { useState } from 'react';
import AdminSidebar, { type AdminSection } from './AdminSidebar';
import DashboardHeader from './DashboardHeader';
import type { DashboardProps } from '../types';

type Props = {
    admin: DashboardProps['admin'];
    generatedAt: string;
    title: string;
    description: string;
    activePage: AdminSection;
    children: ReactNode;
};

const AdminLayout = ({
    admin,
    generatedAt,
    title,
    description,
    activePage,
    children,
}: Props) => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F9FC] text-[#203452]">
            <div className="flex min-h-screen">
                <AdminSidebar
                    admin={admin}
                    activePage={activePage}
                    mobileOpen={mobileNavOpen}
                    onClose={() => setMobileNavOpen(false)}
                />
                <main className="min-w-0 flex-1">
                    <div className="mx-auto max-w-[1480px] px-4 pt-5 pb-10 sm:px-7 sm:pt-7 xl:px-10">
                        <DashboardHeader
                            title={title}
                            description={description}
                            generatedAt={generatedAt}
                            onMenuOpen={() => setMobileNavOpen(true)}
                        />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
