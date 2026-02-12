import { useState } from "preact/hooks";
import { copyToClipboard } from "../lib/clipboard";
import { formatJson } from "../lib/json-utils";
import type { CapturedRequest } from "../types";

interface ToolbarProps {
  count: number;
  selected: CapturedRequest | null;
  onClear: () => void;
}

export function Toolbar({ count, selected, onClear }: ToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!selected?.parsed) return;
    const ok = copyToClipboard(formatJson(selected.parsed));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div class="toolbar">
      <div class="toolbar__left">
        <button class="toolbar__btn" onClick={onClear} title="Clear all">
          Clear
        </button>
        <span class="toolbar__count">
          {count} request{count !== 1 ? "s" : ""}
        </span>
      </div>
      <div class="toolbar__right">
        {selected?.parsed != null && (
          <button class="toolbar__btn" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy JSON"}
          </button>
        )}
      </div>
    </div>
  );
}
