import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeModeState] = useState(() => {
    try {
      const stored = localStorage.getItem("mindbloom_theme");
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
    } catch (e) {
      // ignore
    }
    return "system";
  });

  const [effectiveTheme, setEffectiveTheme] = useState("light");

  const setThemeMode = (mode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem("mindbloom_theme", mode);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let isDark = false;
      if (themeMode === "system") {
        isDark = mediaQuery.matches;
      } else {
        isDark = themeMode === "dark";
      }

      setEffectiveTheme(isDark ? "dark" : "light");

      if (isDark) {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
      } else {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
      }
    };

    applyTheme();

    const handleChange = () => {
      if (themeMode === "system") {
        applyTheme();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
