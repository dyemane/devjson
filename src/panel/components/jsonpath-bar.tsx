import { useCallback, useEffect, useRef } from "preact/hooks";
import { SEARCH_DEBOUNCE_MS } from "../../shared/constants";

interface JsonPathBarProps {
  query: string;
  matchCount: number;
  activeIndex: number;
  error: string | null;
  onQuery: (query: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  inputRef?: { current: HTMLInputElement | null };
}

const JP_DEBOUNCE_MS = 300;

export function JsonPathBar({
  query,
  matchCount,
  activeIndex,
  error,
  onQuery,
  onNext,
  onPrev,
  onClose,
  inputRef: externalRef,
}: JsonPathBarProps) {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const internalRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (externalRef) {
      externalRef.current = internalRef.current;
    }
  });

  const inputRef = internalRef;

  const handleInput = useCallback(
    (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => onQuery(value), JP_DEBOUNCE_MS);
    },
    [onQuery],
  );

  const handleClear = useCallback(() => {
    if (inputRef.current) inputRef.current.value = "";
    clearTimeout(timer.current);
    onQuery("");
  }, [onQuery]);

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
    <div class={`jp-bar ${error ? "jp-bar--error" : ""}`}>
      <span class="jp-bar__label">$.</span>
      <input
        ref={inputRef}
        class="jp-bar__input"
        type="text"
        placeholder="data[*].name"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      />
      {query && (
        <button class="jp-bar__clear" onClick={handleClear} title="Clear query">
          ✕
        </button>
      )}
      {error && query && (
        <span class="jp-bar__badge jp-bar__badge--error">Invalid</span>
      )}
      {query && !error && matchCount > 0 && (
        <>
          <span class="jp-bar__count">
            {activeIndex + 1} of {matchCount}
          </span>
          <button
            class="jp-bar__nav"
            onClick={onPrev}
            title="Previous match (Shift+Enter)"
          >
            ▲
          </button>
          <button
            class="jp-bar__nav"
            onClick={onNext}
            title="Next match (Enter)"
          >
            ▼
          </button>
        </>
      )}
      {query && !error && matchCount === 0 && (
        <span class="jp-bar__count jp-bar__count--none">No matches</span>
      )}
      <button class="jp-bar__close" onClick={onClose} title="Close JSONPath bar (Esc)">
        ✕
      </button>
    </div>
  );
}
