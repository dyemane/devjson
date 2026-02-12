import { useCallback, useRef, useState } from "preact/hooks";

type Direction = "horizontal" | "vertical";

export function useResize(
  initialSize: number,
  min = 150,
  max = 800,
  direction: Direction = "horizontal",
) {
  const [size, setSize] = useState(initialSize);
  const dragging = useRef(false);
  const startPos = useRef(0);
  const startSize = useRef(0);

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startPos.current = direction === "horizontal" ? e.clientX : e.clientY;
      startSize.current = size;

      const onMouseMove = (e: MouseEvent) => {
        if (!dragging.current) return;
        const pos = direction === "horizontal" ? e.clientX : e.clientY;
        const delta = pos - startPos.current;
        const next = Math.min(max, Math.max(min, startSize.current + delta));
        setSize(next);
      };

      const onMouseUp = () => {
        dragging.current = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor =
        direction === "horizontal" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [size, min, max, direction],
  );

  return { size, onMouseDown };
}
