import { useEffect, useRef, useState } from "preact/hooks";
import type { CapturedRequest } from "../types";
import { truncateUrl, formatSize } from "../lib/json-utils";
import { copyToClipboard } from "../lib/clipboard";

interface RequestItemProps {
  request: CapturedRequest;
  isSelected: boolean;
  isDiffBase: boolean;
  onClick: () => void;
}

function statusClass(status: number): string {
  if (status >= 500) return "request-item__status--error";
  if (status >= 400) return "request-item__status--warn";
  return "request-item__status--ok";
}

export function RequestItem({ request, isSelected, isDiffBase, onClick }: RequestItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [urlCopied, setUrlCopied] = useState(false);

  useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isSelected]);

  const handleCopyUrl = (e: MouseEvent) => {
    e.stopPropagation();
    if (copyToClipboard(request.url)) {
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 1200);
    }
  };

  let cls = "request-item";
  if (isSelected) cls += " request-item--selected";
  if (isDiffBase) cls += " request-item--diff-base";

  return (
    <div ref={itemRef} class={cls} onClick={onClick}>
      {isDiffBase && <span class="request-item__badge">BASE</span>}
      <span class="request-item__method">{request.method}</span>
      <span class="request-item__url" title={request.url}>
        {truncateUrl(request.url)}
      </span>
      <span
        class={`request-item__copy ${urlCopied ? "request-item__copy--copied" : ""}`}
        onClick={handleCopyUrl}
        title={urlCopied ? "Copied!" : "Copy URL"}
      >
        {urlCopied ? "\u2713" : "\u2398"}
      </span>
      <span class={`request-item__status ${statusClass(request.status)}`}>
        {request.status}
      </span>
      <span class="request-item__time">{Math.round(request.time)}ms</span>
      <span class="request-item__size">{formatSize(request.size)}</span>
    </div>
  );
}
