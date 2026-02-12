import { useEffect, useRef, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { copyToClipboard } from "../lib/clipboard";

interface CopyableProps {
  text: string;
  children: ComponentChildren;
  class?: string;
  /** Rich tooltip content shown on hover. Omit for no hover tooltip. */
  tooltip?: ComponentChildren;
}

export function Copyable({ text, children, class: cls, tooltip }: CopyableProps) {
  const [copied, setCopied] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (copyToClipboard(text)) {
      setCopied(true);
      setShowTip(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCopied(false);
        setShowTip(false);
      }, 1200);
    }
  };

  const handleEnter = () => {
    if (copied) return;
    clearTimeout(timerRef.current);
    if (tooltip) {
      timerRef.current = setTimeout(() => setShowTip(true), 400);
    }
  };

  const handleLeave = () => {
    clearTimeout(timerRef.current);
    if (!copied) setShowTip(false);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <span
      class={`copyable ${copied ? "copyable--copied" : ""} ${cls || ""}`}
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      {showTip && (
        <span class={`tip ${copied ? "tip--success" : ""}`}>
          {copied ? (
            <><span class="tip__icon">&#x2713;</span> Copied!</>
          ) : tooltip}
        </span>
      )}
    </span>
  );
}
