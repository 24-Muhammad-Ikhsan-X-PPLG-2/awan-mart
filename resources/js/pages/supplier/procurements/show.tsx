import { Head } from '@inertiajs/react';
import SupplierLayout from '@/features/supplier/components/SupplierLayout';
import SupplierProcurementDetails from '@/features/supplier/components/SupplierProcurementDetails';
import type { SupplierProcurementDetailProps } from '@/features/supplier/types';

const SupplierProcurementShow = ({
    supplier,
    procurement,
    success,
}: SupplierProcurementDetailProps) => (
    <>
        <Head title={`Pengadaan ${procurement.number}`} />
        <SupplierLayout
            supplier={supplier}
            title="Detail Permintaan"
            description="Periksa produk, kuantitas, dan tindak lanjuti permintaan pengadaan."
        >
            <SupplierProcurementDetails
                procurement={procurement}
                success={success}
            />
        </SupplierLayout>
    </>
);

export default SupplierProcurementShow;
