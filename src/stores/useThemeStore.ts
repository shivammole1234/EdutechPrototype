import { create } from 'zustand';

interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Read initial from localStorage or default to dark (developer preference)
  const saved = typeof window !== 'undefined' ? localStorage.getItem('codepulse_theme') : null;
  const initialTheme: 'dark' | 'light' = saved === 'light' ? 'light' : 'dark';

  if (typeof document !== 'undefined') {
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return {
    theme: initialTheme,
    toggleTheme: () =>
      set((state) => {
        const next = state.theme === 'dark' ? 'light' : 'dark';
        if (typeof window !== 'undefined') {
          localStorage.setItem('codepulse_theme', next);
          if (next === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        return { theme: next };
      }),
    setTheme: (theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('codepulse_theme', theme);
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      set({ theme });
    },
  };
});
