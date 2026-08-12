import { createContext, useContext, useEffect, useState } from "react";
import { storageService } from "../services/storageService";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const settings = storageService.getSettings();
    setTheme(settings.theme ?? "light");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    const currentSettings = storageService.getSettings();

    storageService.saveSettings({
      ...currentSettings,
      theme,
    });
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "light" ? "dark" : "light"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};