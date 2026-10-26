import { useEffect, useRef, useState } from "react";
import { CloseCircle, HamburgerMenu } from "iconsax-reactjs";
import AiAsteriskIcon from "./AiAsteriskIcon";
import AsciiPortrait from "./AsciiPortrait";
import { ResponsiveResumeLink } from "./ResumePage";
import "../site-header.css";

export function ProfileLinks({ onOpenAiChat, className = "identity-links" }) {
  return <nav className={className} aria-label="Profile links">
    <button type="button" className="nav-yemi-llm-btn" onClick={onOpenAiChat} aria-label="Open yemiLLM"><AiAsteriskIcon size={14} /><span>yemiLLM</span></button>
    <a href="/about"><span>About</span></a>
    <ResponsiveResumeLink />
  </nav>;
}

export default function SiteHeader({ onOpenAiChat, desktop = false, menuOpen: controlledOpen, onMenuChange }) {
  const [localOpen, setLocalOpen] = useState(false);
  const menuOpen = controlledOpen ?? localOpen;
  const setMenuOpen = onMenuChange || setLocalOpen;
  const toggle = useRef(null);
  const menu = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => menu.current?.querySelector("button, a")?.focus());
    const onEscape = e => { if (e.key === "Escape") { setMenuOpen(false); toggle.current?.focus(); } };
    addEventListener("keydown", onEscape);
    return () => { cancelAnimationFrame(frame); document.body.style.overflow = previous; removeEventListener("keydown", onEscape); };
  }, [menuOpen, setMenuOpen]);
  const trapFocus = event => {
    if (event.key !== "Tab") return;
    const items = [...menu.current.querySelectorAll("button,a")];
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return <header className={`mobile-header shared-site-header${desktop ? " shared-site-header--desktop" : ""}`}>
    <a className="portrait portrait-ascii mobile-brand" href="/" aria-label="Yemi, back to home"><AsciiPortrait src="/avatar.webp" alt="Opeyemi Adegboye" /></a>
    <div className="shared-desktop-links"><ProfileLinks onOpenAiChat={onOpenAiChat} /></div>
    <div className="mobile-header-actions">
      <a className="mobile-contact-button" href="mailto:adegboyeopeyemi065@gmail.com" target="_blank" rel="noopener noreferrer">Contact Me</a>
      <button ref={toggle} className="mobile-menu-toggle" type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <CloseCircle size={24} color="currentColor" variant="Linear" aria-hidden="true" /> : <HamburgerMenu size={24} color="currentColor" variant="Linear" aria-hidden="true" />}</button>
    </div>
    {menuOpen && <nav ref={menu} className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" onKeyDown={trapFocus}>
      <button type="button" className="nav-yemi-llm-btn" onClick={() => { setMenuOpen(false); onOpenAiChat(); }} aria-label="Open yemiLLM"><AiAsteriskIcon size={14} /><span>yemiLLM</span></button>
      <a href="/about" onClick={() => setMenuOpen(false)}><span>About</span></a>
      <a href="/guestbook" onClick={() => setMenuOpen(false)}>Guestbook</a>
      <ResponsiveResumeLink onMobileClick={() => setMenuOpen(false)} />
    </nav>}
  </header>;
}
