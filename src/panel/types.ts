export interface HeaderEntry {
  name: string;
  value: string;
}

export interface RequestTimings {
  blocked: number;
  dns: number;
  connect: number;
  ssl: number;
  send: number;
  wait: number;
  receive: number;
}

export interface CapturedRequest {
  id: string;
  url: string;
  method: string;
  status: number;
  statusText: string;
  mimeType: string;
  size: number;
  time: number;
  timestamp: number;
  timings: RequestTimings | null;
  requestHeaders: HeaderEntry[];
  responseHeaders: HeaderEntry[];
  body: string | null;
  parsed: unknown | null;
  error: string | null;
}

export interface SearchMatch {
  path: string;
  key: string;
  value: string;
}
