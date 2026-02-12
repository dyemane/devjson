import { useState } from "preact/hooks";
import { AUTO_EXPAND_DEPTH } from "../../shared/constants";

interface JsonNodeProps {
  keyName: string | null;
  value: unknown;
  depth: number;
  path: string;
  matchPaths: Set<string>;
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

export function JsonNode({ keyName, value, depth, path, matchPaths }: JsonNodeProps) {
  const isExpandable =
    value !== null && typeof value === "object";
  const [expanded, setExpanded] = useState(depth < AUTO_EXPAND_DEPTH);
  const isMatch = matchPaths.has(path);

  if (!isExpandable) {
    return (
      <div
        class={`json-node ${isMatch ? "json-node--match" : ""}`}
        style={{ paddingLeft: `${depth * 16}px` }}
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
    <div class={`json-node ${isMatch ? "json-node--match" : ""}`}>
      <div
        class="json-node__toggle"
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={() => setExpanded(!expanded)}
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
