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

## In Progress

- [ ] Search next/prev navigation with keyboard shortcuts

## Up Next

### High Impact (competitive gaps + most requested)
- [ ] Search next/prev with up/down arrows and match counter (e.g. "3 of 27")
- [ ] JSON path display (show path to selected node, click to copy)
- [ ] Expand/collapse all toggle
- [ ] Filter requests by URL pattern
- [ ] Large JSON virtualization (perf for 10k+ node responses)

### Medium Impact (differentiation)
- [ ] JSON diff — compare two captured responses side by side
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
