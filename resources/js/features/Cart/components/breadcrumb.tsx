import { Link } from "@inertiajs/react";

const Breadcrumb = () => {
    return (
        <div className="mb-8 flex items-center gap-2 text-sm text-[#667085]">
            <Link href="/" className="transition hover:text-[#203452]">
                Beranda
            </Link>
            <span>/</span>
            <span className="font-medium text-[#203452]">Keranjang</span>
        </div>
    );
};

export default Breadcrumb;
