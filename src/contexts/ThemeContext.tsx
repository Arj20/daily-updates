import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { ThemeContext, type ThemeContextType } from "./ThemeContext";
import { lightTheme, darkTheme } from "../utils/themes";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // Update CSS variables
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [isDark, theme]);

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
