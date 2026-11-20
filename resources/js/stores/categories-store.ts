import { Category } from '@/types/types';
import { create } from 'zustand';

type CategoriesState = {
    categories: Category[] | null;
    setCategories: (v: Category[] | null) => void;
};

export const useCategories = create<CategoriesState>((set) => ({
    categories: null,
    setCategories: (categories) =>
        set({
            categories,
        }),
}));
