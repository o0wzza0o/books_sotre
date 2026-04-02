import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book } from '../types';

interface WishlistStore {
  items: Book[];
  addItem: (book: Book) => void;
  removeItem: (bookId: number) => void;
  toggleItem: (book: Book) => void;
  isWishlisted: (bookId: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (book) => {
        if (!get().isWishlisted(book.id)) {
          set((state) => ({ items: [...state.items, book] }));
        }
      },

      removeItem: (bookId) => {
        set((state) => ({ items: state.items.filter((b) => b.id !== bookId) }));
      },

      toggleItem: (book) => {
        if (get().isWishlisted(book.id)) {
          get().removeItem(book.id);
        } else {
          get().addItem(book);
        }
      },

      isWishlisted: (bookId) => get().items.some((b) => b.id === bookId),
    }),
    { name: 'maktaba-wishlist' }
  )
);
