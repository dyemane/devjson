import { useCallback, useRef } from "preact/hooks";
import { SEARCH_DEBOUNCE_MS } from "../../shared/constants";

interface SearchBarProps {
  query: string;
  matchCount: number;
  onSearch: (query: string) => void;
  onClose: () => void;
}

export function SearchBar({ query, matchCount, onSearch, onClose }: SearchBarProps) {
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const handleInput = useCallback(
    (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => onSearch(value), SEARCH_DEBOUNCE_MS);
    },
    [onSearch],
  );

  return (
    <div class="search-bar">
      <input
        class="search-bar__input"
        type="text"
        placeholder="Search keys and values…"
        onInput={handleInput}
      />
      {query && (
        <span class="search-bar__count">
          {matchCount} match{matchCount !== 1 ? "es" : ""}
        </span>
      )}
      <button class="search-bar__close" onClick={onClose} title="Close panel">
        ✕
      </button>
    </div>
  );
}
