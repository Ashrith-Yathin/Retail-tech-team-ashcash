"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark";
type DietMode = "veg" | "all";

type AppPreferencesContextValue = {
  theme: ThemeMode;
  dietMode: DietMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setDietMode: (mode: DietMode) => void;
  toggleDietMode: () => void;
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

const THEME_KEY = "dealdrop-theme";
const DIET_KEY = "dealdrop-diet";

function applyDocumentState(theme: ThemeMode, dietMode: DietMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.diet = dietMode;
}

export function AppPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [dietMode, setDietModeState] = useState<DietMode>("veg");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_KEY) as ThemeMode | null;
    const storedDiet = window.localStorage.getItem(DIET_KEY) as DietMode | null;
    const initialTheme = storedTheme || "light";
    const initialDiet = storedDiet || "veg";
    setThemeState(initialTheme);
    setDietModeState(initialDiet);
    applyDocumentState(initialTheme, initialDiet);
  }, []);

  function setTheme(themeValue: ThemeMode) {
    setThemeState(themeValue);
    window.localStorage.setItem(THEME_KEY, themeValue);
    applyDocumentState(themeValue, dietMode);
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  function setDietMode(mode: DietMode) {
    setDietModeState(mode);
    window.localStorage.setItem(DIET_KEY, mode);
    applyDocumentState(theme, mode);
  }

  function toggleDietMode() {
    setDietMode(dietMode === "veg" ? "all" : "veg");
  }

  const value = useMemo(
    () => ({
      theme,
      dietMode,
      setTheme,
      toggleTheme,
      setDietMode,
      toggleDietMode
    }),
    [theme, dietMode]
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);
  if (!context) {
    throw new Error("useAppPreferences must be used inside AppPreferencesProvider");
  }
  return context;
}
