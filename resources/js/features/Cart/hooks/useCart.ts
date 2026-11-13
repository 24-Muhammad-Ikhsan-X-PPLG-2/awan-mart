import { useEffect, useMemo, useRef, useState } from "react";
import { CartItem } from "@/types/types";
import { router } from "@inertiajs/react";
import { useCartStore } from "@/stores/cart-store";

const useCart = ({ dataCart }: { dataCart: CartItem[] }) => {
    const [cart, setCart] = useState<CartItem[]>(dataCart);
    const { setCartCount, cartCount } = useCartStore();
    // Derived data
    const selectedItems = useMemo(
        () => cart.filter((item) => item.product.selected),
        [cart],
    );

    const selectedCount = useMemo(
        () => selectedItems.reduce((total, item) => total + item.quantity, 0),
        [selectedItems],
    );

    const subtotal = useMemo(
        () =>
            selectedItems.reduce(
                (total, item) =>
                    total + Number(item.product.price) * item.quantity,
                0,
            ),
        [selectedItems],
    );

    const allSelected =
        cart.length > 0 && cart.every((item) => item.product.selected);

    // Toggle individual product
    const toggleItem = (id: number) => {
        setCart((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          product: {
                              ...item.product,
                              selected: !item.product.selected,
                          },
                      }
                    : item,
            ),
        );
    };

    // Toggle all products
    const toggleSelectAll = () => {
        setCart((current) =>
            current.map((item) => ({
                ...item,
                product: {
                    ...item.product,
                    selected: !item.product.selected,
                },
            })),
        );
    };

    // Remove product
    const removeItem = (id: number) => {
        const selected = cart.find((item) => item.id == id);
        if (typeof selected === "undefined") {
            return;
        }
        router.delete("/cart/items", {
            data: {
                ids: [selected.id],
            },
            preserveScroll: true,
            preserveState: true,
        });
        setCartCount(cartCount - selected.quantity);
        setCart((current) => current.filter((item) => item.id !== id));
    };

    // Remove selected products
    const removeSelected = () => {
        const cartSelected = cart.filter((item) => item.product.selected);
        router.delete("/cart/items", {
            data: {
                ids: cartSelected.map((item) => item.id),
            },
            preserveScroll: true,
            preserveState: true,
        });
        cartSelected.forEach((item) => {
            setCartCount(cartCount - item.quantity);
        });
        setCart((current) => current.filter((item) => !item.product.selected));
    };

    // Checkout selected products
    const handleCheckout = () => {
        if (selectedItems.length === 0) return;

        const checkoutItems = selectedItems.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
        }));

        router.post("/checkout", {
            items: checkoutItems,
        });
    };

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    return {
        cart,
        selectedItems,
        selectedCount,
        subtotal,
        allSelected,
        totalItems,
        toggleItem,
        toggleSelectAll,
        removeItem,
        removeSelected,
        handleCheckout,
        setCart,
    };
};

export default useCart;
