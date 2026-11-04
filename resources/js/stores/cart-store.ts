import { create } from "zustand";

type CartState = {
    cartCount: number;
    setCartCount: (v: number) => void;
    incrementCount: (quantity?: number) => void;
};

export const useCartStore = create<CartState>((set) => ({
    cartCount: 0,
    setCartCount: (count) =>
        set({
            cartCount: count,
        }),
    incrementCount: (quantity = 1) =>
        set((state) => ({
            cartCount: quantity + state.cartCount,
        })),
}));
