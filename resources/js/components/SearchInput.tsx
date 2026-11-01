import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const SearchInput = () => {
    const [keyword, setKeyword] = useState("");

    const widthSearchBox =
        keyword.trim() !== "" && keyword.length >= 28
            ? "lg:w-80 w-full"
            : keyword.length >= 16
              ? "lg:w-72 w-full"
              : "lg:w-56 w-full";

    return (
        <div
            className={`group flex h-10 items-center rounded-lg border border-[#E2E6ED] bg-[#F8F9FB] transition-all duration-300 focus-within:border-[#203452] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#203452]/5 ${
                widthSearchBox
            }`}
        >
            <label htmlFor="search" className="flex shrink-0 items-center pl-3">
                <Search
                    size={17}
                    strokeWidth={1.8}
                    className="text-[#98A2B3] transition-colors group-focus-within:text-[#203452]"
                />
            </label>

            <input
                id="search"
                type="search"
                placeholder="Cari produk..."
                className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-[12px] font-medium text-[#203452] outline-none placeholder:font-normal placeholder:text-[#98A2B3]"
                value={keyword}
                onChange={({ target: { value } }) => setKeyword(value)}
            />

            <AnimatePresence mode="wait">
                {keyword.trim() !== "" && (
                    <motion.button
                        key="clear"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.15 }}
                        type="button"
                        className="mr-2 flex shrink-0 cursor-pointer items-center text-[#98A2B3] transition-colors hover:text-[#203452]"
                        onClick={() => setKeyword("")}
                    >
                        <X size={15} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchInput;
