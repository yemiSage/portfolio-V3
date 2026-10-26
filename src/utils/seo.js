import { SITE, absoluteUrl, canonicalUrl, getRoute } from "../discoverability/site";

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    element.dataset.discoverability = "runtime";
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

function setMeta(name, content) {
  upsertMeta(`meta[name="${name}"]`, { name, content });
}

function setProperty(property, content) {
  upsertMeta(`meta[property="${property}"]`, { property, content });
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    link.dataset.discoverability = "runtime";
    document.head.appendChild(link);
  }
  link.href = href;
}

export function applyRouteMetadata(pathname) {
  const route = getRoute(pathname);
  if (!route) {
    document.title = `Page not found | ${SITE.name}`;
    setMeta("robots", "noindex, follow");
    return;
  }

  const canonical = canonicalUrl(route);
  const image = absoluteUrl(route.image || SITE.image);
  document.documentElement.lang = SITE.language;
  document.title = route.title;

  setMeta("description", route.description);
  setMeta(
    "robots",
    route.indexable
      ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      : "noindex, follow",
  );
  setCanonical(canonical);

  setProperty("og:type", route.type);
  setProperty("og:site_name", SITE.name);
  setProperty("og:locale", SITE.locale);
  setProperty("og:title", route.title);
  setProperty("og:description", route.description);
  setProperty("og:url", canonical);
  setProperty("og:image", image);
  setProperty("og:image:width", "1200");
  setProperty("og:image:height", "630");
  setProperty("og:image:alt", route.imageAlt || SITE.imageAlt);

  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", route.title);
  setMeta("twitter:description", route.description);
  setMeta("twitter:image", image);
  setMeta("twitter:image:alt", route.imageAlt || SITE.imageAlt);

  document.head
    .querySelectorAll('script[type="application/ld+json"][data-discoverability="route"]')
    .forEach((element) => element.remove());

  if (route.schema) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.discoverability = "route";
    script.textContent = JSON.stringify(route.schema).replace(/</g, "\\u003c");
    document.head.appendChild(script);
  }
}
