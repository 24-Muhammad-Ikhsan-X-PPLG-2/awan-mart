import Navbar from "@/components/navbar";
import Breadcrumb from "@/features/Cart/components/breadcrumb";
import Heading from "@/features/Cart/components/Heading";
import CartContent from "@/features/Cart/components/CartContent";
import OrderSummary from "@/features/Cart/components/OrderSummary";
import EmptyCart from "@/features/Cart/components/EmptyCart";
import useCart from "@/features/Cart/hooks/useCart";
import { FC } from "react";
import { CartItem } from "@/features/Cart/types/carts";
import { usePage } from "@inertiajs/react";
import ErrorAlert from "@/features/Cart/components/ErrorAlert";
import { AnimatePresence, motion } from "motion/react";

type Props = {
    dataCart: CartItem[];
};

const CartPage: FC<Props> = ({ dataCart }) => {
    const { errors } = usePage().props;
    const {
        allSelected,
        cart,
        totalItems,
        selectedCount,
        selectedItems,
        subtotal,
        handleCheckout,
        removeItem,
        removeSelected,
        toggleItem,
        toggleSelectAll,
        setCart,
    } = useCart({
        dataCart: dataCart.map((item) => ({
            ...item,
            product: {
                ...item.product,
                selected: false,
            },
        })),
    });
    return (
        <main className="min-h-screen bg-[#FAFAFC] text-[#203452]">
            <Navbar activePage="cart" />

            <section className="mx-auto max-w-360 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
                {/* Breadcrumb */}
                <Breadcrumb />

                {/* Heading */}
                <Heading totalItems={totalItems} />
                <ErrorAlert errors={errors} />
                <AnimatePresence mode="sync">
                    {cart.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_380px]"
                            key={"cart-content"}
                        >
                            {/* Cart Content */}
                            <CartContent
                                allSelected={allSelected}
                                cart={cart}
                                removeItem={removeItem}
                                removeSelected={removeSelected}
                                selectedItems={selectedItems}
                                toggleItem={toggleItem}
                                toggleSelectAll={toggleSelectAll}
                                setCart={setCart}
                            />

                            {/* Order Summary */}
                            <OrderSummary
                                handleCheckout={handleCheckout}
                                selectedCount={selectedCount}
                                selectedItems={selectedItems}
                                subtotal={subtotal}
                            />
                        </motion.div>
                    ) : (
                        /* Empty Cart */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <EmptyCart />
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </main>
    );
};

export default CartPage;
