export const defaultNotePosition = index => ({ x: 20 + Math.floor(index / 2) * 300, y: 20 + (index % 2) * 250 });
export function nearestNoteSpace(occupied, target = { x: 20, y: 20 }) {
  const candidates = [];
  for (let column = 0; column <= occupied.length + 1; column++) {
    for (let row = 0; row < 2; row++) {
      const point = { x: 20 + column * 300, y: 20 + row * 250 };
      if (!occupied.some(other => Math.abs(other.x - point.x) < 280 && Math.abs(other.y - point.y) < 230)) candidates.push(point);
    }
  }
  return candidates.sort((a, b) => Math.hypot(a.x - target.x, a.y - target.y) - Math.hypot(b.x - target.x, b.y - target.y))[0];
}
