import type { CapturedRequest } from "../types";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export requests as a JSON array of simplified objects.
 */
export function exportAsJson(requests: CapturedRequest[]) {
  const data = requests.map((r) => ({
    url: r.url,
    method: r.method,
    status: r.status,
    statusText: r.statusText,
    mimeType: r.mimeType,
    size: r.size,
    time: r.time,
    timestamp: r.timestamp,
    requestHeaders: r.requestHeaders,
    responseHeaders: r.responseHeaders,
    body: r.parsed,
  }));
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const ts = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  downloadBlob(blob, `devjson-export-${ts}.json`);
}

/**
 * Export requests in HAR 1.2 format.
 * https://w3c.github.io/web-performance/specs/HAR/Overview.html
 */
export function exportAsHar(requests: CapturedRequest[]) {
  const entries = requests.map((r) => ({
    startedDateTime: new Date(r.timestamp).toISOString(),
    time: r.time,
    request: {
      method: r.method,
      url: r.url,
      httpVersion: "HTTP/1.1",
      headers: r.requestHeaders.map((h) => ({ name: h.name, value: h.value })),
      queryString: parseQueryString(r.url),
      cookies: [],
      headersSize: -1,
      bodySize: -1,
    },
    response: {
      status: r.status,
      statusText: r.statusText,
      httpVersion: "HTTP/1.1",
      headers: r.responseHeaders.map((h) => ({ name: h.name, value: h.value })),
      cookies: [],
      content: {
        size: r.size,
        mimeType: r.mimeType,
        text: r.body ?? "",
      },
      redirectURL: "",
      headersSize: -1,
      bodySize: r.size,
    },
    cache: {},
    timings: {
      send: 0,
      wait: r.time,
      receive: 0,
    },
  }));

  const har = {
    log: {
      version: "1.2",
      creator: { name: "DevJSON", version: "1.0.0" },
      entries,
    },
  };

  const json = JSON.stringify(har, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const ts = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  downloadBlob(blob, `devjson-export-${ts}.har`);
}

function parseQueryString(url: string): Array<{ name: string; value: string }> {
  try {
    const u = new URL(url);
    return Array.from(u.searchParams.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  } catch {
    return [];
  }
}
