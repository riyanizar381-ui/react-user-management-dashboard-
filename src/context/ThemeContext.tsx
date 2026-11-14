import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext } from './ThemeContextValue';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', String(isDark));
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((previous) => !previous);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}