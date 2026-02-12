import type { CapturedRequest } from "../types";
import { JSON_MIME_TYPES } from "../../shared/constants";
import { isNdjsonMime, tryParseNdjson } from "./ndjson";
import { safeJsonParse } from "./safe-json";

let requestId = 0;

function isJsonMime(mimeType: string): boolean {
  const normalized = mimeType.toLowerCase().split(";")[0].trim();
  return JSON_MIME_TYPES.some((t) => normalized.includes(t));
}

export function startIntercepting(
  onRequest: (req: CapturedRequest) => void,
): void {
  chrome.devtools.network.onRequestFinished.addListener(
    (entry: chrome.devtools.network.Request) => {
      const mime = entry.response.content.mimeType || "";
      if (!isJsonMime(mime)) return;

      const id = `req-${++requestId}`;
      const base: Omit<CapturedRequest, "body" | "parsed" | "error"> = {
        id,
        url: entry.request.url,
        method: entry.request.method,
        status: entry.response.status,
        statusText: entry.response.statusText,
        mimeType: mime,
        size: entry.response.content.size,
        time: entry.time ?? 0,
        timestamp: Date.now(),
        requestHeaders: entry.request.headers.map((h) => ({
          name: h.name,
          value: h.value,
        })),
        responseHeaders: entry.response.headers.map((h) => ({
          name: h.name,
          value: h.value,
        })),
      };

      entry.getContent((body) => {
        let parsed: unknown = null;
        let error: string | null = null;

        if (body) {
          try {
            parsed = safeJsonParse(body);
          } catch {
            // If standard parse fails, try NDJSON
            if (isNdjsonMime(mime) || body.includes("\n")) {
              const ndjson = tryParseNdjson(body);
              parsed = ndjson.parsed;
              error = ndjson.error;
            } else {
              error = "Parse error";
            }
          }
        }

        onRequest({ ...base, body, parsed, error });
      });
    },
  );
}
