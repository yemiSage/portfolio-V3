import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES } from "../src/discoverability/site.js";
import {
  renderLlms,
  renderNotFoundHtml,
  renderRobots,
  renderRouteHtml,
  renderSitemap,
} from "../src/discoverability/render.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2];

async function writeMachineFiles(directory) {
  await mkdir(directory, { recursive: true });
  await Promise.all([
    writeFile(path.join(directory, "robots.txt"), renderRobots(), "utf8"),
    writeFile(path.join(directory, "sitemap.xml"), renderSitemap(), "utf8"),
    writeFile(path.join(directory, "llms.txt"), renderLlms(), "utf8"),
  ]);
}

async function generatePublicFiles() {
  await writeMachineFiles(path.join(projectRoot, "public"));
}

async function generateDistFiles() {
  const distDirectory = path.join(projectRoot, "dist");
  const templatePath = path.join(distDirectory, "index.html");
  const template = await readFile(templatePath, "utf8");

  await writeMachineFiles(distDirectory);

  for (const route of ROUTES) {
    const outputDirectory =
      route.path === "/"
        ? distDirectory
        : path.join(distDirectory, ...route.path.slice(1).split("/"));
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(
      path.join(outputDirectory, "index.html"),
      renderRouteHtml(template, route),
      "utf8",
    );
  }

  await writeFile(path.join(distDirectory, "404.html"), renderNotFoundHtml(template), "utf8");
  const inboxDirectory = path.join(distDirectory, "me", "LLM");
  await mkdir(inboxDirectory, { recursive: true });
  const inboxHtml = template
    .replace(/<title>.*?<\/title>/s, "<title>yemiLLM · Private inbox</title>")
    .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, nofollow, noarchive" />');
  await writeFile(path.join(inboxDirectory, "index.html"), inboxHtml, "utf8");
}

if (mode === "--public") {
  await generatePublicFiles();
} else if (mode === "--dist") {
  await generateDistFiles();
} else {
  throw new Error("Use --public or --dist");
}
