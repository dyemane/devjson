import { useState } from "preact/hooks";
import type { CapturedRequest } from "../types";
import { formatSize } from "../lib/json-utils";
import { Copyable } from "./copyable";

interface DetailHeaderProps {
  request: CapturedRequest;
}

function statusClass(status: number): string {
  if (status >= 500) return "detail-header__status--error";
  if (status >= 400) return "detail-header__status--warn";
  return "detail-header__status--ok";
}

function urlTip(url: string) {
  return (
    <>
      <span class="tip__preview tip__preview--wrap">{url}</span>
      <span class="tip__meta">click to copy URL</span>
    </>
  );
}

function headerTip(name: string, value: string) {
  const preview = value.length > 80 ? value.slice(0, 80) + "\u2026" : value;
  return (
    <>
      <span class="tip__label">{name}</span>
      <span class="tip__preview">{preview}</span>
      <span class="tip__meta">click to copy value</span>
    </>
  );
}

export function DetailHeader({ request }: DetailHeaderProps) {
  const [showHeaders, setShowHeaders] = useState(false);

  return (
    <div class="detail-header">
      <div class="detail-header__summary">
        <span class="detail-header__method">{request.method}</span>
        <Copyable text={request.url} class="detail-header__url" tooltip={urlTip(request.url)}>
          {request.url}
        </Copyable>
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
      {showHeaders && (
        <div class="detail-header__headers">
          <div class="detail-header__section">
            <div class="detail-header__section-title">Request Headers</div>
            {request.requestHeaders.map((h) => (
              <div class="detail-header__row" key={h.name}>
                <Copyable
                  text={h.name}
                  class="detail-header__name"
                  tooltip={<span class="tip__meta">click to copy name</span>}
                >
                  {h.name}:
                </Copyable>{" "}
                <Copyable
                  text={h.value || ""}
                  class="detail-header__value"
                  tooltip={headerTip(h.name, h.value || "")}
                >
                  {h.value}
                </Copyable>
              </div>
            ))}
          </div>
          <div class="detail-header__section">
            <div class="detail-header__section-title">Response Headers</div>
            {request.responseHeaders.map((h) => (
              <div class="detail-header__row" key={h.name}>
                <Copyable
                  text={h.name}
                  class="detail-header__name"
                  tooltip={<span class="tip__meta">click to copy name</span>}
                >
                  {h.name}:
                </Copyable>{" "}
                <Copyable
                  text={h.value || ""}
                  class="detail-header__value"
                  tooltip={headerTip(h.name, h.value || "")}
                >
                  {h.value}
                </Copyable>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
