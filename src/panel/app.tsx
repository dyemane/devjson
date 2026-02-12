import { useRequests } from "./hooks/use-requests";
import { useJsonSearch } from "./hooks/use-json-search";
import { useResize } from "./hooks/use-resize";
import { Toolbar } from "./components/toolbar";
import { RequestList } from "./components/request-list";
import { DetailHeader } from "./components/detail-header";
import { JsonTree } from "./components/json-tree";
import { SearchBar } from "./components/search-bar";
import { EmptyState } from "./components/empty-state";
import "./styles/panel.css";
import "./styles/toolbar.css";
import "./styles/request-list.css";
import "./styles/json-tree.css";
import "./styles/detail-header.css";

export function App() {
  const { requests, selected, selectedId, setSelectedId, clear } =
    useRequests();
  const { query, setQuery, matches, matchPaths } = useJsonSearch(
    selected?.parsed ?? null,
  );
  const { size: sidebarWidth, onMouseDown: onSidebarResize } = useResize(340);
  const { size: detailHeaderHeight, onMouseDown: onDetailResize } = useResize(
    120,
    60,
    500,
    "vertical",
  );

  const closeDetail = () => setSelectedId(null);

  return (
    <div class="app">
      <Toolbar count={requests.length} selected={selected} onClear={clear} />
      <div class="app__body">
        <div class="app__sidebar" style={{ width: `${sidebarWidth}px` }}>
          <div class="sidebar-header">
            <span class="sidebar-header__title">Requests</span>
            <span class="sidebar-header__count">
              {requests.length > 0 ? requests.length : ""}
            </span>
          </div>
          <div class="sidebar-body">
            {requests.length === 0 ? (
              <EmptyState />
            ) : (
              <RequestList
                requests={requests}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>
        </div>
        <div class="app__resize-handle" onMouseDown={onSidebarResize} />
        {selected && (
          <div class="app__detail">
            <SearchBar
              query={query}
              matchCount={matches.length}
              onSearch={setQuery}
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
              <JsonTree data={selected.parsed} matchPaths={matchPaths} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
