import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (book) => {
        const existing = get().items.find((i) => i.book.id === book.id);
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, { book, quantity: 1 }] }));
        }
      },

      removeItem: (bookId) => {
        set((state) => ({ items: state.items.filter((i) => i.book.id !== bookId) }));
      },

      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.book.id === bookId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.book.price * i.quantity, 0),
    }),
    { name: 'maktaba-cart' }
  )
);
