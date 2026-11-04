import { Link } from "@inertiajs/react";
import { ArrowRight, ShoppingBag } from "lucide-react";

const EmptyCart = () => {
    return (
        <div className="flex min-h-105 flex-col items-center justify-center rounded-xl border border-dashed border-[#D5DAE3] bg-white px-6 py-16 text-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[#F1F3F7]">
                <ShoppingBag
                    size={34}
                    strokeWidth={1.5}
                    className="text-[#526B91]"
                />
            </div>

            <h2 className="font-serif text-3xl font-semibold">
                Keranjangmu masih kosong
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#667085]">
                Sepertinya belum ada produk yang menarik perhatianmu. Yuk,
                temukan teknologi yang kamu butuhkan!
            </p>

            <Link
                href="/"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#203452] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#314D73]"
            >
                Mulai Belanja
                <ArrowRight size={17} />
            </Link>
        </div>
    );
};

export default EmptyCart;
