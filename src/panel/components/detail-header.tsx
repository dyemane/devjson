import { useState } from "preact/hooks";
import type { CapturedRequest } from "../types";
import { formatSize } from "../lib/json-utils";

interface DetailHeaderProps {
  request: CapturedRequest;
}

function statusClass(status: number): string {
  if (status >= 500) return "detail-header__status--error";
  if (status >= 400) return "detail-header__status--warn";
  return "detail-header__status--ok";
}

export function DetailHeader({ request }: DetailHeaderProps) {
  const [showHeaders, setShowHeaders] = useState(false);

  return (
    <div class="detail-header">
      <div class="detail-header__summary">
        <span class="detail-header__method">{request.method}</span>
        <span class={`detail-header__status ${statusClass(request.status)}`}>
          {request.status} {request.statusText}
        </span>
        <span class="detail-header__meta">
          {Math.round(request.time)}ms
        </span>
        <span class="detail-header__meta">
          {formatSize(request.size)}
        </span>
        <button
          class="detail-header__toggle"
          onClick={() => setShowHeaders(!showHeaders)}
        >
          {showHeaders ? "Hide Headers" : "Headers"}
        </button>
      </div>
      <div class="detail-header__url" title={request.url}>
        {request.url}
      </div>
      {showHeaders && (
        <div class="detail-header__headers">
          <div class="detail-header__section">
            <div class="detail-header__section-title">Request Headers</div>
            {request.requestHeaders.map((h) => (
              <div class="detail-header__row" key={h.name}>
                <span class="detail-header__name">{h.name}:</span>{" "}
                <span class="detail-header__value">{h.value}</span>
              </div>
            ))}
          </div>
          <div class="detail-header__section">
            <div class="detail-header__section-title">Response Headers</div>
            {request.responseHeaders.map((h) => (
              <div class="detail-header__row" key={h.name}>
                <span class="detail-header__name">{h.name}:</span>{" "}
                <span class="detail-header__value">{h.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
