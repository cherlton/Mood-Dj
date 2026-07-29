import { useState, useEffect } from "react";
import { THEMES } from "../constants/themeConstants";

/**
 * Custom hook to detect time of day and select corresponding theme config.
 * @returns {{ themeKey: string, currentTheme: object, currentTime: string }}
 */
export function useTheme() {
  const [themeKey, setThemeKey] = useState("morning");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTimeAndTheme = () => {
      const now = new Date();
      const hours = now.getHours();

      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      if (hours >= 6 && hours < 10) {
        setThemeKey("morning");
      } else if (hours >= 10 && hours < 15) {
        setThemeKey("midday");
      } else if (hours >= 15 && hours < 20) {
        setThemeKey("sunset");
      } else {
        setThemeKey("night");
      }
    };

    updateTimeAndTheme();
    const interval = setInterval(updateTimeAndTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  const currentTheme = THEMES[themeKey] || THEMES.morning;

  return {
    themeKey,
    currentTheme,
    currentTime,
  };
}

export default useTheme;
