import { useRequests } from "./hooks/use-requests";
import { useJsonSearch } from "./hooks/use-json-search";
import { Toolbar } from "./components/toolbar";
import { RequestList } from "./components/request-list";
import { JsonTree } from "./components/json-tree";
import { SearchBar } from "./components/search-bar";
import { EmptyState } from "./components/empty-state";
import "./styles/panel.css";
import "./styles/toolbar.css";
import "./styles/request-list.css";
import "./styles/json-tree.css";

export function App() {
  const { requests, selected, selectedId, setSelectedId, clear } =
    useRequests();
  const { query, setQuery, matches, matchPaths } = useJsonSearch(
    selected?.parsed ?? null,
  );

  return (
    <div class="app">
      <Toolbar count={requests.length} selected={selected} onClear={clear} />
      <div class="app__body">
        <div class="app__sidebar">
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
        <div class="app__detail">
          {selected ? (
            <>
              <SearchBar
                query={query}
                matchCount={matches.length}
                onSearch={setQuery}
              />
              {selected.error ? (
                <div class="app__parse-error">
                  Parse error: {selected.error}
                </div>
              ) : (
                <JsonTree data={selected.parsed} matchPaths={matchPaths} />
              )}
            </>
          ) : (
            <div class="app__no-selection">
              {requests.length > 0
                ? "Select a request to view JSON"
                : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
