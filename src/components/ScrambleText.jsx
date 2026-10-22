import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const START_DELAY = 10; // frames before the first character resolves
const MAX_FRAMES_PER_CHAR = 2; // frames between each character locking in
const MAX_SWEEP_FRAMES = 60; // keep long titles from taking too long
// Titles that have already played this page load, so the effect runs once and not on every remount.
const PLAYED = new Set();
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

// Decrypt-style reveal: characters resolve left to right while the rest scramble.
// Starts once `active` is true and the text has scrolled into view.
export default function ScrambleText({ text, className = "", active = true }) {
  const rootRef = useRef(null);
  const glyphs = useRef([]);
  const [inView, setInView] = useState(false);
  const [reduced] = useState(
    () => PLAYED.has(text) || window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [frame, setFrame] = useState(0);
  const [locks] = useState(() => {
    const stride = Math.min(MAX_FRAMES_PER_CHAR, MAX_SWEEP_FRAMES / Math.max(text.length, 1));
    return Array.from(text, (char, index) =>
      char === " " ? 0 : START_DELAY + index * stride + Math.floor(Math.random() * 4),
    );
  });
  const lastLock = Math.max(...locks);
  const started = active && inView;

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reduced) return undefined;
    let id;
    let current = 0;
    const tick = () => {
      current += 1;
      setFrame(current);
      if (current < lastLock) id = requestAnimationFrame(tick);
      else PLAYED.add(text);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [started, reduced, lastLock, text]);

  const done = reduced || frame >= lastLock;
  const fixedLines = text.includes("\n");

  let headPlaced = false;
  const chars = Array.from(text).map((char, index) => {
    if (char === "\n") return null;
    if (done || frame >= locks[index]) return <span key={index}>{char}</span>;
    if (!glyphs.current[index] || frame % 2 === 0) glyphs.current[index] = randomGlyph();
    const head = headPlaced ? null : <span key={`head-${index}`} className="scramble-head" />;
    headPlaced = true;
    if (fixedLines) {
      return (
        <span key={index} className="scramble-slot">
          <span className="scramble-slot-size">{char === " " ? "\u00a0" : char}</span>
          <span className="scramble-slot-glyph">{head}<span className="scramble-dim">{glyphs.current[index]}</span></span>
        </span>
      );
    }
    return [head, <span key={index} className="scramble-dim">{glyphs.current[index]}</span>];
  });

  let lineOffset = 0;
  const content = fixedLines ? text.split("\n").map((line, index, lines) => {
    const lineChars = chars.slice(lineOffset, lineOffset + line.length);
    lineOffset += line.length + 1;
    return (
      <span className="scramble-line" key={index}>
        {started || reduced ? lineChars : line}
        {done && index === lines.length - 1 && <span className="scramble-caret" />}
      </span>
    );
  }) : null;

  return (
    <span className={className} ref={rootRef}>
      <span className="sr-only">{text}</span>
      {fixedLines ? (
        <span aria-hidden="true" style={!started && !reduced ? { opacity: 0 } : undefined}>{content}</span>
      ) : started || reduced ? (
        <span aria-hidden="true">
          {chars}
          {done && <span className="scramble-caret" />}
        </span>
      ) : (
        // Holds the layout until the reveal starts.
        <span aria-hidden="true" style={{ opacity: 0 }}>{text}</span>
      )}
    </span>
  );
}
