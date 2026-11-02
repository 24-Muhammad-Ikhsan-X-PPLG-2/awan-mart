import {
    Search,
    ShoppingCart,
    UserRound,
    X,
    Menu,
    ArrowRight,
} from "lucide-react";
import { FC, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { appName, categories } from "@/constant";
import RenderNavLink from "./RenderNavLink";
import MobileNav from "./MobileNav";
import SearchInput from "./SearchInput";
import { Link, usePage } from "@inertiajs/react";
import Drawer from "./Drawer";

type Props = {
    activePage?: string;
};

const Navbar: FC<Props> = ({ activePage }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const {
        auth: { user },
    } = usePage().props;

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-[#E8EBF0] bg-white/95 backdrop-blur-md">
                <nav className="mx-auto flex h-19 max-w-360 items-center justify-between gap-8 px-6 lg:px-10 xl:px-14">
                    <Link href="/" className="shrink-0">
                        <h1 className="font-playfair text-[27px] font-bold tracking-tight text-[#203452]">
                            {appName}
                        </h1>
                    </Link>
                    <div className="hidden lg:block">
                        <RenderNavLink activePage={activePage} />
                    </div>

                    <div className="hidden items-center gap-3 sm:gap-5 lg:flex">
                        <SearchInput />
                        {user ? (
                            <>
                                <button
                                    type="button"
                                    className="group relative flex size-10 items-center justify-center rounded-full text-[#203452] transition-colors cursor-pointer hover:bg-[#F1F3F7]"
                                >
                                    <ShoppingCart size={21} strokeWidth={1.7} />

                                    <span className="absolute right-0.5 top-0.5 flex size-4.25 items-center justify-center rounded-full bg-[#203452] text-[9px] font-semibold text-white transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                                        0
                                    </span>
                                </button>

                                <Link
                                    href="/profile"
                                    aria-label="Akun pengguna"
                                    className="flex size-10 items-center justify-center rounded-full border border-[#E2E6ED] text-[#203452] transition-all hover:border-[#203452] hover:bg-[#F1F3F7]"
                                >
                                    <UserRound size={19} strokeWidth={1.7} />
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/login"
                                    className="rounded-lg px-5 py-2.5 text-sm font-semibold text-[#203452] transition-colors hover:bg-[#F1F3F7]"
                                >
                                    Masuk
                                </Link>

                                <Link
                                    href="/auth/register"
                                    className="rounded-lg bg-[#203452] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#2D466A] hover:shadow-md active:scale-[0.98]"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                    {/* Mobile */}
                    <div className="flex items-center gap-2 lg:hidden">
                        {user && (
                            <Link
                                href="/cart"
                                aria-label="Keranjang belanja"
                                className="relative flex size-10 items-center justify-center rounded-full text-[#203452] hover:bg-[#F1F3F7]"
                            >
                                <ShoppingCart size={21} strokeWidth={1.7} />
                                <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-[#203452] text-[9px] font-semibold text-white">
                                    0
                                </span>
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            className="flex size-10 items-center justify-center rounded-full border border-[#E2E6ED] text-[#203452] transition-colors hover:bg-[#F1F3F7]"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {isDrawerOpen ? (
                                    <motion.span
                                        key="close"
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <X size={21} />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="menu"
                                        initial={{ opacity: 0, rotate: 90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: -90 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <Menu size={21} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </nav>
            </header>

            <Drawer
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                activePage={activePage}
            />
        </>
    );
};

export default Navbar;
