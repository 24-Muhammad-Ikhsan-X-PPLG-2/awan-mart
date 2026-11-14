import ProfileForm from '@/features/profile/components/ProfileForm';
import OrderHistory from '@/features/profile/components/OrderHistory';
import ProfileNavigation from '@/features/profile/components/ProfileNavigation';
import ProfileOverview from '@/features/profile/components/ProfileOverview';
import SectionHeading from '@/features/profile/components/SectionHeading';
import { ProfilePageProps, ProfileSection } from '@/features/profile/types';
import Navbar from '@/components/navbar';
import { Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

const ProfilePage = ({ profile, stats, orders, filters }: ProfilePageProps) => {
    const [activeSection, setActiveSection] =
        useState<ProfileSection>('overview');

    const navigateTo = (section: ProfileSection) => {
        setActiveSection(section);
        document.getElementById(section)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <main className="min-h-screen bg-[#F8F9FC] text-[#203452]">
            <Head title="Akun Saya" />
            <Navbar activePage="profile" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
                <header className="mb-7">
                    <p className="text-[11px] font-bold tracking-[0.22em] text-[#526B91]">
                        AWANMART ACCOUNT
                    </p>
                    <h1 className="font-playfair mt-2 text-3xl font-semibold sm:text-4xl">
                        Akun Saya
                    </h1>
                    <p className="mt-2 text-sm text-[#667085]">
                        Kelola informasi pribadi dan pantau pesanan Anda.
                    </p>
                </header>

                <div className="mb-6 overflow-x-auto lg:hidden">
                    <ProfileNavigation
                        activeSection={activeSection}
                        onNavigate={navigateTo}
                        compact
                    />
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[230px_minmax(0,1fr)] xl:gap-8">
                    <aside className="hidden lg:sticky lg:top-24 lg:block">
                        <div className="rounded-xl border border-[#E2E6ED] bg-white p-3 shadow-sm">
                            <ProfileNavigation
                                activeSection={activeSection}
                                onNavigate={navigateTo}
                            />
                            <div className="mt-4 border-t border-[#E2E6ED] px-3 pt-4">
                                <div className="flex items-start gap-2 text-xs leading-5 text-[#667085]">
                                    <ShieldCheck
                                        size={16}
                                        className="mt-0.5 shrink-0 text-[#526B91]"
                                    />
                                    Informasi akun Anda hanya dapat dilihat oleh
                                    Anda.
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="min-w-0 space-y-7">
                        <motion.section
                            id="overview"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="scroll-mt-24"
                        >
                            <ProfileOverview
                                profile={profile}
                                stats={stats}
                                onNavigate={navigateTo}
                            />
                        </motion.section>

                        <section
                            id="personal"
                            className="scroll-mt-24 rounded-xl border border-[#E2E6ED] bg-white p-5 shadow-sm sm:p-7"
                        >
                            <SectionHeading
                                eyebrow="ACCOUNT DETAILS"
                                title="Informasi Pribadi"
                                description="Pastikan detail kontak Anda selalu terbaru."
                            />
                            <ProfileForm profile={profile} />
                        </section>

                        <OrderHistory orders={orders} filters={filters} />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;
