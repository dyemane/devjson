# DevJSON Roadmap

Prioritized by competitive gaps (what users of JSON Viewer Pro / tulios/json-viewer are asking for) and demo impact.

## Done

- [x] Request interception via `chrome.devtools.network`
- [x] Collapsible JSON tree with syntax coloring
- [x] Search with match highlighting
- [x] Copy JSON to clipboard
- [x] Dark theme matching DevTools
- [x] Auto-expand first 2 levels
- [x] Broad MIME type detection (6 types)
- [x] Request/response header inspection
- [x] Resizable sidebar and detail panels
- [x] Closable detail pane
- [x] Zero permissions (pure DevTools panel)
- [x] Custom icon
- [x] Search next/prev navigation with keyboard shortcuts (Enter/Shift+Enter, ▲▼ buttons, "3 of 27" counter)
- [x] JSON path display (hover shows `$.path.to.key`, click to copy)
- [x] Expand/collapse all toggle
- [x] Filter requests by URL pattern (debounced, case-insensitive)
- [x] Search clear button (✕) with Escape key support
- [x] JSON diff — compare two captured responses (set base, select another to diff)
- [x] Paste/import JSON from clipboard or file (JSON, NDJSON, .har, .txt)
- [x] Export filtered requests as JSON or HAR 1.2
- [x] JSON Lines (NDJSON) format support (9 MIME types, auto-detect on parse failure)
- [x] BigInt / numeric precision handling (safe parse with sentinel, `n` badge, precision-preserving copy)
- [x] Large JSON virtualization (chunk-based lazy rendering, 100 items per chunk, "Show more" / "Show all", node count indicator)

- [x] Syntax themes — Dark, Light, Monokai, Solarized (persisted in localStorage)
- [x] Keyboard navigation — j/k requests, n/N search matches, / to search, ? for help overlay

### Nice to Have
- [ ] JSONPath query bar (e.g. `$.data[*].name`)
- [ ] Pin/bookmark specific requests
- [ ] Request timing waterfall visualization

## Non-Goals

- Page injection / content scripts (stay as pure DevTools panel)
- Host permissions
- Background service worker
- Local .json file viewing (different architecture, out of scope)
