export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function truncateUrl(url: string, maxLength = 60): string {
  try {
    const u = new URL(url);
    const path = u.pathname + u.search;
    if (path.length <= maxLength) return path;
    return `${path.slice(0, maxLength - 1)}…`;
  } catch {
    if (url.length <= maxLength) return url;
    return `${url.slice(0, maxLength - 1)}…`;
  }
}

export function typeLabel(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return `Array(${value.length})`;
  if (typeof value === "object") return `Object(${Object.keys(value).length})`;
  return typeof value;
}

export function countNodes(value: unknown): number {
  if (value === null || typeof value !== "object") return 1;
  if (Array.isArray(value)) {
    return 1 + value.reduce((sum, v) => sum + countNodes(v), 0);
  }
  return (
    1 + Object.values(value).reduce((sum, v) => sum + countNodes(v), 0)
  );
}
