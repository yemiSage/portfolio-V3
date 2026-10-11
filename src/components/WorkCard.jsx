import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Cover for a work card: a looping, muted video when one is provided (played only while
// on screen), otherwise an image, otherwise the project's logo on its cover colour.
// Media fades in over the cover colour once it has loaded.
function CoverMedia({ item }) {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const useVideo = Boolean(item.video) && !prefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [useVideo]);

  if (useVideo) {
    return (
      <video
        ref={videoRef}
        className={`work-cover-media${isLoaded ? " is-loaded" : ""}`}
        src={item.video}
        poster={item.image}
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setIsLoaded(true)}
        aria-hidden="true"
      />
    );
  }

  if (item.image) {
    return (
      <img
        className={`work-cover-media${isLoaded ? " is-loaded" : ""}`}
        src={item.image}
        alt=""
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        ref={(node) => {
          // Cached images can finish loading before React attaches onLoad.
          if (node?.complete && node.naturalWidth > 0 && !isLoaded) setIsLoaded(true);
        }}
      />
    );
  }

  return (
    <div className="work-cover-logo" aria-hidden="true">
      {logoFailed || !item.logoDomain ? (
        <span>{item.name.slice(0, 2)}</span>
      ) : (
        <img
          src={`https://www.google.com/s2/favicons?domain=${item.logoDomain}&sz=128`}
          alt=""
          loading="lazy"
          onError={() => setLogoFailed(true)}
        />
      )}
    </div>
  );
}

// A project tile: cover on top, "Name / Type Year" caption below. On devices with a
// mouse, hovering shows the follow cursor (see WorkCursor) with the card's action label.
export default function WorkCard({ item }) {
  const isExternal = Boolean(item.href?.startsWith("http"));
  const Tag = item.href ? "a" : "article";
  const cursorLabel = item.href ? (isExternal ? "Visit site" : "View case study") : item.cursorLabel || "Coming soon";
  const linkProps = item.href
    ? {
        href: item.href,
        ...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}),
        "aria-label": isExternal ? `Visit the ${item.name} website` : `View the ${item.name} case study`,
      }
    : {};

  return (
    <Tag className="work-card" data-cursor={cursorLabel} {...linkProps}>
      <div className="work-cover" style={{ backgroundColor: item.coverColor || "#eef0f2" }}>
        <CoverMedia item={item} />
        <div className="work-cover-overlay" aria-hidden="true" />
      </div>
      <div className="work-caption">
        <p className="work-caption-line">
          <span className="work-caption-name">{item.name}</span>
          <span className="work-caption-divider" aria-hidden="true">/</span>
          <span className="work-caption-meta">{item.meta}</span>
        </p>
        {item.description && <p className="work-caption-description">{item.description}</p>}
      </div>
    </Tag>
  );
}
