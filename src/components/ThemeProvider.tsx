'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();

  // Only run after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check local storage or system preference
    const storedTheme = localStorage.getItem('theme') as Theme;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(storedTheme || systemTheme);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Update document class when theme changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Update RTL class based on locale
  useEffect(() => {
    if (!mounted) return;

    document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', locale);
    document.documentElement.style.direction = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale, mounted]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
