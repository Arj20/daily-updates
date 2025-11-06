import { createContext } from "react";
import type { Theme } from "../types";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
