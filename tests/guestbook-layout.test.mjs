import test from "node:test";
import assert from "node:assert/strict";
import { defaultNotePosition, nearestNoteSpace } from "../src/utils/guestbookLayout.mjs";
test("new note placement chooses nearest vacant cell without overlapping existing notes", () => {
  const occupied = [defaultNotePosition(0), defaultNotePosition(1)];
  assert.deepEqual(nearestNoteSpace(occupied), { x: 320, y: 20 });
  const moved = [...occupied, { x: 300, y: 30 }];
  const point = nearestNoteSpace(moved);
  assert.ok(!moved.some(other => Math.abs(other.x - point.x) < 280 && Math.abs(other.y - point.y) < 230));
  assert.deepEqual(nearestNoteSpace([], { x: 320, y: 270 }), { x: 320, y: 270 });
});
