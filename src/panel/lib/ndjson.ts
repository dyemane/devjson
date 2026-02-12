import { safeJsonParse } from "./safe-json";

/**
 * Detect and parse NDJSON (newline-delimited JSON / JSON Lines).
 *
 * A string is treated as NDJSON when:
 *  - Standard JSON.parse fails, AND
 *  - Splitting on newlines yields 2+ lines that each parse as valid JSON
 *
 * Returns { parsed, error } just like the normal JSON path.
 */
export function tryParseNdjson(body: string): { parsed: unknown; error: string | null } {
  const lines = body.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { parsed: null, error: "Not valid JSON or NDJSON" };
  }

  const results: unknown[] = [];
  for (let i = 0; i < lines.length; i++) {
    try {
      results.push(safeJsonParse(lines[i]));
    } catch {
      return { parsed: null, error: `NDJSON parse error on line ${i + 1}` };
    }
  }

  return { parsed: results, error: null };
}

/** Check if a MIME type is explicitly NDJSON */
export function isNdjsonMime(mimeType: string): boolean {
  const normalized = mimeType.toLowerCase().split(";")[0].trim();
  return (
    normalized === "application/x-ndjson" ||
    normalized === "application/jsonl" ||
    normalized === "application/x-jsonlines"
  );
}
