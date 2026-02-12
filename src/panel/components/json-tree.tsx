import { useCallback, useMemo, useState } from "preact/hooks";
import { JsonNode } from "./json-node";
import { copyToClipboard } from "../lib/clipboard";
import { countNodes } from "../lib/json-utils";

interface JsonTreeProps {
  data: unknown;
  matchPaths: Set<string>;
  activePath: string | null;
}

function toJsonPath(path: string): string {
  if (!path) return "$";
  // Convert dot.key and [index] notation to $.key[index] format
  return "$." + path;
}

export function JsonTree({ data, matchPaths, activePath }: JsonTreeProps) {
  // Positive number = expand all, negative = collapse all, 0 = default
  const [expandGeneration, setExpandGeneration] = useState(0);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [pathCopied, setPathCopied] = useState(false);

  const expandAll = useCallback(() => {
    setExpandGeneration((g) => Math.abs(g) + 1);
  }, []);

  const collapseAll = useCallback(() => {
    setExpandGeneration((g) => -(Math.abs(g) + 1));
  }, []);

  const handleHoverPath = useCallback((path: string | null) => {
    setHoveredPath(path);
    setPathCopied(false);
  }, []);

  const handleCopyPath = () => {
    if (!hoveredPath) return;
    const ok = copyToClipboard(toJsonPath(hoveredPath));
    if (ok) {
      setPathCopied(true);
      setTimeout(() => setPathCopied(false), 1500);
    }
  };

  const nodeCount = useMemo(() => (data != null ? countNodes(data) : 0), [data]);

  if (data === null || data === undefined) {
    return <div class="json-tree__empty">No JSON body</div>;
  }

  return (
    <div class="json-tree" onMouseLeave={() => setHoveredPath(null)}>
      <div class="json-tree__controls">
        <button class="json-tree__btn" onClick={expandAll}>
          Expand All
        </button>
        <button class="json-tree__btn" onClick={collapseAll}>
          Collapse All
        </button>
        {nodeCount > 100 && (
          <span class="json-tree__node-count">{nodeCount.toLocaleString()} nodes</span>
        )}
      </div>
      <div class="json-tree__body">
        <JsonNode
          keyName={null}
          value={data}
          depth={0}
          path=""
          matchPaths={matchPaths}
          activePath={activePath}
          expandGeneration={expandGeneration}
          onHoverPath={handleHoverPath}
        />
      </div>
      {hoveredPath && (
        <div class="json-tree__path-bar" onClick={handleCopyPath} title="Click to copy path">
          <span class="json-tree__path-text">{toJsonPath(hoveredPath)}</span>
          <span class="json-tree__path-copy">
            {pathCopied ? "Copied!" : "Click to copy"}
          </span>
        </div>
      )}
    </div>
  );
}
