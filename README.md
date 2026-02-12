# DevJSON

**JSON API Inspector for Chrome DevTools**

A DevTools panel that automatically captures, formats, searches, and analyzes JSON API responses. Built as a modern replacement for JSON Viewer Pro.

## Install

### Chrome Web Store
*Coming soon*

### From Source
```bash
git clone https://github.com/dyemane/devjson.git
cd devjson
npm install && npm run build
```
1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `dist/` folder
4. Open DevTools on any page — find the **DevJSON** tab

## Features

### Core
- **Auto-capture** — intercepts all JSON responses (9 MIME types including NDJSON)
- **JSON tree** — collapsible, syntax-colored, auto-expands first 2 levels
- **Search** — filter by key names and values, next/prev navigation, match counter
- **Copy** — one-click copy of formatted JSON to clipboard
- **Headers** — expandable request/response header inspection
- **Zero permissions** — no host access, no background scripts, no data collection

### Power Features
- **JSON diff** — set a base request, select another to compare with color-coded additions, removals, and changes
- **BigInt precision** — integers > 2^53 displayed without JS float precision loss (Snowflake IDs, financial APIs)
- **Import/Export** — paste from clipboard, import files, export as JSON or HAR 1.2
- **NDJSON** — auto-detects JSON Lines format, parses each line separately
- **Chunked rendering** — handles 10k+ node responses without lag

### Developer UX
- **Keyboard navigation** — `j`/`k` requests, `/` search, `n`/`N` matches, `?` help
- **4 themes** — Dark, Light, Monokai, Solarized (persisted in localStorage)
- **Resizable panes** — drag to resize sidebar and detail panel
- **JSON path** — hover any node to see `$.path.to.key`, click to copy
- **URL filter** — filter request list by URL or method

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `j` / `↓` | Next request |
| `k` / `↑` | Previous request |
| `/` or `Ctrl+F` | Focus search |
| `Enter` / `Shift+Enter` | Next / previous search match |
| `n` / `Shift+n` | Next / previous search match (outside input) |
| `Escape` | Clear search, then close detail pane |
| `?` | Toggle keyboard shortcut help |

## Development

```bash
npm run dev        # vite build --watch
npm run build      # tsc --noEmit && vite build
npm test           # vitest (80 tests)
npm run lint       # biome check
npm run package    # build + zip for Chrome Web Store
```

After changes, close and reopen DevTools or click the refresh icon on the extension card in `chrome://extensions`.

## Architecture

```
devtools.html → devtools.ts → chrome.devtools.panels.create("DevJSON")
panel.html → main.tsx → <App />
  ├── Toolbar         (clear, copy, paste, import, export, diff, theme)
  ├── Sidebar
  │   ├── URL filter  (debounced, case-insensitive)
  │   └── RequestList → RequestItem (method, url, status, time, size)
  ├── Detail pane
  │   ├── SearchBar   (debounced, next/prev, clear)
  │   ├── DetailHeader (method, status, timing, headers)
  │   └── JsonTree → JsonNode (recursive, collapsible, chunked)
  ├── DiffViewer      (side-by-side comparison)
  └── KeyboardHelp    (shortcut overlay)
```

### Key Decisions

| Decision | Why |
|----------|-----|
| Preact over React | ~3KB vs ~40KB, identical API |
| Plain CSS with CSS vars | ~500 lines, runtime theme switching |
| No background/content scripts | Pure DevTools panel, zero permissions |
| Custom JSON tree | Full control over search, BigInt, chunking |
| Regex-based BigInt parser | Preserves precision without native BigInt serialization |
| Chunk-based lazy rendering | Simple, no virtual scroll dependency, handles 10k+ nodes |

## Stack

- **Runtime:** Preact 10
- **Build:** Vite 6, TypeScript 5
- **Test:** Vitest (80 tests)
- **Lint:** Biome
- **Platform:** Chrome Extensions Manifest V3

## Privacy

DevJSON collects no data. Zero permissions, no analytics, no network requests. See [PRIVACY.md](PRIVACY.md).

## License

MIT
