import { useState } from "preact/hooks";
import { themes } from "../lib/themes";

interface ThemePickerProps {
  themeId: string;
  onSelect: (id: string) => void;
}

export function ThemePicker({ themeId, onSelect }: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const current = themes.find((t) => t.id === themeId) ?? themes[0];

  return (
    <div class="toolbar__dropdown-wrap">
      <button
        class="toolbar__btn"
        onClick={() => setOpen(!open)}
        title="Switch theme"
      >
        {current.label} ▾
      </button>
      {open && (
        <div class="toolbar__dropdown">
          {themes.map((t) => (
            <button
              key={t.id}
              class={`toolbar__dropdown-item${t.id === themeId ? " toolbar__dropdown-item--active" : ""}`}
              onClick={() => {
                onSelect(t.id);
                setOpen(false);
              }}
            >
              <span
                class="theme-swatch"
                style={{
                  background: t.vars["--bg-primary"],
                  borderColor: t.vars["--border"],
                }}
              />
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
