export interface Theme {
  id: string;
  label: string;
  vars: Record<string, string>;
}

export const themes: Theme[] = [
  {
    id: "dark",
    label: "Dark",
    vars: {
      "--bg-primary": "#1e1e1e",
      "--bg-secondary": "#252526",
      "--bg-tertiary": "#2d2d30",
      "--bg-hover": "#37373d",
      "--bg-selected": "#094771",
      "--bg-match": "#613214",
      "--bg-jp-match": "#1a3a5c",
      "--bg-jp-active": "#1a4a7a",
      "--text-primary": "#cccccc",
      "--text-secondary": "#858585",
      "--text-muted": "#5a5a5a",
      "--border": "#3c3c3c",
      "--accent": "#0098ff",
      "--status-ok": "#4ec9b0",
      "--status-warn": "#ce9178",
      "--status-error": "#f14c4c",
      "--json-key": "#9cdcfe",
      "--json-string": "#ce9178",
      "--json-number": "#b5cea8",
      "--json-boolean": "#569cd6",
      "--json-null": "#858585",
      "--wf-blocked": "#c8c8c8",
      "--wf-dns": "#009688",
      "--wf-connect": "#ff9800",
      "--wf-ssl": "#9c27b0",
      "--wf-send": "#4caf50",
      "--wf-wait": "#2196f3",
      "--wf-receive": "#8bc34a",
    },
  },
  {
    id: "light",
    label: "Light",
    vars: {
      "--bg-primary": "#ffffff",
      "--bg-secondary": "#f3f3f3",
      "--bg-tertiary": "#e8e8e8",
      "--bg-hover": "#dcdcdc",
      "--bg-selected": "#cce5ff",
      "--bg-match": "#fff3cd",
      "--bg-jp-match": "#d6eaff",
      "--bg-jp-active": "#a8d4ff",
      "--text-primary": "#1e1e1e",
      "--text-secondary": "#6e6e6e",
      "--text-muted": "#a0a0a0",
      "--border": "#d4d4d4",
      "--accent": "#0066cc",
      "--status-ok": "#107c41",
      "--status-warn": "#c17e28",
      "--status-error": "#d32f2f",
      "--json-key": "#0451a5",
      "--json-string": "#a31515",
      "--json-number": "#098658",
      "--json-boolean": "#0000ff",
      "--json-null": "#6e6e6e",
      "--wf-blocked": "#bdbdbd",
      "--wf-dns": "#00897b",
      "--wf-connect": "#ef6c00",
      "--wf-ssl": "#7b1fa2",
      "--wf-send": "#388e3c",
      "--wf-wait": "#1565c0",
      "--wf-receive": "#689f38",
    },
  },
  {
    id: "monokai",
    label: "Monokai",
    vars: {
      "--bg-primary": "#272822",
      "--bg-secondary": "#2e2f2a",
      "--bg-tertiary": "#3e3d32",
      "--bg-hover": "#49483e",
      "--bg-selected": "#49483e",
      "--bg-match": "#5c4d1a",
      "--bg-jp-match": "#1a3d5c",
      "--bg-jp-active": "#1a507a",
      "--text-primary": "#f8f8f2",
      "--text-secondary": "#a6a28c",
      "--text-muted": "#75715e",
      "--border": "#49483e",
      "--accent": "#66d9ef",
      "--status-ok": "#a6e22e",
      "--status-warn": "#e6db74",
      "--status-error": "#f92672",
      "--json-key": "#66d9ef",
      "--json-string": "#e6db74",
      "--json-number": "#ae81ff",
      "--json-boolean": "#ae81ff",
      "--json-null": "#75715e",
      "--wf-blocked": "#c8c8c8",
      "--wf-dns": "#009688",
      "--wf-connect": "#ff9800",
      "--wf-ssl": "#9c27b0",
      "--wf-send": "#4caf50",
      "--wf-wait": "#2196f3",
      "--wf-receive": "#8bc34a",
    },
  },
  {
    id: "solarized",
    label: "Solarized",
    vars: {
      "--bg-primary": "#002b36",
      "--bg-secondary": "#073642",
      "--bg-tertiary": "#0a4050",
      "--bg-hover": "#0d4f5e",
      "--bg-selected": "#0d4f5e",
      "--bg-match": "#3d4a1a",
      "--bg-jp-match": "#0d3a50",
      "--bg-jp-active": "#0d4f6e",
      "--text-primary": "#93a1a1",
      "--text-secondary": "#657b83",
      "--text-muted": "#586e75",
      "--border": "#073642",
      "--accent": "#268bd2",
      "--status-ok": "#859900",
      "--status-warn": "#b58900",
      "--status-error": "#dc322f",
      "--json-key": "#268bd2",
      "--json-string": "#2aa198",
      "--json-number": "#d33682",
      "--json-boolean": "#6c71c4",
      "--json-null": "#586e75",
      "--wf-blocked": "#c8c8c8",
      "--wf-dns": "#009688",
      "--wf-connect": "#ff9800",
      "--wf-ssl": "#9c27b0",
      "--wf-send": "#4caf50",
      "--wf-wait": "#2196f3",
      "--wf-receive": "#8bc34a",
    },
  },
];

const STORAGE_KEY = "devjson-theme";

export function loadThemeId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "dark";
  } catch {
    return "dark";
  }
}

export function saveThemeId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value);
  }
}
