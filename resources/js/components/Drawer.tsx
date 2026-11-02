import { AnimatePresence } from "motion/react";
import { FC } from "react";
import { motion } from "motion/react";
import { ArrowRight, UserRound, X } from "lucide-react";
import SearchInput from "./SearchInput";
import MobileNav from "./MobileNav";
import { categories } from "@/constant";
import { Link, usePage } from "@inertiajs/react";

type Props = {
    isDrawerOpen: boolean;
    setIsDrawerOpen: (v: boolean) => void;
    activePage?: string;
};

const Drawer: FC<Props> = ({ isDrawerOpen, setIsDrawerOpen, activePage }) => {
    const {
        auth: { user },
    } = usePage().props;
    return (
        <AnimatePresence>
            {isDrawerOpen && (
                <>
                    <motion.button
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => setIsDrawerOpen(false)}
                        className="fixed inset-0 z-40 bg-[#101828]/40 backdrop-blur-[3px] lg:hidden"
                    />

                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 32,
                        }}
                        className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-100 flex-col overflow-y-auto bg-white shadow-2xl lg:hidden"
                    >
                        <div className="flex h-19 shrink-0 items-center justify-between border-b border-[#E8EBF0] px-6">
                            <Link
                                href="/"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                <h2 className="font-playfair text-2xl font-bold tracking-tight text-[#203452]">
                                    AwanMart
                                </h2>
                            </Link>

                            <button
                                type="button"
                                aria-label="Tutup menu"
                                onClick={() => setIsDrawerOpen(false)}
                                className="flex size-10 items-center justify-center rounded-full border border-[#E2E6ED] text-[#203452] transition-colors hover:bg-[#F1F3F7]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-1 flex-col px-6 py-7">
                            <SearchInput />
                            <div className="mt-9">
                                <p className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-[#98A2B3]">
                                    MENU UTAMA
                                </p>

                                <MobileNav
                                    onNavigate={() => setIsDrawerOpen(false)}
                                    activePage={activePage}
                                />
                            </div>

                            <div className="mt-9 border-t border-[#E8EBF0] pt-6">
                                <p className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-[#98A2B3]">
                                    KATEGORI PRODUK
                                </p>

                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map(({ name, href, Icon }) => (
                                        <Link
                                            key={name}
                                            href={href}
                                            onClick={() =>
                                                setIsDrawerOpen(false)
                                            }
                                            className="group flex items-center gap-2.5 rounded-lg border border-[#E8EBF0] p-3 transition-all hover:border-[#203452] hover:bg-[#F8F9FB]"
                                        >
                                            <Icon
                                                size={17}
                                                strokeWidth={1.7}
                                                className="shrink-0 text-[#667085] transition-colors group-hover:text-[#203452]"
                                            />
                                            <span className="text-[11px] font-medium text-[#475467] transition-colors group-hover:text-[#203452]">
                                                {name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto pt-10">
                                {!user && (
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="flex items-center justify-between rounded-lg bg-[#203452] px-5 py-3.5 text-white transition-colors hover:bg-[#2D4568]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <UserRound size={19} />
                                            <span className="text-sm font-semibold">
                                                Masuk ke Akun
                                            </span>
                                        </div>

                                        <ArrowRight size={18} />
                                    </Link>
                                )}

                                <div className="mt-6 border-t border-[#E8EBF0] pt-5">
                                    <p className="font-playfair text-lg font-semibold text-[#203452]">
                                        Technology for Everyday Life.
                                    </p>
                                    <p className="mt-2 text-[11px] leading-relaxed text-[#98A2B3]">
                                        Temukan perangkat elektronik berkualitas
                                        untuk kebutuhan Anda bersama AwanMart.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 border-t border-[#E8EBF0] px-6 py-4">
                            <p className="text-center text-[10px] tracking-wider text-[#98A2B3]">
                                AWANMART • ELECTRONICS & TECHNOLOGY
                            </p>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default Drawer;
