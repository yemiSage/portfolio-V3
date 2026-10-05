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
];

const isFrameBlocked = (url) => {
  const host = url.hostname.replace(/^www\./, "");
  return FRAME_BLOCKED.some((blocked) => host === blocked || host.endsWith(`.${blocked}`));
};

// Opens outbound links in an in-site sheet instead of a new browser tab.
export default function InAppBrowser() {
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const closeRef = useRef(null);

  const close = useCallback(() => setTarget(null), []);

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
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!target) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && close();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [target, close]);

  if (!target) return null;

  const blocked = isFrameBlocked(target);
  const host = target.hostname.replace(/^www\./, "");
  const openExternal = () => window.open(target.href, "_blank", "noopener,noreferrer");

  return (
    <div className="iab-backdrop" onClick={close}>
      <div className="iab-sheet" role="dialog" aria-modal="true" aria-label={`Browsing ${host}`} onClick={(event) => event.stopPropagation()}>
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
          <button type="button" className="iab-open" onClick={openExternal}>
            Open in browser
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg>
          </button>
        </header>

        <div className="iab-body">
          {blocked ? (
            <div className="iab-fallback">
              <p className="iab-fallback-title">{host} can't be shown inside this site</p>
              <p className="iab-fallback-copy">This page blocks embedding, so it needs to open in your browser.</p>
              <button type="button" className="iab-fallback-button" onClick={openExternal}>Open in browser</button>
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
              <p className="iab-hint">Page blank or not loading? <button type="button" onClick={openExternal}>Open in browser</button></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
