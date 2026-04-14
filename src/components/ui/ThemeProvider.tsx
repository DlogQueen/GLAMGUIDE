'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'dark-purple' | 'dark-pink';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('glam-guide-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme class to document
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('dark', 'dark-purple', 'dark-pink');
    
    // Add selected theme class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'dark-purple') {
      root.classList.add('dark-purple');
    } else if (theme === 'dark-pink') {
      root.classList.add('dark-pink');
    }
    
    // Save preference
    localStorage.setItem('glam-guide-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
