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

## Up Next

### High Impact (competitive gaps + most requested)
- [ ] Large JSON virtualization (perf for 10k+ node responses)
- [ ] BigInt / numeric precision handling (avoid JS float issues)
- [ ] JSON Lines (NDJSON) format support
- [ ] Paste/import JSON from clipboard
- [ ] Export filtered requests as HAR or JSON

### Nice to Have
- [ ] JSONPath query bar (e.g. `$.data[*].name`)
- [ ] Syntax themes (light mode, Monokai, Solarized)
- [ ] Keyboard-only navigation (j/k through requests, arrow keys in tree)
- [ ] Pin/bookmark specific requests
- [ ] Request timing waterfall visualization

## Non-Goals

- Page injection / content scripts (stay as pure DevTools panel)
- Host permissions
- Background service worker
- Local .json file viewing (different architecture, out of scope)
