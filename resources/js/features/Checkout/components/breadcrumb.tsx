import { ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
    return (
        <div className="mb-6 flex items-center gap-2 text-sm text-[#98A2B3]">
            <span>Keranjang</span>
            <ChevronRight size={15} />
            <span className="font-semibold text-[#203452]">Checkout</span>
        </div>
    );
};

export default Breadcrumb;
