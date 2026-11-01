import { navlinks, categories } from "@/constant";
import { ChevronDown, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FC, useState } from "react";

type Props = {
    activePage?: string;
};

const RenderNavLink: FC<Props> = ({ activePage = "beranda" }) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    return (
        <div className="flex h-19 items-center gap-7 xl:gap-9">
            {navlinks.map((item) => {
                const isActive =
                    item.display.toLowerCase() === activePage.toLowerCase();
                const isKategori = item.display === "Kategori";

                if (isKategori) {
                    return (
                        <div
                            key={item.display}
                            className="relative flex h-full items-center"
                            onMouseEnter={() => setIsCategoryOpen(true)}
                            onMouseLeave={() => setIsCategoryOpen(false)}
                        >
                            <button
                                type="button"
                                aria-expanded={isCategoryOpen}
                                onClick={() =>
                                    setIsCategoryOpen((prev) => !prev)
                                }
                                className={`group relative flex h-full items-center gap-1.5 text-[13px] tracking-wide font-medium transition-colors ${
                                    isCategoryOpen
                                        ? "text-[#203452]"
                                        : "text-[#667085] hover:text-[#203452]"
                                }`}
                            >
                                {item.display}

                                <ChevronDown
                                    size={14}
                                    strokeWidth={1.8}
                                    className={`transition-transform duration-300 ${
                                        isCategoryOpen ? "rotate-180" : ""
                                    }`}
                                />

                                <span
                                    className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-[#203452] transition-transform duration-300 ${
                                        isCategoryOpen
                                            ? "scale-x-100"
                                            : "scale-x-0"
                                    }`}
                                />
                            </button>

                            <AnimatePresence>
                                {isCategoryOpen && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -12,
                                            scale: 0.98,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -8,
                                            scale: 0.98,
                                        }}
                                        transition={{
                                            duration: 0.22,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        className="absolute left-1/2 top-full z-50 w-130 -translate-x-1/2 rounded-xl border border-[#E8EBF0] bg-white p-5 shadow-[0_16px_50px_rgba(32,52,82,0.12)]"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-playfair text-xl font-semibold text-[#203452]">
                                                    Kategori Produk
                                                </h3>
                                                <p className="mt-1 text-xs text-[#98A2B3]">
                                                    Temukan produk sesuai
                                                    kebutuhan Anda.
                                                </p>
                                            </div>

                                            <a
                                                href={item.href}
                                                className="flex items-center gap-1 text-xs font-semibold text-[#203452] hover:underline"
                                            >
                                                Semua Kategori
                                                <ArrowRight size={14} />
                                            </a>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            {categories.map(
                                                ({ name, href, Icon }) => (
                                                    <a
                                                        key={name}
                                                        href={href}
                                                        className="group flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all duration-200 hover:border-[#E8EBF0] hover:bg-[#F8F9FB]"
                                                    >
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F3F7] text-[#203452] transition-colors group-hover:bg-[#203452] group-hover:text-white">
                                                            <Icon
                                                                size={19}
                                                                strokeWidth={
                                                                    1.7
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-[13px] font-semibold text-[#203452]">
                                                                {name}
                                                            </p>
                                                            <p className="mt-0.5 text-[10px] text-[#98A2B3]">
                                                                Lihat produk
                                                            </p>
                                                        </div>
                                                    </a>
                                                ),
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                }

                return (
                    <a
                        key={item.display}
                        href={item.href}
                        className={`group relative flex h-full items-center text-[13px] tracking-wide transition-colors duration-200 ${
                            isActive
                                ? "font-semibold text-[#203452]"
                                : "font-medium text-[#667085] hover:text-[#203452]"
                        }`}
                    >
                        {item.display}

                        <span
                            className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-[#203452] transition-transform duration-300 ${
                                isActive
                                    ? "scale-x-100"
                                    : "scale-x-0 group-hover:scale-x-100"
                            }`}
                        />
                    </a>
                );
            })}
        </div>
    );
};

export default RenderNavLink;
