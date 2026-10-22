// Optional smoke test. Point PLAYWRIGHT_MODULE_PATH at an available playwright/index.mjs.
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const origin = process.env.DIAGNOSTIC_TEST_ORIGIN || "http://localhost:3000";
const errors = [];
try {
  for (const viewport of [{ width: 1304, height: 884 }, { width: 375, height: 812 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/?seo`, { waitUntil: "domcontentloaded" });
    const launcher = page.locator("#seo-diag-open-btn");
    await launcher.waitFor({ timeout: 20000 });
    await page.waitForFunction(() => document.querySelector("#seo-diag-open-btn")?.textContent.includes("100/100"));
    await launcher.click();
    const modal = page.getByRole("dialog", { name: "SEO & Discoverability Diagnostic" });
    await modal.waitFor();
    await page.waitForFunction(() => document.querySelector(".seo-diag-score-badge .score-num")?.textContent === "100/100");
    assert.equal(await modal.locator('[data-status="passed"]').count(), 11);
    assert.equal(await modal.locator('[data-status="failed"]').count(), 0);
    const footerLinks = await page.locator("nav.footer-nav .footer-links a").evaluateAll((links) =>
      links.map((link) => ({ label: link.textContent.trim(), size: getComputedStyle(link).fontSize })));
    assert.equal(footerLinks.length, 7);
    assert.ok(footerLinks.every((link) => link.size === "14px"), JSON.stringify(footerLinks));
    assert.ok(await modal.evaluate((element) => element.scrollWidth <= element.clientWidth));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({ path: path.join(tmpdir(), `portfolio-diagnostic-${viewport.width}.png`) });

    // A missing tag must lower the live score, then recover when restored.
    const imageTag = await page.locator('meta[property="og:image"]').evaluate((element) => {
      const html = element.outerHTML;
      element.remove();
      return html;
    });
    await modal.locator('[data-check="og-tags"][data-status="failed"]').waitFor();
    assert.notEqual(await modal.locator(".score-num").textContent(), "100/100");
    await page.evaluate((html) => document.head.insertAdjacentHTML("beforeend", html), imageTag);
    await modal.locator('[data-check="og-tags"][data-status="passed"]').waitFor();

    const schema = page.locator('script[type="application/ld+json"]').first();
    const original = await schema.textContent();
    await schema.evaluate((element) => { element.textContent = "{ invalid"; });
    await modal.locator('[data-check="jsonld"][data-status="failed"]').waitFor();
    await schema.evaluate((element, json) => { element.textContent = json; }, original);
    await modal.locator('[data-check="jsonld"][data-status="passed"]').waitFor();

    await modal.getByRole("button", { name: "AI & Schema.org", exact: true }).click();
    assert.ok((await modal.innerText()).includes("4 URLs listed"));
    assert.ok((await modal.innerText()).includes("7 agent declarations"));
    assert.ok((await modal.innerText()).includes("7 topics"));
    assert.ok(!(await modal.innerText()).includes("9 Featured Projects"));
    await modal.getByRole("button", { name: /Keyword Notes/ }).click();
    await modal.getByRole("textbox", { name: "Keyword note" }).fill("Accurate portfolio topic");
    await modal.getByRole("button", { name: "Add", exact: true }).click();
    assert.equal(await modal.locator(".score-num").textContent(), "100/100");
    assert.equal(await page.locator('meta[name="keywords"]').count(), 0);

    // Fault injection verifies the UI never presents an HTML fallback as a discovery document.
    await page.route("**/llms.txt", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<html>Fallback</html>" }));
    await modal.getByRole("button", { name: "Run Checks Again" }).click();
    await modal.getByRole("button", { name: "Page Checks", exact: true }).click();
    await modal.locator('[data-check="llms.txt"][data-status="failed"]').waitFor();
    await page.unroute("**/llms.txt");
    await modal.getByRole("button", { name: "Run Checks Again" }).click();
    await modal.locator('[data-check="llms.txt"][data-status="passed"]').waitFor();

    await page.keyboard.press("Escape");
    await modal.waitFor({ state: "hidden" });
    // An actual SPA navigation unmounts the inspector on a case study; back mounts it with home evidence.
    await page.evaluate(() => {
      window.history.pushState({}, "", "/projects/tasafrica");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    await page.waitForFunction(() => document.title.startsWith("TASAfrica"));
    await page.goBack();
    await launcher.waitFor();
    await page.waitForFunction(() => document.querySelector("#seo-diag-open-btn")?.textContent.includes("100/100"));
    console.log(JSON.stringify({ viewport, technicalScore: 100, checks: 11, footerLinks,
      missingTagDetected: true, invalidSchemaDetected: true, htmlFallbackDetected: true, navigationPassed: true }));
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log("Diagnostic browser checks passed; no JavaScript page errors.");
} finally {
  await browser.close();
}
