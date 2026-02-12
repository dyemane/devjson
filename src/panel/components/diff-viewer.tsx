import { useMemo } from "preact/hooks";
import type { CapturedRequest } from "../types";
import { diffJson, summarizeDiff, type DiffEntry } from "../lib/json-diff";
import { truncateUrl } from "../lib/json-utils";

interface DiffViewerProps {
  base: CapturedRequest;
  compare: CapturedRequest;
  onClose: () => void;
}

function renderValue(value: unknown): string {
  if (value === undefined) return "";
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "object") {
    const s = JSON.stringify(value);
    return s.length > 80 ? `${s.slice(0, 77)}...` : s;
  }
  return String(value);
}

function DiffRow({ entry }: { entry: DiffEntry }) {
  const indent = entry.depth * 16;

  if (entry.type === "unchanged") {
    return (
      <div class="diff-row diff-row--unchanged" style={{ paddingLeft: `${indent}px` }}>
        <span class="diff-row__key">{entry.key}:</span>{" "}
        <span class="diff-row__value">{renderValue(entry.newValue)}</span>
      </div>
    );
  }

  if (entry.type === "added") {
    return (
      <div class="diff-row diff-row--added" style={{ paddingLeft: `${indent}px` }}>
        <span class="diff-row__marker">+</span>
        <span class="diff-row__key">{entry.key}:</span>{" "}
        <span class="diff-row__value">{renderValue(entry.newValue)}</span>
      </div>
    );
  }

  if (entry.type === "removed") {
    return (
      <div class="diff-row diff-row--removed" style={{ paddingLeft: `${indent}px` }}>
        <span class="diff-row__marker">-</span>
        <span class="diff-row__key">{entry.key}:</span>{" "}
        <span class="diff-row__value">{renderValue(entry.oldValue)}</span>
      </div>
    );
  }

  // changed
  return (
    <div style={{ paddingLeft: `${indent}px` }}>
      <div class="diff-row diff-row--removed">
        <span class="diff-row__marker">-</span>
        <span class="diff-row__key">{entry.key}:</span>{" "}
        <span class="diff-row__value">{renderValue(entry.oldValue)}</span>
      </div>
      <div class="diff-row diff-row--added">
        <span class="diff-row__marker">+</span>
        <span class="diff-row__key">{entry.key}:</span>{" "}
        <span class="diff-row__value">{renderValue(entry.newValue)}</span>
      </div>
    </div>
  );
}

export function DiffViewer({ base, compare, onClose }: DiffViewerProps) {
  const entries = useMemo(() => {
    if (!base.parsed || !compare.parsed) return [];
    return diffJson(base.parsed, compare.parsed);
  }, [base.parsed, compare.parsed]);

  const summary = useMemo(() => summarizeDiff(entries), [entries]);
  const hasChanges = summary.added + summary.removed + summary.changed > 0;

  return (
    <div class="diff-viewer">
      <div class="diff-viewer__header">
        <div class="diff-viewer__title">JSON Diff</div>
        <div class="diff-viewer__summary">
          {hasChanges ? (
            <>
              {summary.added > 0 && (
                <span class="diff-viewer__stat diff-viewer__stat--added">
                  +{summary.added}
                </span>
              )}
              {summary.removed > 0 && (
                <span class="diff-viewer__stat diff-viewer__stat--removed">
                  -{summary.removed}
                </span>
              )}
              {summary.changed > 0 && (
                <span class="diff-viewer__stat diff-viewer__stat--changed">
                  ~{summary.changed}
                </span>
              )}
            </>
          ) : (
            <span class="diff-viewer__stat">No changes</span>
          )}
        </div>
        <button class="diff-viewer__close" onClick={onClose}>
          ✕
        </button>
      </div>
      <div class="diff-viewer__labels">
        <div class="diff-viewer__label diff-viewer__label--base">
          Base: {base.method} {truncateUrl(base.url, 40)}
        </div>
        <div class="diff-viewer__label diff-viewer__label--compare">
          Compare: {compare.method} {truncateUrl(compare.url, 40)}
        </div>
      </div>
      <div class="diff-viewer__body">
        {!base.parsed || !compare.parsed ? (
          <div class="diff-viewer__error">
            Both requests must have valid JSON to diff
          </div>
        ) : (
          entries.map((entry) => (
            <DiffRow key={entry.path + entry.type} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}
