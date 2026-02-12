import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import { useRequests } from "./hooks/use-requests";
import { useJsonSearch } from "./hooks/use-json-search";
import { useResize } from "./hooks/use-resize";
import { Toolbar } from "./components/toolbar";
import { RequestList } from "./components/request-list";
import { DetailHeader } from "./components/detail-header";
import { JsonTree } from "./components/json-tree";
import { SearchBar } from "./components/search-bar";
import { EmptyState } from "./components/empty-state";
import { DiffViewer } from "./components/diff-viewer";
import { SEARCH_DEBOUNCE_MS } from "../shared/constants";
import type { CapturedRequest } from "./types";
import "./styles/panel.css";
import "./styles/toolbar.css";
import "./styles/request-list.css";
import "./styles/json-tree.css";
import "./styles/detail-header.css";
import "./styles/diff-viewer.css";

export function App() {
  const { requests, selected, selectedId, setSelectedId, clear, addImported } =
    useRequests();
  const { query, setQuery, matches, matchPaths, activeIndex, activePath, next, prev } =
    useJsonSearch(selected?.parsed ?? null);
  const { size: sidebarWidth, onMouseDown: onSidebarResize } = useResize(340);
  const { size: detailHeaderHeight, onMouseDown: onDetailResize } = useResize(
    120,
    60,
    500,
    "vertical",
  );

  const [urlFilter, setUrlFilter] = useState("");
  const filterTimer = useRef<ReturnType<typeof setTimeout>>();
  const filterInputRef = useRef<HTMLInputElement>(null);
  const [diffBase, setDiffBase] = useState<CapturedRequest | null>(null);

  const handleFilterInput = useCallback((e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    clearTimeout(filterTimer.current);
    filterTimer.current = setTimeout(() => setUrlFilter(value), SEARCH_DEBOUNCE_MS);
  }, []);

  const clearFilter = useCallback(() => {
    if (filterInputRef.current) filterInputRef.current.value = "";
    clearTimeout(filterTimer.current);
    setUrlFilter("");
  }, []);

  const filteredRequests = useMemo(() => {
    if (!urlFilter.trim()) return requests;
    const q = urlFilter.trim().toLowerCase();
    return requests.filter((r) => {
      const haystack = `${r.method} ${r.url}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [requests, urlFilter]);

  const closeDetail = () => setSelectedId(null);

  const handleSetDiffBase = () => {
    if (selected) {
      setDiffBase(selected);
      setSelectedId(null);
    }
  };

  const handleClearDiff = () => {
    setDiffBase(null);
  };

  // In diff mode, selecting a request shows the diff
  const showDiff = diffBase && selected && diffBase.id !== selected.id;

  return (
    <div class="app">
      <Toolbar
        count={requests.length}
        filteredCount={filteredRequests.length}
        requests={requests}
        filteredRequests={filteredRequests}
        selected={selected}
        diffBase={diffBase}
        onClear={clear}
        onSetDiffBase={handleSetDiffBase}
        onClearDiff={handleClearDiff}
        onImport={addImported}
      />
      <div class="app__body">
        <div class="app__sidebar" style={{ width: `${sidebarWidth}px` }}>
          <div class="sidebar-header">
            <span class="sidebar-header__title">
              {diffBase ? "Select to compare" : "Requests"}
            </span>
            <span class="sidebar-header__count">
              {urlFilter
                ? `${filteredRequests.length}/${requests.length}`
                : requests.length > 0
                  ? requests.length
                  : ""}
            </span>
          </div>
          <div class="sidebar-filter">
            <input
              ref={filterInputRef}
              class="sidebar-filter__input"
              type="text"
              placeholder="Filter by URL or method…"
              onInput={handleFilterInput}
            />
            {urlFilter && (
              <button class="sidebar-filter__clear" onClick={clearFilter} title="Clear filter">
                ✕
              </button>
            )}
          </div>
          <div class="sidebar-body">
            {filteredRequests.length === 0 ? (
              <EmptyState />
            ) : (
              <RequestList
                requests={filteredRequests}
                selectedId={selectedId}
                onSelect={setSelectedId}
                diffBaseId={diffBase?.id ?? null}
              />
            )}
          </div>
        </div>
        <div class="app__resize-handle" onMouseDown={onSidebarResize} />
        {showDiff ? (
          <DiffViewer
            base={diffBase}
            compare={selected}
            onClose={handleClearDiff}
          />
        ) : selected && !diffBase ? (
          <div class="app__detail">
            <SearchBar
              query={query}
              matchCount={matches.length}
              activeIndex={activeIndex}
              onSearch={setQuery}
              onNext={next}
              onPrev={prev}
              onClose={closeDetail}
            />
            <div
              class="app__detail-top"
              style={{ height: `${detailHeaderHeight}px` }}
            >
              <DetailHeader request={selected} />
            </div>
            <div
              class="app__resize-handle--horizontal"
              onMouseDown={onDetailResize}
            />
            {selected.error ? (
              <div class="app__parse-error">
                Parse error: {selected.error}
              </div>
            ) : (
              <JsonTree data={selected.parsed} matchPaths={matchPaths} activePath={activePath} />
            )}
          </div>
        ) : diffBase && !selected ? (
          <div class="app__no-selection">
            Select a request to compare with base
          </div>
        ) : (
          <div class="app__no-selection">
            {requests.length > 0 ? "Select a request to view JSON" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
