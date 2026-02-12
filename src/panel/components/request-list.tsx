import type { CapturedRequest } from "../types";
import { RequestItem } from "./request-item";

interface RequestListProps {
  requests: CapturedRequest[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  diffBaseId: string | null;
}

export function RequestList({ requests, selectedId, onSelect, diffBaseId }: RequestListProps) {
  return (
    <div class="request-list">
      {requests.map((req) => (
        <RequestItem
          key={req.id}
          request={req}
          isSelected={req.id === selectedId}
          isDiffBase={req.id === diffBaseId}
          onClick={() => onSelect(req.id)}
        />
      ))}
    </div>
  );
}
