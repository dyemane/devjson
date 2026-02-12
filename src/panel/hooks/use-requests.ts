import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import type { CapturedRequest } from "../types";
import { startIntercepting } from "../lib/interceptor";
import { MAX_REQUESTS } from "../../shared/constants";

export function useRequests() {
  const [requests, setRequests] = useState<CapturedRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    startIntercepting((req) => {
      setRequests((prev) => {
        const next = [...prev, req];
        if (next.length > MAX_REQUESTS) {
          return next.slice(next.length - MAX_REQUESTS);
        }
        return next;
      });
    });
  }, []);

  const clear = useCallback(() => {
    setRequests([]);
    setSelectedId(null);
  }, []);

  const selected = requests.find((r) => r.id === selectedId) ?? null;

  return { requests, selected, selectedId, setSelectedId, clear };
}
