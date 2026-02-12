import { useRef, useState } from "preact/hooks";
import { copyToClipboard } from "../lib/clipboard";
import { formatJson } from "../lib/json-utils";
import { parseImportedText, readFileAsImport } from "../lib/import-json";
import { exportAsJson, exportAsHar } from "../lib/export";
import type { CapturedRequest } from "../types";

interface ToolbarProps {
  count: number;
  filteredCount: number;
  requests: CapturedRequest[];
  filteredRequests: CapturedRequest[];
  selected: CapturedRequest | null;
  diffBase: CapturedRequest | null;
  onClear: () => void;
  onSetDiffBase: () => void;
  onClearDiff: () => void;
  onImport: (parsed: unknown, label: string) => void;
}

export function Toolbar({
  count,
  filteredCount,
  requests,
  filteredRequests,
  selected,
  diffBase,
  onClear,
  onSetDiffBase,
  onClearDiff,
  onImport,
}: ToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (!selected?.parsed) return;
    const ok = copyToClipboard(formatJson(selected.parsed));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handlePaste = async () => {
    setImportError(null);
    try {
      // In DevTools, navigator.clipboard.readText may be blocked.
      // Try it first, fall back to prompt.
      let text: string;
      try {
        text = await navigator.clipboard.readText();
      } catch {
        text = prompt("Paste JSON here:") ?? "";
      }
      if (!text.trim()) return;
      const result = parseImportedText(text);
      if (result.error) {
        setImportError(result.error);
        setTimeout(() => setImportError(null), 3000);
      } else {
        onImport(result.parsed, result.label);
      }
    } catch {
      setImportError("Clipboard read failed");
      setTimeout(() => setImportError(null), 3000);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    setImportError(null);
    const result = await readFileAsImport(file);
    if (result.error) {
      setImportError(result.error);
      setTimeout(() => setImportError(null), 3000);
    } else {
      onImport(result.parsed, result.label);
    }
    // Reset so the same file can be re-imported
    input.value = "";
  };

  const handleExportJson = () => {
    const toExport = filteredCount < count ? filteredRequests : requests;
    exportAsJson(toExport);
    setShowExport(false);
  };

  const handleExportHar = () => {
    const toExport = filteredCount < count ? filteredRequests : requests;
    exportAsHar(toExport);
    setShowExport(false);
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
        {importError && (
          <span class="toolbar__error">{importError}</span>
        )}
        {diffBase && (
          <button class="toolbar__btn toolbar__btn--active" onClick={onClearDiff}>
            Exit Diff
          </button>
        )}
        {selected?.parsed != null && !diffBase && (
          <button class="toolbar__btn" onClick={onSetDiffBase} title="Set as diff base, then select another request to compare">
            Diff Base
          </button>
        )}
        {selected?.parsed != null && (
          <button class="toolbar__btn" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy JSON"}
          </button>
        )}
        <button class="toolbar__btn" onClick={handlePaste} title="Paste JSON from clipboard">
          Paste
        </button>
        <button class="toolbar__btn" onClick={handleFileClick} title="Import JSON file">
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.jsonl,.ndjson,.har,.txt"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {count > 0 && (
          <div class="toolbar__dropdown-wrap">
            <button
              class="toolbar__btn"
              onClick={() => setShowExport(!showExport)}
              title={filteredCount < count ? `Export ${filteredCount} filtered requests` : `Export all ${count} requests`}
            >
              Export ▾
            </button>
            {showExport && (
              <div class="toolbar__dropdown">
                <button class="toolbar__dropdown-item" onClick={handleExportJson}>
                  Export as JSON
                </button>
                <button class="toolbar__dropdown-item" onClick={handleExportHar}>
                  Export as HAR
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
