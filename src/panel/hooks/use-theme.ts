import { useCallback, useEffect, useState } from "preact/hooks";
import { themes, loadThemeId, saveThemeId, applyTheme } from "../lib/themes";

export function useTheme() {
  const [themeId, setThemeId] = useState(loadThemeId);

  useEffect(() => {
    const theme = themes.find((t) => t.id === themeId) ?? themes[0];
    applyTheme(theme);
    saveThemeId(theme.id);
  }, [themeId]);

  const cycleTheme = useCallback(() => {
    setThemeId((current) => {
      const idx = themes.findIndex((t) => t.id === current);
      return themes[(idx + 1) % themes.length].id;
    });
  }, []);

  const currentLabel = themes.find((t) => t.id === themeId)?.label ?? "Dark";

  return { themeId, setThemeId, cycleTheme, currentLabel };
}
