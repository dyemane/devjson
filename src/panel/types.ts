export interface CapturedRequest {
  id: string;
  url: string;
  method: string;
  status: number;
  mimeType: string;
  size: number;
  time: number;
  timestamp: number;
  body: string | null;
  parsed: unknown | null;
  error: string | null;
}

export interface SearchMatch {
  path: string;
  key: string;
  value: string;
}
