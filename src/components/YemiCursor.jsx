import { useEffect, useRef } from "react";

export default function YemiCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!cursor || !finePointer.matches) return undefined;

    let frame = 0;
    const moveCursor = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        cursor.dataset.visible = "true";
      });
    };
    const hideCursor = () => { cursor.dataset.visible = "false"; };

    window.addEventListener("pointermove", moveCursor, { passive: true });
    document.documentElement.addEventListener("mouseleave", hideCursor);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", moveCursor);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
    };
  }, []);

  return (
    <div className="yemi-cursor" ref={cursorRef} data-visible="false" aria-hidden="true">
      <span className="yemi-cursor-pointer" />
      <span className="yemi-cursor-label">Yemi</span>
    </div>
  );
}
