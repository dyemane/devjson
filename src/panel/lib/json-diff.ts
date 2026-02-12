export type DiffType = "added" | "removed" | "changed" | "unchanged";

export interface DiffEntry {
  path: string;
  key: string;
  type: DiffType;
  depth: number;
  oldValue?: unknown;
  newValue?: unknown;
}

export function diffJson(
  left: unknown,
  right: unknown,
  path = "",
  depth = 0,
): DiffEntry[] {
  const entries: DiffEntry[] = [];

  // Both primitives or null
  if (
    (left === null || typeof left !== "object") &&
    (right === null || typeof right !== "object")
  ) {
    const key = pathKey(path);
    if (left === right) {
      entries.push({ path, key, type: "unchanged", depth, oldValue: left, newValue: right });
    } else {
      entries.push({ path, key, type: "changed", depth, oldValue: left, newValue: right });
    }
    return entries;
  }

  // Type mismatch (one is object, other is primitive)
  if (
    typeof left !== typeof right ||
    left === null ||
    right === null ||
    Array.isArray(left) !== Array.isArray(right)
  ) {
    const key = pathKey(path);
    entries.push({ path, key, type: "changed", depth, oldValue: left, newValue: right });
    return entries;
  }

  // Both arrays
  if (Array.isArray(left) && Array.isArray(right)) {
    const maxLen = Math.max(left.length, right.length);
    for (let i = 0; i < maxLen; i++) {
      const childPath = path ? `${path}[${i}]` : `[${i}]`;
      if (i >= left.length) {
        entries.push({ path: childPath, key: String(i), type: "added", depth: depth + 1, newValue: right[i] });
      } else if (i >= right.length) {
        entries.push({ path: childPath, key: String(i), type: "removed", depth: depth + 1, oldValue: left[i] });
      } else {
        entries.push(...diffJson(left[i], right[i], childPath, depth + 1));
      }
    }
    return entries;
  }

  // Both objects
  const leftObj = left as Record<string, unknown>;
  const rightObj = right as Record<string, unknown>;
  const allKeys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);

  for (const k of allKeys) {
    const childPath = path ? `${path}.${k}` : k;
    const inLeft = k in leftObj;
    const inRight = k in rightObj;

    if (inLeft && !inRight) {
      entries.push({ path: childPath, key: k, type: "removed", depth: depth + 1, oldValue: leftObj[k] });
    } else if (!inLeft && inRight) {
      entries.push({ path: childPath, key: k, type: "added", depth: depth + 1, newValue: rightObj[k] });
    } else {
      entries.push(...diffJson(leftObj[k], rightObj[k], childPath, depth + 1));
    }
  }

  return entries;
}

function pathKey(path: string): string {
  if (!path) return "$";
  const parts = path.split(".");
  const last = parts[parts.length - 1];
  // Handle array indices
  const bracketMatch = last.match(/\[(\d+)\]$/);
  if (bracketMatch) return bracketMatch[1];
  return last;
}

export function summarizeDiff(entries: DiffEntry[]): { added: number; removed: number; changed: number } {
  let added = 0;
  let removed = 0;
  let changed = 0;
  for (const e of entries) {
    if (e.type === "added") added++;
    else if (e.type === "removed") removed++;
    else if (e.type === "changed") changed++;
  }
  return { added, removed, changed };
}
