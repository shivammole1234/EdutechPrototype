import React, { useEffect } from 'react';
import { AppRouter } from '@/router/AppRouter';
import { useThemeStore } from '@/store/themeStore';

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <AppRouter />;
}
