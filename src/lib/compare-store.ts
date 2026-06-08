'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompareItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface CompareState {
  compareItems: CompareItem[];
  addItem: (item: CompareItem) => boolean;
  removeItem: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareItems: [],

      addItem: (item: CompareItem) => {
        const { compareItems } = get();
        if (compareItems.some((i) => i.id === item.id)) return false;
        if (compareItems.length >= 3) return false;
        set({ compareItems: [...compareItems, item] });
        return true;
      },

      removeItem: (id: string) => {
        set({ compareItems: get().compareItems.filter((i) => i.id !== id) });
      },

      clearAll: () => {
        set({ compareItems: [] });
      },

      isInCompare: (id: string) => {
        return get().compareItems.some((i) => i.id === id);
      },
    }),
    {
      name: 'compare-storage',
    }
  )
);
