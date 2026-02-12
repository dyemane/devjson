import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import type { CapturedRequest } from "../types";
import { startIntercepting } from "../lib/interceptor";
import { MAX_REQUESTS } from "../../shared/constants";

let importId = 0;

export function useRequests() {
  const [requests, setRequests] = useState<CapturedRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const initialized = useRef(false);

  const addRequest = useCallback((req: CapturedRequest) => {
    setRequests((prev) => {
      const next = [...prev, req];
      if (next.length > MAX_REQUESTS) {
        return next.slice(next.length - MAX_REQUESTS);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    startIntercepting(addRequest);
  }, [addRequest]);

  const clear = useCallback(() => {
    setRequests([]);
    setSelectedId(null);
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

  return { requests, selected, selectedId, setSelectedId, clear, addImported };
}
