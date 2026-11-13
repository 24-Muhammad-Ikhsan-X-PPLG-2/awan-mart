import { Address, CheckoutItem } from '@/features/Checkout/types';
import { FC } from 'react';
import ShippingAddress from './ShippingAddress';
import Products from './Products';
import PaymentMethod from './PaymentMethod';
import RightSummary from './RightSummary';

type Props = {
    address: Address | null;
    setAddress: (v: Address | null) => void;
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

                {/* Products */}
                <Products items={items} />

                {/* Payment Method */}
                <PaymentMethod />
            </div>

            {/* Right Summary */}
            <RightSummary
                address={address}
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
