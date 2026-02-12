# DevJSON

Developer Request Inspector — a Chrome DevTools panel that intercepts, formats, searches, and copies JSON API responses.

## Features

- **Auto-capture** — Intercepts all JSON responses via `chrome.devtools.network`
- **Collapsible JSON tree** — Recursive viewer with syntax coloring and auto-expand
- **Search** — Filter by key names and values with match highlighting
- **Copy** — One-click copy of formatted JSON to clipboard
- **Zero permissions** — No host access, no background scripts, no content scripts
- **Dark theme** — Matches Chrome DevTools aesthetic

## Install

```bash
npm install
npm run build
```

Then load in Chrome:

1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `dist/` folder
4. Open DevTools on any page — find the **DevJSON** tab

## Development

```bash
npm run dev        # vite build --watch (rebuilds on save)
npm run build      # tsc --noEmit && vite build
npm test           # vitest run
npm run lint       # biome check
```

After changes, close and reopen DevTools (or click the refresh icon on the extension card in `chrome://extensions`).

## Architecture

```
devtools.html → src/devtools/devtools.ts
  └── chrome.devtools.panels.create("DevJSON", ..., "panel.html")

panel.html → src/panel/main.tsx → <App />
  ├── Toolbar        (clear, copy, request count)
  ├── RequestList    (scrollable sidebar)
  │   └── RequestItem (method, url, status, time, size)
  ├── SearchBar      (debounced filter with match count)
  └── JsonTree       (recursive collapsible viewer)
      └── JsonNode   (expand/collapse, syntax coloring, match highlighting)
```

### Key decisions

| Decision | Why |
|----------|-----|
| Preact over React | ~3KB vs ~40KB, identical API for this use case |
| Plain CSS | ~300 lines total, not worth CSS-in-JS overhead |
| No background/content scripts | Pure DevTools panel, minimal permissions |
| Custom JSON tree | Full control over search highlighting, ~80 lines |
| 500-request cap | Prevents memory issues in long sessions |
| `base: "./"` in Vite | Chrome extensions use `chrome-extension://` protocol |

## Stack

- Preact + TypeScript
- Vite (build)
- Biome (lint/format)
- Vitest (testing)
- Chrome Extensions Manifest V3

## License

MIT
