# Chrome Web Store Listing

## Name
DevJSON — JSON API Inspector

## Short Description (132 chars max)
Intercept, format, search, diff, and export JSON API responses in DevTools. Zero permissions. Fast and lightweight.

## Detailed Description

DevJSON adds a dedicated panel to Chrome DevTools for inspecting JSON API responses. Open DevTools, click the DevJSON tab, and every JSON response is automatically captured, formatted, and browsable.

**Why DevJSON?**
Built as a modern alternative to JSON Viewer Pro (unmaintained since 2023). Zero permissions, no data collection, and packed with features the competition lacks.

CORE FEATURES

- Auto-capture all JSON responses (9 MIME types including NDJSON)
- Collapsible JSON tree with syntax coloring and auto-expand
- Search across keys and values with match highlighting
- Next/prev navigation through search results
- One-click copy of formatted JSON
- Request/response header inspection

POWER FEATURES

- JSON diff — compare two responses side by side with color-coded changes
- BigInt precision — large integers (Snowflake IDs, financial APIs) displayed without JS float loss
- Paste/import JSON from clipboard or file
- Export filtered requests as JSON or HAR 1.2
- JSON Lines (NDJSON) format support with auto-detection
- Chunked rendering for 10k+ node responses without lag

DEVELOPER UX

- Keyboard navigation: j/k to browse, / to search, n/N for matches, ? for help
- 4 syntax themes: Dark, Light, Monokai, Solarized
- Resizable split panes
- JSON path display — hover any node to see its path, click to copy
- Expand/collapse all toggle
- URL filter for the request list

PRIVACY FIRST

- Zero permissions — no host access, no tabs, no storage permissions
- No background scripts, no content scripts
- No analytics, no tracking, no network requests
- Open source: https://github.com/dyemane/devjson

LIGHTWEIGHT

- ~42KB total JavaScript bundle (Preact, not React)
- Pure CSS, no runtime CSS-in-JS overhead
- No external dependencies at runtime

## Category
Developer Tools

## Language
English

## Tags
json, api, devtools, developer tools, inspector, network, debug, json viewer, rest api, ndjson

## Screenshots Needed
1. Main view — request list + JSON tree with search highlighting (1280x800)
2. JSON diff — two responses compared side by side (1280x800)
3. Theme picker — showing Monokai or Light theme (1280x800)
4. BigInt badge — response with large integer values (1280x800)
5. Keyboard help overlay (1280x800)

## Promotional Images Needed
- Small tile: 440x280 (required)
- Large tile: 920x680 (optional, recommended)
- Marquee: 1400x560 (optional)

## Screenshot Instructions
1. Open any page with JSON APIs (GitHub, any SPA with REST/GraphQL)
2. Open DevTools > DevJSON tab
3. Let a few requests populate
4. For each screenshot:
   - Resize DevTools window to ~1280px wide
   - Use Chrome's built-in screenshot: Ctrl+Shift+P > "Capture screenshot"
   - Or use a screenshot tool at 1280x800

## Privacy Policy URL
Host PRIVACY.md as a GitHub page or link directly to:
https://github.com/dyemane/devjson/blob/master/PRIVACY.md
