import { tryParseNdjson } from "./ndjson";

export interface ImportResult {
  parsed: unknown;
  label: string;
  error?: string;
}

/**
 * Parse imported text as JSON or NDJSON.
 * Returns the parsed value and a label describing what was imported.
 */
export function parseImportedText(text: string): ImportResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { parsed: null, label: "", error: "Empty input" };
  }

  // Try standard JSON first
  try {
    const parsed = JSON.parse(trimmed);
    const label = Array.isArray(parsed)
      ? `pasted Array(${parsed.length})`
      : typeof parsed === "object" && parsed !== null
        ? `pasted Object(${Object.keys(parsed).length})`
        : `pasted ${typeof parsed}`;
    return { parsed, label };
  } catch {
    // Fall through to NDJSON
  }

  // Try NDJSON
  const ndjson = tryParseNdjson(trimmed);
  if (ndjson.parsed != null) {
    const arr = ndjson.parsed as unknown[];
    return { parsed: arr, label: `pasted NDJSON (${arr.length} lines)` };
  }

  return { parsed: null, label: "", error: ndjson.error ?? "Invalid JSON" };
}

/**
 * Read a File object as text, then parse as JSON/NDJSON.
 */
export function readFileAsImport(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const result = parseImportedText(text);
      // Use filename as label
      if (!result.error) {
        result.label = file.name;
      }
      resolve(result);
    };
    reader.onerror = () => {
      resolve({ parsed: null, label: "", error: "Failed to read file" });
    };
    reader.readAsText(file);
  });
}
