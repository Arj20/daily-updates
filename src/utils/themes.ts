import type { Theme } from "../types";

export const lightTheme: Theme = {
  name: "light",
  colors: {
    primary: "#ff69b4", // Hot pink
    secondary: "#ffc0cb", // Light pink
    background: "#fff5fd", // Very light pink
    surface: "#ffffff",
    text: "#2d1b25",
    textSecondary: "#6b4567",
    accent: "#ff1493", // Deep pink
    success: "#ff69b4",
    error: "#ff6b9d",
    warning: "#ffb3d1",
  },
};

export const darkTheme: Theme = {
  name: "dark",
  colors: {
    primary: "#ff69b4", // Hot pink
    secondary: "#8b4982", // Dark pink
    background: "#1a0f17", // Very dark pink
    surface: "#2d1b25",
    text: "#ffc0cb", // Light pink text
    textSecondary: "#cc8fcc",
    accent: "#ff1493", // Deep pink
    success: "#ff69b4",
    error: "#ff6b9d",
    warning: "#ffb3d1",
  },
};
