import { Address, CheckoutItem } from '@/types/types';
import { FC } from 'react';
import ShippingAddress from './ShippingAddress';
import Products from './Products';
import PaymentMethod from './PaymentMethod';
import RightSummary from './RightSummary';
import CourierSelector, { CourierOption } from './CourierSelector';

type Props = {
    address: Address | null;
    setAddress: (v: Address | null) => void;
    couriers: CourierOption[];
    selectedCourierId: number | null;
    setSelectedCourierId: (id: number) => void;
    courierName: string | null;
    items: CheckoutItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
    handleCheckout: () => void;
    isSubmitting: boolean;
    checkoutError: string | null;
};

const CheckoutContent: FC<Props> = ({
    address,
    couriers,
    selectedCourierId,
    setSelectedCourierId,
    courierName,
    items,
    shippingCost,
    subtotal,
    setAddress,
    handleCheckout,
    total,
    isSubmitting,
    checkoutError,
}) => {
    return (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_380px]">
            {/* Left Content */}
            <div className="space-y-5">
                {/* Shipping Address */}
                <ShippingAddress setAddress={setAddress} address={address} />

                <CourierSelector
                    couriers={couriers}
                    selectedCourierId={selectedCourierId}
                    onChange={setSelectedCourierId}
                />

                {/* Products */}
                <Products items={items} />

                {/* Payment Method */}
                <PaymentMethod />
            </div>

            {/* Right Summary */}
            <RightSummary
                address={address}
                canSubmit={Boolean(selectedCourierId)}
                courierName={courierName}
                handleCheckout={handleCheckout}
                isSubmitting={isSubmitting}
                checkoutError={checkoutError}
                items={items}
                shippingCost={shippingCost}
                subtotal={subtotal}
                total={total}
            />
        </div>
    );
};

export default CheckoutContent;
