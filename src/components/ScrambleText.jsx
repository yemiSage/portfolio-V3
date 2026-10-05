import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const START_DELAY = 10; // frames before the first character resolves
const FRAMES_PER_CHAR = 2; // frames between each character locking in
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

// Decrypt-style reveal: characters resolve left to right while the rest scramble.
export default function ScrambleText({ text, className = "" }) {
  const [frame, setFrame] = useState(0);
  const [locks] = useState(() =>
    Array.from(text, (char, index) =>
      char === " " ? 0 : START_DELAY + index * FRAMES_PER_CHAR + Math.floor(Math.random() * 4),
    ),
  );
  const glyphs = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFrame(Number.MAX_SAFE_INTEGER);
      return undefined;
    }
    let id;
    let current = 0;
    const tick = () => {
      current += 1;
      setFrame(current);
      if (current < Math.max(...locks)) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [locks]);

  let headPlaced = false;
  const chars = Array.from(text).map((char, index) => {
    if (frame >= locks[index]) return <span key={index}>{char}</span>;
    if (!glyphs.current[index] || frame % 2 === 0) glyphs.current[index] = randomGlyph();
    const head = headPlaced ? null : <span key={`head-${index}`} className="scramble-head" />;
    headPlaced = true;
    return [head, <span key={index} className="scramble-dim">{glyphs.current[index]}</span>];
  });

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{chars}</span>
    </span>
  );
}
