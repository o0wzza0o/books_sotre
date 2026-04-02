import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (val: boolean) => void;
}

const applyTheme = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDarkMode: false,

      toggleTheme: () =>
        set((state) => {
          const next = !state.isDarkMode;
          applyTheme(next);
          return { isDarkMode: next };
        }),

      setDarkMode: (val) => {
        applyTheme(val);
        set({ isDarkMode: val });
      },
    }),
    {
      name: 'maktaba-theme',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.isDarkMode);
      },
    }
  )
);
