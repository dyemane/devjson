import { JsonNode } from "./json-node";

interface JsonTreeProps {
  data: unknown;
  matchPaths: Set<string>;
}

export function JsonTree({ data, matchPaths }: JsonTreeProps) {
  if (data === null || data === undefined) {
    return <div class="json-tree__empty">No JSON body</div>;
  }

  return (
    <div class="json-tree">
      <JsonNode
        keyName={null}
        value={data}
        depth={0}
        path=""
        matchPaths={matchPaths}
      />
    </div>
  );
}
