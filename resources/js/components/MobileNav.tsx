import { categories, navlinks } from "@/constant";
import { FC, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

type Props = {
    onNavigate: () => void;
    activePage?: string;
};

const MobileNav: FC<Props> = ({ onNavigate, activePage = "beranda" }) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    return (
        <div className="flex flex-col">
            {navlinks.map((item, index) => {
                const isActive =
                    item.display.toLowerCase() === activePage.toLowerCase();
                const isKategori = item.display === "Kategori";

                return (
                    <motion.div
                        key={item.display}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            delay: index * 0.06,
                            duration: 0.25,
                        }}
                    >
                        {isKategori ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsCategoryOpen(!isCategoryOpen)
                                    }
                                    aria-expanded={isCategoryOpen}
                                    className="flex w-full items-center justify-between border-b border-[#F0F1F4] py-4 text-left text-sm font-medium text-[#475467] transition-colors hover:text-[#203452]"
                                >
                                    Kategori
                                    <ChevronDown
                                        size={17}
                                        className={`transition-transform duration-300 ${
                                            isCategoryOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {isCategoryOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-col border-b border-[#F0F1F4] bg-[#F8F9FB] px-4">
                                                {categories.map((category) => (
                                                    <a
                                                        key={category.name}
                                                        href={category.href}
                                                        onClick={onNavigate}
                                                        className="py-3 text-xs font-medium text-[#667085] transition-colors hover:text-[#203452]"
                                                    >
                                                        {category.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <a
                                href={item.href}
                                onClick={onNavigate}
                                className={`flex items-center justify-between border-b border-[#F0F1F4] py-4 text-sm transition-colors hover:text-[#203452] ${
                                    isActive
                                        ? "font-semibold text-[#203452]"
                                        : "font-medium text-[#475467]"
                                }`}
                            >
                                {item.display}
                                {isActive && (
                                    <span className="size-1.5 rounded-full bg-[#203452]" />
                                )}
                            </a>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};
export default MobileNav;
