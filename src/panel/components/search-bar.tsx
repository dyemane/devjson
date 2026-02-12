import { useCallback, useRef } from "preact/hooks";
import { SEARCH_DEBOUNCE_MS } from "../../shared/constants";

interface SearchBarProps {
  query: string;
  matchCount: number;
  activeIndex: number;
  onSearch: (query: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export function SearchBar({
  query,
  matchCount,
  activeIndex,
  onSearch,
  onNext,
  onPrev,
  onClose,
}: SearchBarProps) {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = useCallback(
    (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => onSearch(value), SEARCH_DEBOUNCE_MS);
    },
    [onSearch],
  );

  const handleClear = useCallback(() => {
    if (inputRef.current) inputRef.current.value = "";
    clearTimeout(timer.current);
    onSearch("");
  }, [onSearch]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          onPrev();
        } else {
          onNext();
        }
      }
      if (e.key === "Escape") {
        if (query) {
          handleClear();
        } else {
          onClose();
        }
      }
    },
    [onNext, onPrev, onClose, query, handleClear],
  );

  return (
    <div class="search-bar">
      <input
        ref={inputRef}
        class="search-bar__input"
        type="text"
        placeholder="Search keys and values…"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      />
      {query && (
        <button class="search-bar__clear" onClick={handleClear} title="Clear search">
          ✕
        </button>
      )}
      {query && matchCount > 0 && (
        <>
          <span class="search-bar__count">
            {activeIndex + 1} of {matchCount}
          </span>
          <button
            class="search-bar__nav"
            onClick={onPrev}
            title="Previous match (Shift+Enter)"
          >
            ▲
          </button>
          <button
            class="search-bar__nav"
            onClick={onNext}
            title="Next match (Enter)"
          >
            ▼
          </button>
        </>
      )}
      {query && matchCount === 0 && (
        <span class="search-bar__count search-bar__count--none">
          No matches
        </span>
      )}
      <button class="search-bar__close" onClick={onClose} title="Close panel (Esc)">
        ✕
      </button>
    </div>
  );
}
