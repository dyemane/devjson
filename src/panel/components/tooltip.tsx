import { useEffect, useRef, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";

interface TooltipProps {
  content: ComponentChildren;
  children: ComponentChildren;
  class?: string;
  delay?: number;
}

export function Tooltip({ content, children, class: cls, delay = 400 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const show = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <span class={`tip-wrap ${cls || ""}`} onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && <span class="tip">{content}</span>}
    </span>
  );
}
