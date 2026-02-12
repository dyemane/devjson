import { useEffect, useRef, useState } from "preact/hooks";
import { AUTO_EXPAND_DEPTH, CHUNK_SIZE } from "../../shared/constants";
import { copyToClipboard } from "../lib/clipboard";
import { isBigIntValue, unwrapBigInt } from "../lib/safe-json";

interface JsonNodeProps {
  keyName: string | null;
  value: unknown;
  depth: number;
  path: string;
  matchPaths: Set<string>;
  activePath: string | null;
  expandGeneration: number;
  onHoverPath: (path: string | null) => void;
}

function valueClass(value: unknown): string {
  if (value === null) return "json-node__value--null";
  if (isBigIntValue(value)) return "json-node__value--number";
  if (typeof value === "string") return "json-node__value--string";
  if (typeof value === "number") return "json-node__value--number";
  if (typeof value === "boolean") return "json-node__value--boolean";
  return "";
}

function renderValue(value: unknown): string {
  if (value === null) return "null";
  if (isBigIntValue(value)) return unwrapBigInt(value);
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

function isAncestorOfActive(path: string, activePath: string | null): boolean {
  if (!activePath || !path) return false;
  return activePath.startsWith(path + ".") || activePath.startsWith(path + "[");
}

export function JsonNode({
  keyName,
  value,
  depth,
  path,
  matchPaths,
  activePath,
  expandGeneration,
  onHoverPath,
}: JsonNodeProps) {
  const isExpandable = value !== null && typeof value === "object";
  const isMatch = matchPaths.has(path);
  const isActive = activePath === path;
  const shouldAutoExpand = isAncestorOfActive(path, activePath);
  const [expanded, setExpanded] = useState(depth < AUTO_EXPAND_DEPTH);
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const nodeRef = useRef<HTMLDivElement>(null);
  const prevGeneration = useRef(expandGeneration);

  // Respond to expand/collapse all
  useEffect(() => {
    if (expandGeneration !== prevGeneration.current) {
      setExpanded(expandGeneration > 0);
      prevGeneration.current = expandGeneration;
      // Reset visible count when collapsing all
      if (expandGeneration < 0) {
        setVisibleCount(CHUNK_SIZE);
      }
    }
  }, [expandGeneration]);

  // Auto-expand when a descendant is the active match
  useEffect(() => {
    if (shouldAutoExpand && !expanded) {
      setExpanded(true);
    }
  }, [shouldAutoExpand]);

  // Scroll active match into view
  useEffect(() => {
    if (isActive && nodeRef.current) {
      nodeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [isActive]);

  // If active match is beyond visible chunk, expand the visible range
  useEffect(() => {
    if (!activePath || !expanded || !isExpandable) return;
    const entries = Array.isArray(value)
      ? (value as unknown[])
      : Object.entries(value as Record<string, unknown>);
    const total = Array.isArray(value) ? entries.length : (entries as [string, unknown][]).length;
    if (visibleCount >= total) return;

    // Check if active path is in a child beyond visible range
    for (let i = visibleCount; i < total; i++) {
      const k = Array.isArray(value) ? String(i) : (entries as [string, unknown][])[i][0];
      const childPath = Array.isArray(value)
        ? `${path}[${k}]`
        : path ? `${path}.${k}` : k;
      if (activePath === childPath || activePath.startsWith(childPath + ".") || activePath.startsWith(childPath + "[")) {
        setVisibleCount(Math.min(i + CHUNK_SIZE, total));
        break;
      }
    }
  }, [activePath, expanded, visibleCount]);

  const matchClass = isActive
    ? "json-node--active"
    : isMatch
      ? "json-node--match"
      : "";

  const handleMouseEnter = () => {
    if (path) onHoverPath(path);
  };

  if (!isExpandable) {
    return (
      <div
        ref={isActive ? nodeRef : undefined}
        class={`json-node ${matchClass}`}
        style={{ paddingLeft: `${depth * 16}px` }}
        onMouseEnter={handleMouseEnter}
      >
        {keyName !== null && (
          <span class="json-node__key">{keyName}: </span>
        )}
        <span class={valueClass(value)}>{renderValue(value)}</span>
        {isBigIntValue(value) && (
          <span class="json-node__bigint-badge" title="Large integer — original precision preserved">n</span>
        )}
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);
  const bracket = isArray ? ["[", "]"] : ["{", "}"];
  const summary = isArray ? `Array(${entries.length})` : `Object(${entries.length})`;

  const totalEntries = entries.length;
  const visibleEntries = entries.slice(0, visibleCount);
  const hasMore = visibleCount < totalEntries;
  const remaining = totalEntries - visibleCount;

  const handleShowMore = () => {
    setVisibleCount((c) => Math.min(c + CHUNK_SIZE, totalEntries));
  };

  const handleShowAll = () => {
    setVisibleCount(totalEntries);
  };

  return (
    <div class={`json-node ${matchClass}`}>
      <div
        ref={isActive ? nodeRef : undefined}
        class="json-node__toggle"
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={() => {
          const next = !expanded;
          setExpanded(next);
          if (!next) setVisibleCount(CHUNK_SIZE);
        }}
        onMouseEnter={handleMouseEnter}
      >
        <span class="json-node__arrow">{expanded ? "▼" : "▶"}</span>
        {keyName !== null && (
          <span class="json-node__key">{keyName}: </span>
        )}
        {!expanded && (
          <span class="json-node__summary">
            {bracket[0]} {summary} {bracket[1]}
          </span>
        )}
        {expanded && <span class="json-node__bracket">{bracket[0]}</span>}
      </div>
      {expanded && (
        <>
          {visibleEntries.map(([k, v]) => {
            const childPath = isArray ? `${path}[${k}]` : path ? `${path}.${k}` : k;
            return (
              <JsonNode
                key={k}
                keyName={k}
                value={v}
                depth={depth + 1}
                path={childPath}
                matchPaths={matchPaths}
                activePath={activePath}
                expandGeneration={expandGeneration}
                onHoverPath={onHoverPath}
              />
            );
          })}
          {hasMore && (
            <div
              class="json-node__show-more"
              style={{ paddingLeft: `${(depth + 1) * 16}px` }}
            >
              <button class="json-node__show-more-btn" onClick={handleShowMore}>
                Show {Math.min(CHUNK_SIZE, remaining)} more
              </button>
              {remaining > CHUNK_SIZE && (
                <button class="json-node__show-more-btn" onClick={handleShowAll}>
                  Show all ({remaining})
                </button>
              )}
            </div>
          )}
          <div style={{ paddingLeft: `${depth * 16}px` }}>
            <span class="json-node__bracket">{bracket[1]}</span>
          </div>
        </>
      )}
    </div>
  );
}
