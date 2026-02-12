import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import type { CapturedRequest } from "../types";
import { startIntercepting } from "../lib/interceptor";
import { MAX_REQUESTS } from "../../shared/constants";

let importId = 0;

export function useRequests() {
  const [requests, setRequests] = useState<CapturedRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const initialized = useRef(false);
  const pinnedRef = useRef(pinnedIds);
  pinnedRef.current = pinnedIds;

  const addRequest = useCallback((req: CapturedRequest) => {
    setRequests((prev) => {
      const next = [...prev, req];
      if (next.length > MAX_REQUESTS) {
        const pinned = pinnedRef.current;
        const pinnedItems = next.filter((r) => pinned.has(r.id));
        const unpinned = next.filter((r) => !pinned.has(r.id));
        const trimmed = unpinned.slice(unpinned.length - (MAX_REQUESTS - pinnedItems.length));
        return [...pinnedItems, ...trimmed];
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    startIntercepting(addRequest);
  }, [addRequest]);

  const togglePin = useCallback((id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearPins = useCallback(() => {
    setPinnedIds(new Set());
  }, []);

  const clear = useCallback(() => {
    setRequests((prev) => prev.filter((r) => pinnedRef.current.has(r.id)));
    setSelectedId((prev) => (prev && pinnedRef.current.has(prev) ? prev : null));
  }, []);

  const addImported = useCallback(
    (parsed: unknown, label?: string) => {
      const id = `import-${++importId}`;
      const body = JSON.stringify(parsed, null, 2);
      const req: CapturedRequest = {
        id,
        url: label || "imported",
        method: "IMPORT",
        status: 0,
        statusText: "",
        mimeType: "application/json",
        size: body.length,
        time: 0,
        timestamp: Date.now(),
        requestHeaders: [],
        responseHeaders: [],
        body,
        parsed,
        error: null,
      };
      addRequest(req);
      setSelectedId(id);
    },
    [addRequest],
  );

  const selected = requests.find((r) => r.id === selectedId) ?? null;

  return { requests, selected, selectedId, setSelectedId, clear, addImported, pinnedIds, togglePin, clearPins };
}
