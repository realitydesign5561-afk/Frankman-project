import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '../types';

export interface AppliedDiscount {
  code: string;
  percentage: number;
  amountKobo: number;
  message: string;
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  appliedDiscount: AppliedDiscount | null;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  applyDiscount: (discount: AppliedDiscount | null) => void;

  // Computed getters
  getItemKey: (item: Pick<CartItem, 'productId' | 'variationId'>) => string;
  getTotalCount: () => number;
  getSubtotalKobo: () => number;
}

export const getCartItemKey = (item: Pick<CartItem, 'productId' | 'variationId'>): string => {
  return `${item.productId}__${item.variationId || 'default'}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      appliedDiscount: null,

      getItemKey: getCartItemKey,

      addItem: (item, quantity = 1) => {
        const key = getCartItemKey(item);
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (i) => getCartItemKey(i) === key
        );

        if (existingIndex > -1) {
          const updated = [...currentItems];
          const existing = updated[existingIndex];
          const targetQty = existing.quantity + quantity;
          // Clamp to available stock
          const clampedQty = Math.min(targetQty, existing.stockAvailable || 99);

          updated[existingIndex] = {
            ...existing,
            quantity: clampedQty,
            unitPriceKobo: item.unitPriceKobo, // refresh latest price
            stockAvailable: item.stockAvailable,
          };
          set({ items: updated, isDrawerOpen: true });
        } else {
          const clampedQty = Math.min(quantity, item.stockAvailable || 99);
          set({
            items: [...currentItems, { ...item, quantity: Math.max(1, clampedQty) }],
            isDrawerOpen: true,
          });
        }
      },

      updateQuantity: (cartItemId, newQuantity) => {
        const currentItems = get().items;
        if (newQuantity <= 0) {
          set({
            items: currentItems.filter((i) => getCartItemKey(i) !== cartItemId),
          });
          return;
        }

        const updated = currentItems.map((item) => {
          if (getCartItemKey(item) === cartItemId) {
            const clamped = Math.min(newQuantity, item.stockAvailable || 99);
            return { ...item, quantity: clamped };
          }
          return item;
        });

        set({ items: updated });
      },

      removeItem: (cartItemId) => {
        set({
          items: get().items.filter((i) => getCartItemKey(i) !== cartItemId),
        });
      },

      clearCart: () => {
        set({ items: [], appliedDiscount: null });
      },

      setDrawerOpen: (isOpen) => {
        set({ isDrawerOpen: isOpen });
      },

      applyDiscount: (discount) => {
        set({ appliedDiscount: discount });
      },

      getTotalCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotalKobo: () => {
        return get().items.reduce(
          (acc, item) => acc + item.unitPriceKobo * item.quantity,
          0
        );
      },
    }),
    {
      name: 'frankman_cart_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedDiscount: state.appliedDiscount,
      }),
    }
  )
);
