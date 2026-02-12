import { useMemo, useState } from "preact/hooks";
import type { SearchMatch } from "../types";

export function searchJson(
  value: unknown,
  query: string,
  path = "",
): SearchMatch[] {
  const matches: SearchMatch[] = [];
  const lowerQuery = query.toLowerCase();

  if (value === null || value === undefined) return matches;

  if (typeof value === "object" && !Array.isArray(value)) {
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (key.toLowerCase().includes(lowerQuery)) {
        matches.push({ path: currentPath, key, value: String(val) });
      }

      if (typeof val === "string" && val.toLowerCase().includes(lowerQuery)) {
        matches.push({ path: currentPath, key, value: val });
      } else if (
        typeof val === "number" || typeof val === "boolean"
      ) {
        if (String(val).toLowerCase().includes(lowerQuery)) {
          matches.push({ path: currentPath, key, value: String(val) });
        }
      }

      if (typeof val === "object" && val !== null) {
        matches.push(...searchJson(val, query, currentPath));
      }
    }
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const currentPath = `${path}[${i}]`;
      const item = value[i];

      if (typeof item === "string" && item.toLowerCase().includes(lowerQuery)) {
        matches.push({ path: currentPath, key: String(i), value: item });
      } else if (typeof item === "object" && item !== null) {
        matches.push(...searchJson(item, query, currentPath));
      }
    }
  }

  return matches;
}

export function useJsonSearch(parsed: unknown | null) {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    if (!query.trim() || !parsed) return [];
    return searchJson(parsed, query.trim());
  }, [parsed, query]);

  const matchPaths = useMemo(
    () => new Set(matches.map((m) => m.path)),
    [matches],
  );

  return { query, setQuery, matches, matchPaths };
}
