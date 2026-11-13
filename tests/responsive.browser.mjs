import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { chromium } from "playwright-core";

const baseURL = process.env.RESPONSIVE_BASE_URL || "http://localhost:3000";
const widths = [280, 320, 360, 375, 390, 414, 480, 640, 767, 768, 820, 912, 1024, 1199, 1200, 1280, 1440, 1920, 2560];
const routes = ["/", "/about", "/guestbook", "/projects/limestone", "/projects/stayafrika", "/projects/tasafrica", "/resume"];
let browser;

before(async () => {
  browser = await chromium.launch({ channel: "chrome", headless: true });
});
after(async () => browser?.close());

async function openPage(route, viewport = { width: 375, height: 900 }) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("yemi:homepage-intro-seen:v1", "1"));
  await page.goto(new URL(route, baseURL).href, { waitUntil: "domcontentloaded" });
  await page.locator("#root .portfolio, #root .case-study-page").waitFor();
  return page;
}

for (const route of routes) {
  test(`${route} fits phone, tablet and desktop widths`, async () => {
    const page = await openPage(route);
    try {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        // Let ResizeObserver-based figures settle at the new viewport size.
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const header = page.locator(".shared-site-header");
        if (width < 1200) await header.waitFor({ state: "visible" });
        else await header.waitFor({ state: "hidden" });
        const layout = await page.evaluate(() => ({
          viewport: innerWidth,
          document: document.documentElement.scrollWidth,
          overlaps: [...document.querySelectorAll(".identity-top")].filter(e => e.getClientRects().length && getComputedStyle(e).display !== "none").some(row => {
            const children = [...row.children].filter(e => e.getClientRects().length).map(e => e.getBoundingClientRect());
            return children.length > 1 && children[0].right > children[1].left + 1;
          }),
          resumeOverflow: [...document.querySelectorAll(".resume-toolbar a")].some(e => e.getBoundingClientRect().right > innerWidth + 1),
        }));
        assert.ok(layout.document <= layout.viewport + 1, `${route} overflows at ${width}px: ${JSON.stringify(layout)}`);
        assert.equal(layout.overlaps, false, `${route} navigation overlaps at ${width}px`);
        assert.equal(layout.resumeOverflow, false, `Resume actions overflow at ${width}px`);
      }
    } finally { await page.close(); }
  });
}

for (const route of ["/", "/about"]) {
  test(`${route} navigation works in landscape and resets after resizing`, async () => {
    const page = await openPage(route, { width: 844, height: 390 });
    try {
      await page.getByRole("button", { name: "Open navigation menu", exact: true }).click();
      await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).waitFor();
      await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).getByRole("link", { name: "Resume", exact: true }).scrollIntoViewIfNeeded();
      await page.keyboard.press("Escape");
      await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).waitFor({ state: "hidden" });
      await page.getByRole("button", { name: "Open navigation menu", exact: true }).click();
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).waitFor({ state: "hidden" });
      assert.notEqual(await page.evaluate(() => document.body.style.overflow), "hidden", "Desktop must allow scrolling after the menu closes");
      await page.setViewportSize({ width: 375, height: 812 });
      await page.getByRole("button", { name: "Open navigation menu", exact: true }).waitFor();
    } finally { await page.close(); }
  });
}

test("Resume preview controls fit narrow phones", async () => {
  const page = await openPage("/about", { width: 280, height: 700 });
  try {
    await page.route("https://example.com/", route => route.fulfill({ contentType: "text/html", body: "Preview" }));
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("open-in-app-browser", { detail: "https://example.com/" })));
    await page.locator(".iab-header").waitFor();
    for (const width of [280, 320, 375, 430]) {
      await page.setViewportSize({ width, height: 700 });
      assert.ok(await page.locator(".iab-address").evaluate(e => e.clientWidth >= 100), `Preview address is squeezed at ${width}px`);
      assert.ok(await page.locator(".iab-header").evaluate(e => e.scrollWidth <= e.clientWidth + 1), `Preview toolbar overflows at ${width}px`);
    }
  } finally { await page.close(); }
});
