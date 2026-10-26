import test from "node:test";
import assert from "node:assert/strict";

test("the intro is eligible only on a first homepage visit", async () => {
  const gate = await import("../src/utils/homeIntro.mjs?first-home");
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  for (const path of ["/guestbook", "/about", "/resume", "/projects/limestone"]) {
    assert.equal(gate.shouldShowHomeIntro(path, storage), false);
  }
  assert.equal(gate.shouldShowHomeIntro("/", storage), true);
  gate.markHomeIntroSeen(storage);
  assert.equal(gate.shouldShowHomeIntro("/", storage), false);
  // A fresh module represents another page load, using the same persisted browser storage.
  const fresh = await import("../src/utils/homeIntro.mjs?return-visit");
  assert.equal(fresh.shouldShowHomeIntro("/", storage), false);
});

test("blocked storage still prevents repeated intros during navigation", async () => {
  const gate = await import("../src/utils/homeIntro.mjs?blocked-storage");
  const storage = { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); } };
  assert.equal(gate.shouldShowHomeIntro("/guestbook", storage), false);
  assert.equal(gate.shouldShowHomeIntro("/", storage), true);
  gate.markHomeIntroSeen(storage);
  assert.equal(gate.shouldShowHomeIntro("/", storage), false);
});
