import type { CapturedRequest } from "../types";
import { truncateUrl, formatSize } from "../lib/json-utils";

interface RequestItemProps {
  request: CapturedRequest;
  isSelected: boolean;
  onClick: () => void;
}

function statusClass(status: number): string {
  if (status >= 500) return "request-item__status--error";
  if (status >= 400) return "request-item__status--warn";
  return "request-item__status--ok";
}

export function RequestItem({ request, isSelected, onClick }: RequestItemProps) {
  return (
    <div
      class={`request-item ${isSelected ? "request-item--selected" : ""}`}
      onClick={onClick}
    >
      <span class="request-item__method">{request.method}</span>
      <span class="request-item__url" title={request.url}>
        {truncateUrl(request.url)}
      </span>
      <span class={`request-item__status ${statusClass(request.status)}`}>
        {request.status}
      </span>
      <span class="request-item__time">{Math.round(request.time)}ms</span>
      <span class="request-item__size">{formatSize(request.size)}</span>
    </div>
  );
}
