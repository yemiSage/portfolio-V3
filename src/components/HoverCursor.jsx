import { useEffect, useRef, useState } from "react";
import { HOVER_MEDIA } from "../utils/hover";

// Follow cursor for thumbnails: over any element with data-cursor, the pointer is replaced
// by a small square and that element's label, pinned to the mouse. Mouse devices only;
// touch devices keep their normal behaviour.
export default function HoverCursor() {
  const cursorRef = useRef(null);
  const [label, setLabel] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(HOVER_MEDIA);
    const update = () => setIsEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isEnabled) return undefined;
    document.documentElement.classList.add("has-hover-cursor");
    let currentLabel = "";
    let pointer = null;

    const showLabelFor = (element) => {
      const target = element instanceof Element ? element.closest("[data-cursor]") : null;
      const nextLabel = target?.getAttribute("data-cursor") || "";
      if (nextLabel !== currentLabel) {
        currentLabel = nextLabel;
        setLabel(nextLabel);
      }
    };

    const hide = () => {
      pointer = null;
      showLabelFor(null);
    };

    const handleMove = (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      const cursor = cursorRef.current;
      if (cursor) cursor.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      showLabelFor(event.target);
    };

    // Scrolling moves cards under a still pointer, so re-check what is beneath it.
    const handleScroll = () => {
      if (pointer) showLabelFor(document.elementFromPoint(pointer.x, pointer.y));
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => {
      document.documentElement.classList.remove("has-hover-cursor");
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div ref={cursorRef} className={`hover-cursor${label ? " is-visible" : ""}`} aria-hidden="true">
      <span className="hover-cursor-dot" />
      <span className="hover-cursor-label">{label}</span>
    </div>
  );
}
