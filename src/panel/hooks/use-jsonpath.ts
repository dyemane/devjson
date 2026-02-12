import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { JSONPath } from "jsonpath-plus";

export interface JpMatch {
  path: string; // internal dot/bracket notation (e.g. "store.book[0].author")
}

/**
 * Convert a JSON Pointer (from jsonpath-plus resultType:"pointer")
 * to our internal dot/bracket path notation used by JsonNode.
 *
 * Examples:
 *   "/store/book/0/author"  → "store.book[0].author"
 *   "/0/name"               → "[0].name"
 *   "/a~1b"                 → "a/b"       (JSON Pointer ~1 = /)
 *   "/m~0n"                 → "m~n"       (JSON Pointer ~0 = ~)
 *   ""                      → ""          (root)
 */
export function jsonPointerToInternalPath(pointer: string): string {
  if (!pointer || pointer === "/") return "";

  const segments = pointer
    .slice(1) // remove leading "/"
    .split("/")
    .map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));

  let result = "";
  for (const seg of segments) {
    if (/^\d+$/.test(seg)) {
      result += `[${seg}]`;
    } else {
      result += result ? `.${seg}` : seg;
    }
  }
  return result;
}

export function useJsonPath(parsed: unknown | null) {
  const [jpQuery, setJpQuery] = useState("");
  const [jpActiveIndex, setJpActiveIndex] = useState(0);

  const { jpMatches, jpError } = useMemo(() => {
    if (!jpQuery.trim() || !parsed) return { jpMatches: [] as JpMatch[], jpError: null as string | null };
    try {
      const results = JSONPath({
        path: jpQuery.trim(),
        json: parsed,
        resultType: "pointer",
      }) as string[];
      return {
        jpMatches: results.map((ptr) => ({ path: jsonPointerToInternalPath(ptr) })),
        jpError: null,
      };
    } catch {
      return { jpMatches: [] as JpMatch[], jpError: "Invalid JSONPath" };
    }
  }, [parsed, jpQuery]);

  // Reset active index when matches change
  useEffect(() => {
    setJpActiveIndex(0);
  }, [jpMatches]);

  const jpMatchPaths = useMemo(
    () => new Set(jpMatches.map((m) => m.path)),
    [jpMatches],
  );

  const jpActivePath = jpMatches.length > 0 ? jpMatches[jpActiveIndex]?.path ?? null : null;

  const jpNext = useCallback(() => {
    if (jpMatches.length === 0) return;
    setJpActiveIndex((i) => (i + 1) % jpMatches.length);
  }, [jpMatches.length]);

  const jpPrev = useCallback(() => {
    if (jpMatches.length === 0) return;
    setJpActiveIndex((i) => (i - 1 + jpMatches.length) % jpMatches.length);
  }, [jpMatches.length]);

  return {
    jpQuery,
    setJpQuery,
    jpMatches,
    jpMatchPaths,
    jpActiveIndex,
    jpActivePath,
    jpError,
    jpNext,
    jpPrev,
  };
}
