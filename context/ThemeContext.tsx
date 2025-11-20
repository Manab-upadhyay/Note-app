// context/ThemeContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Appearance } from "react-native";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: Record<string, string>;
};

const light = {
  background: "#F9FAFB",
  card: "#FFFFFF",
  primary: "#2563EB",
  text: "#0F172A",
  muted: "#6B7280",
  danger: "#EF4444",
  border: "#E5E7EB",
  blueFallback: "#2563EB",
};

const dark = {
  background: "#0B1220",
  card: "#071026",
  primary: "#4F8CF5",
  text: "#E6EEF8",
  muted: "#94A3B8",
  danger: "#F87171",
  border: "#1F2937",
  blueFallback: "#67A7FF",
};

const ThemeContext = createContext<ThemeContextType>({} as any);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const system = Appearance.getColorScheme();
  const [theme, setTheme] = useState<ThemeMode>(
    (system as ThemeMode) ?? "light"
  );

  useEffect(() => {
    // Optionally listen to system changes:
    // const sub = Appearance.addChangeListener(({ colorScheme }) => setTheme((colorScheme as ThemeMode) ?? "light"));
    // return () => sub.remove();
  }, []);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  const colors = theme === "light" ? light : dark;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  return useContext(ThemeContext);
}
