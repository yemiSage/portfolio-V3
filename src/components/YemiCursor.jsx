import { useEffect, useRef } from "react";

export default function YemiCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!cursor || !finePointer.matches) return undefined;

    let frame = 0;
    const isDarkSurface = (element) => {
      if (element?.closest?.(".yemi-reel-final")) return true;
      let current = element;
      while (current && current !== document.documentElement) {
        const background = window.getComputedStyle(current).backgroundColor;
        const match = background.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match && Number(match[4] ?? 1) > 0.35) {
          const [, red, green, blue] = match.map(Number);
          return ((red * 299) + (green * 587) + (blue * 114)) / 1000 < 128;
        }
        current = current.parentElement;
      }
      return false;
    };
    const moveCursor = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        cursor.dataset.visible = "true";
        cursor.dataset.contrast = isDarkSurface(document.elementFromPoint(event.clientX, event.clientY)) ? "light" : "dark";
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
    <div className="yemi-cursor" ref={cursorRef} data-visible="false" data-contrast="dark" aria-hidden="true">
      <img className="yemi-cursor-pointer" src="/yemi-hand-cursor.png" alt="" />
      <span className="yemi-cursor-label">Yemi</span>
    </div>
  );
}
