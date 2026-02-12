import { useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { copyToClipboard } from "../lib/clipboard";

interface CopyableProps {
  text: string;
  children: ComponentChildren;
  class?: string;
  title?: string;
}

export function Copyable({ text, children, class: cls, title }: CopyableProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (copyToClipboard(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <span
      class={`copyable ${copied ? "copyable--copied" : ""} ${cls || ""}`}
      onClick={handleClick}
      title={copied ? "Copied!" : title || "Click to copy"}
    >
      {children}
    </span>
  );
}
