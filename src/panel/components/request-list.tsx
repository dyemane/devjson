import { Fragment } from "preact";
import type { CapturedRequest } from "../types";
import { RequestItem } from "./request-item";

interface RequestListProps {
  requests: CapturedRequest[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  diffBaseId: string | null;
  pinnedIds: Set<string>;
  onTogglePin: (id: string) => void;
}

export function RequestList({ requests, selectedId, onSelect, diffBaseId, pinnedIds, onTogglePin }: RequestListProps) {
  // Find the boundary between pinned and unpinned for the divider
  let dividerIndex = -1;
  for (let i = 0; i < requests.length; i++) {
    if (!pinnedIds.has(requests[i].id) && i > 0 && pinnedIds.has(requests[i - 1].id)) {
      dividerIndex = i;
      break;
    }
  }

  return (
    <div class="request-list">
      {requests.map((req, i) => (
        <Fragment key={req.id}>
          {i === dividerIndex && <div class="request-list__pin-divider" />}
          <RequestItem
            request={req}
            isSelected={req.id === selectedId}
            isDiffBase={req.id === diffBaseId}
            isPinned={pinnedIds.has(req.id)}
            onClick={() => onSelect(req.id)}
            onTogglePin={() => onTogglePin(req.id)}
          />
        </Fragment>
      ))}
    </div>
  );
}
