import { useEffect, useRef, useState } from "preact/hooks";
import { AUTO_EXPAND_DEPTH } from "../../shared/constants";
import { copyToClipboard } from "../lib/clipboard";

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
  if (typeof value === "string") return "json-node__value--string";
  if (typeof value === "number") return "json-node__value--number";
  if (typeof value === "boolean") return "json-node__value--boolean";
  return "";
}

function renderValue(value: unknown): string {
  if (value === null) return "null";
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
  const nodeRef = useRef<HTMLDivElement>(null);
  const prevGeneration = useRef(expandGeneration);

  // Respond to expand/collapse all
  useEffect(() => {
    if (expandGeneration !== prevGeneration.current) {
      // Positive = expand all, negative = collapse all
      setExpanded(expandGeneration > 0);
      prevGeneration.current = expandGeneration;
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
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);
  const bracket = isArray ? ["[", "]"] : ["{", "}"];
  const summary = isArray ? `Array(${entries.length})` : `Object(${entries.length})`;

  return (
    <div class={`json-node ${matchClass}`}>
      <div
        ref={isActive ? nodeRef : undefined}
        class="json-node__toggle"
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={() => setExpanded(!expanded)}
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
          {entries.map(([k, v]) => {
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
          <div style={{ paddingLeft: `${depth * 16}px` }}>
            <span class="json-node__bracket">{bracket[1]}</span>
          </div>
        </>
      )}
    </div>
  );
}
