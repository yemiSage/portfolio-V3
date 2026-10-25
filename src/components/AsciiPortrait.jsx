import { useCallback, useEffect, useRef } from "react";

// Brightness ramp from dense to sparse glyphs.
const RAMP = "@%#*+=-:. ".split("");
const SIZE = 480;
const CELL_W = 5;
const CELL_H = 8;

// The avatar sits on an orange hexagon; skip those pixels so only the person is drawn.
function isBackground(r, g, b, a) {
  if (a < 20) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return r > 180 && r - b > 110 && max - min > 110 && g < 170;
}

function toneColor(luma) {
  if (luma < 70) return "#1f1d1a";
  if (luma < 140) return "#4a4540";
  if (luma < 200) return "#8a8178";
  return "#c9bfb3";
}

function buildParticles(img) {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, SIZE, SIZE);
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const particles = [];

  for (let y = CELL_H; y < SIZE; y += CELL_H) {
    for (let x = 0; x < SIZE; x += CELL_W) {
      const i = ((y - CELL_H / 2) * SIZE + x + Math.floor(CELL_W / 2)) * 4;
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      if (isBackground(r, g, b, a)) continue;
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      const char = RAMP[Math.min(RAMP.length - 1, Math.floor((luma / 256) * RAMP.length))];
      if (char === " ") continue;

      // Start scattered outward from the centre so the face assembles on load.
      const angle = Math.atan2(y - cy, x - cx) + Math.random() * 2;
      const dist = Math.hypot(x - cx, y - cy) + Math.random() * 350 + 150;
      particles.push({
        char,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        baseX: x,
        baseY: y,
        density: Math.random() * 15 + 5,
        color: toneColor(luma),
      });
    }
  }
  return particles;
}

export default function AsciiPortrait({ src, alt, className = "" }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const pointerRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (!cancelled) particlesRef.current = buildParticles(img);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame;

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.font = "8px monospace";
      const { x: px, y: py } = pointerRef.current;
      const radius = window.innerWidth > 768 ? 55 : 75;
      const radiusSq = radius * radius;

      for (const p of particlesRef.current) {
        if (reduceMotion) {
          p.x = p.baseX;
          p.y = p.baseY;
        }
        const dx = px - p.x;
        const dy = py - p.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < radiusSq && distSq > 0 && !reduceMotion) {
          // Push away with a tangential swirl.
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;
          const force = ((radius - dist) / radius) * p.density;
          p.x -= (nx + ny * 1.5) * force;
          p.y -= (ny - nx * 1.5) * force;
        } else {
          const ease = p.density * 0.85;
          const ox = p.x - p.baseX;
          const oy = p.y - p.baseY;
          p.x = Math.abs(ox) < 0.5 ? p.baseX : p.x - ox / ease;
          p.y = Math.abs(oy) < 0.5 ? p.baseY : p.y - oy / ease;
        }
        const displaced = (p.x - p.baseX) ** 2 + (p.y - p.baseY) ** 2 > 2;
        ctx.fillStyle = displaced ? "#E0733D" : p.color;
        ctx.fillText(p.char, p.x, p.y);
      }
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  const setPointer = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    pointerRef.current = {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  const resetPointer = useCallback(() => {
    pointerRef.current = { x: -9999, y: -9999 };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`ascii-portrait ${className}`.trim()}
      width={SIZE}
      height={SIZE}
      role="img"
      aria-label={alt}
      onMouseMove={(e) => setPointer(e.clientX, e.clientY)}
      onMouseLeave={resetPointer}
      onTouchMove={(e) => setPointer(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={resetPointer}
      onTouchCancel={resetPointer}
    />
  );
}
