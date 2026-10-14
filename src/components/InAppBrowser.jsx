import { useCallback, useEffect, useRef, useState } from "react";

// Sites that refuse to be embedded (X-Frame-Options / frame-ancestors).
const FRAME_BLOCKED = [
  "github.com",
  "instagram.com",
  "linkedin.com",
  "google.com",
  "whatsapp.com",
  "wa.me",
  "x.com",
  "twitter.com",
  "facebook.com",
  "toraflare.com",
  "kilanra.vercel.app",
];

const isFrameBlocked = (url) => {
  // Drive's /preview endpoint is embeddable, unlike /view.
  if (url.hostname === "drive.google.com" && url.pathname.endsWith("/preview")) return false;
  const host = url.hostname.replace(/^www\./, "");
  return FRAME_BLOCKED.some((blocked) => host === blocked || host.endsWith(`.${blocked}`));
};

// Opens outbound links in an in-site sheet instead of a new browser tab.
export default function InAppBrowser() {
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const closeRef = useRef(null);
  const dragStartRef = useRef(null);

  const close = useCallback(() => {
    setTarget(null);
    setDragY(0);
    setHasDragged(false);
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  const onGripPointerDown = (event) => {
    dragStartRef.current = { pointerId: event.pointerId, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    setHasDragged(true);
    setIsDragging(true);
  };

  const onGripPointerMove = (event) => {
    if (dragStartRef.current?.pointerId !== event.pointerId) return;
    setDragY(Math.max(0, event.clientY - dragStartRef.current.y));
  };

  const onGripPointerUp = (event) => {
    if (dragStartRef.current?.pointerId !== event.pointerId) return;
    const distance = Math.max(0, event.clientY - dragStartRef.current.y);
    dragStartRef.current = null;
    setIsDragging(false);
    if (distance > 90) close();
    else setDragY(0);
  };

  const onGripPointerCancel = () => {
    dragStartRef.current = null;
    setIsDragging(false);
    setDragY(0);
  };

  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!anchor || anchor.hasAttribute("download") || anchor.hasAttribute("data-external")) return;
      let url;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (!/^https?:$/.test(url.protocol) || url.origin === window.location.origin) return;
      event.preventDefault();
      setLoading(true);
      setTarget(url);
    };
    // Lets other code (e.g. the Resume link) open a URL in the sheet.
    const onOpen = (event) => {
      try {
        const url = new URL(event.detail, window.location.href);
        setLoading(true);
        setTarget(url);
      } catch {
        // ignore malformed URLs
      }
    };
    document.addEventListener("click", onClick);
    window.addEventListener("open-in-app-browser", onOpen);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("open-in-app-browser", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!target) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && close();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("iab-open");
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("iab-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [target, close]);

  if (!target) return null;

  const blocked = isFrameBlocked(target);
  const host = target.hostname.replace(/^www\./, "");
  const externalLink = { href: target.href, target: "_blank", rel: "noopener noreferrer", "data-external": true };

  return (
    <div className="iab-backdrop" onClick={close}>
      <div
        className={`iab-sheet${blocked ? " iab-sheet--blocked" : ""}${hasDragged ? " iab-sheet--touched" : ""}${isDragging ? " iab-sheet--dragging" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Browsing ${host}`}
        onClick={(event) => event.stopPropagation()}
        style={hasDragged ? { transform: `translateY(${dragY}px)` } : undefined}
      >
        <div
          className="iab-grip-zone"
          aria-hidden="true"
          onPointerDown={onGripPointerDown}
          onPointerMove={onGripPointerMove}
          onPointerUp={onGripPointerUp}
          onPointerCancel={onGripPointerCancel}
        >
          <span className="iab-grip" />
        </div>
        <header className="iab-header">
          <button type="button" className="iab-icon-button" ref={closeRef} onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <div className="iab-address" title={target.href}>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
            <span>{host}</span>
          </div>
          {!blocked && (
            <button type="button" className="iab-icon-button" onClick={() => { setLoading(true); setReloadKey((key) => key + 1); }} aria-label="Reload">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12a8 8 0 11-2.34-5.66M20 4v4h-4" /></svg>
            </button>
          )}
          <a className="iab-open" {...externalLink}>
            Open in browser
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg>
          </a>
        </header>

        <div className="iab-body">
          {blocked ? (
            <div className="iab-fallback">
              <p className="iab-fallback-title">{host} can't be shown inside this site</p>
              <a className="iab-fallback-button" {...externalLink}>Open in browser</a>
            </div>
          ) : (
            <>
              {loading && <div className="iab-loading" aria-hidden="true" />}
              <iframe
                key={reloadKey}
                className="iab-frame"
                src={target.href}
                title={host}
                onLoad={() => setLoading(false)}
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              />
              <p className="iab-hint">Page blank or not loading? <a {...externalLink}>Open in browser</a></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
