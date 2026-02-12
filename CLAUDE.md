# DevJSON

Chrome DevTools panel extension that intercepts, formats, searches, and analyzes JSON API responses. Zero permissions, pure DevTools panel (Manifest V3).

## Quick Reference

```bash
npm run dev        # vite build --watch
npm run build      # tsc --noEmit && vite build
npm test           # vitest run (89 tests)
npm run lint       # biome check src/
npm run lint:fix   # biome check --fix src/
npm run package    # build + zip for Chrome Web Store
```

After changes: reload the extension in `chrome://extensions` or close/reopen DevTools.

## Stack

- **Preact 10** — UI (~3KB vs React's ~40KB)
- **Vite 6** — build + dev server
- **TypeScript 5** — strict mode, `noEmit` (Vite handles emit)
- **Vitest** — tests co-located as `.test.ts` next to source
- **Biome** — lint + format (tabs, double quotes, semicolons)
- **jsonpath-plus** — JSONPath query evaluation
- **Manifest V3** — zero permissions, no background/content scripts

## Architecture

```
devtools.html → devtools.ts → chrome.devtools.panels.create("DevJSON")
panel.html → main.tsx → <App />
  ├── Toolbar           (clear, copy, paste, import, export, diff, theme)
  ├── Sidebar
  │   ├── URL filter    (debounced, case-insensitive)
  │   └── RequestList → RequestItem (method, url, status, waterfall bar, size)
  ├── Detail pane
  │   ├── SearchBar     (debounced, next/prev, clear)
  │   ├── DetailHeader  (method, status, timing breakdown, headers)
  │   ├── JsonPathBar   (JSONPath query with match navigation)
  │   └── JsonTree → JsonNode (recursive, collapsible, chunked)
  ├── DiffViewer        (side-by-side comparison)
  └── KeyboardHelp      (shortcut overlay)
```

### Directory Layout

```
src/
  panel/
    components/    # Preact functional components (.tsx)
    hooks/         # Custom hooks (use-*.ts) + co-located tests
    lib/           # Pure functions + co-located tests
    styles/        # Plain CSS files, one per component group
    types.ts       # Shared types (CapturedRequest, HeaderEntry, etc.)
    app.tsx        # Root component, state orchestration, keyboard shortcuts
    main.tsx       # Preact render entry point
  shared/
    constants.ts   # MAX_REQUESTS, CHUNK_SIZE, MIME types, etc.
  devtools/
    devtools.ts    # Creates the DevTools panel
public/
  manifest.json    # Chrome extension manifest (zero permissions)
  icons/           # Extension icons (16, 32, 48, 128)
```

### Data Flow

1. `interceptor.ts` listens to `chrome.devtools.network.onRequestFinished`
2. Filters by JSON MIME type, extracts headers + timing + body
3. Calls `onRequest` callback → `useRequests` hook manages the list
4. `App` component wires state between sidebar, detail pane, search, and diff

### Key Types

- **`CapturedRequest`** — core data model for every request (types.ts)
- **`RequestTimings`** — HAR timing phases: blocked, dns, connect, ssl, send, wait, receive
- **`HeaderEntry`** — `{ name, value }` for request/response headers
- **`SearchMatch`** — `{ path, key, value }` for JSON tree search results

## Conventions

### Components

- Functional Preact components, no classes
- Props interface defined above the component in the same file
- CSS class names: BEM-style (`component__element--modifier`)
- One CSS file per component group in `styles/`, imported in `app.tsx`
- State lives in `app.tsx` or custom hooks — components are mostly presentational

### Styling

- Plain CSS with CSS custom properties (no CSS-in-JS, no preprocessors)
- All colors use CSS vars (`--bg-primary`, `--text-secondary`, `--status-ok`, etc.)
- Themes defined in `lib/themes.ts` as `Record<string, string>` applied to `:root`
- `:root` defaults in `panel.css` match the Dark theme
- 4 themes: Dark, Light, Monokai, Solarized — each must define all vars

### Testing

- Tests co-located next to source: `foo.ts` → `foo.test.ts`
- Pure logic in `lib/` is well-tested; components are not unit-tested (manual QA in browser)
- Run `npm test` before committing

### Code Style (enforced by Biome)

- Tabs for indentation
- Double quotes
- Semicolons always
- `type` imports: use `import type { ... }` for type-only imports

## Patterns to Follow

### Adding a New Component

1. Create `src/panel/components/my-component.tsx`
2. If it needs styles, add CSS to an existing `styles/*.css` file or create a new one
3. If new CSS file: import it in `app.tsx`
4. If it introduces new CSS vars: add to `:root` in `panel.css` AND all 4 themes in `themes.ts`

### Adding a New Hook

1. Create `src/panel/hooks/use-my-hook.ts`
2. Wire it into `app.tsx` where state is orchestrated
3. Add tests in `use-my-hook.test.ts`

### Adding a Keyboard Shortcut

1. Add the handler in the `useEffect` keyboard handler in `app.tsx` (~line 96)
2. Add the key to `keyboard-help.tsx`
3. Update README.md shortcuts table

### Chrome DevTools API Constraints

- `navigator.clipboard` is blocked — use `document.execCommand("copy")` via `lib/clipboard.ts`
- `chrome.devtools.network` only exists inside DevTools panel context
- No access to page DOM, no content scripts, no background workers
- Extension cannot be tested in Playwright (no DevTools API) — manual QA required

## Non-Goals

- Page injection / content scripts
- Host permissions or background service workers
- Local `.json` file viewing
- React (Preact only, for bundle size)
