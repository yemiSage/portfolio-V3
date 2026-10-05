import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const START_DELAY = 10; // frames before the first character resolves
const MAX_FRAMES_PER_CHAR = 2; // frames between each character locking in
const MAX_SWEEP_FRAMES = 60; // keep long titles from taking too long
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

// Decrypt-style reveal: characters resolve left to right while the rest scramble.
export default function ScrambleText({ text, className = "" }) {
  const [frame, setFrame] = useState(0);
  const [locks] = useState(() => {
    const stride = Math.min(MAX_FRAMES_PER_CHAR, MAX_SWEEP_FRAMES / Math.max(text.length, 1));
    return Array.from(text, (char, index) =>
      char === " " ? 0 : START_DELAY + index * stride + Math.floor(Math.random() * 4),
    );
  });
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

  const done = frame >= Math.max(...locks);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars}
        {done && <span className="scramble-caret" />}
      </span>
    </span>
  );
}
