import { useEffect, useState } from "react";
import { CaseStudyFooter, SectionNavigation } from "./CaseStudyShell";
import SiteHeader from "./SiteHeader";
import "../personal-pages.css";

export default function PersonalPageShell({ page, sections, children, onOpenAiChat }) {
  const [activeSection, setActiveSection] = useState(sections[0][0]);
  const [jumpOpen, setJumpOpen] = useState(false);
  useEffect(() => {
    let frame;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = sections[0][0];
        for (const [id] of sections) {
          if (document.getElementById(id)?.getBoundingClientRect().top <= Math.max(130, innerHeight * .25)) current = id;
        }
        setActiveSection(current);
      });
    };
    const hash = decodeURIComponent(location.hash.slice(1));
    if (sections.some(([id]) => id === hash)) document.getElementById(hash)?.scrollIntoView();
    else window.scrollTo(0, 0);
    sync();
    addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync);
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", sync); removeEventListener("resize", sync); };
  }, [sections]);
  const selectSection = (event, id) => {
    event.preventDefault();
    setActiveSection(id);
    setJumpOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  };
  return <div className={`personal-page personal-page--${page}`}>
    <a className="personal-skip" href="#personal-content">Skip to content</a>
    <SiteHeader desktop onOpenAiChat={onOpenAiChat} />
    <div className="personal-layout">
      <main id="personal-content" className="personal-main">{children}<CaseStudyFooter /></main>
      <aside className="personal-rail" aria-label="Page sections">
        <p className="personal-rail-label">ON THIS PAGE</p>
        <SectionNavigation sections={sections} activeSection={activeSection} jumpMenuOpen={jumpOpen} onJumpMenuToggle={() => setJumpOpen(!jumpOpen)} onSectionSelect={selectSection} />
        <p className="personal-rail-signoff">A little curiosity<br />goes a long way.<span aria-hidden="true">↙</span></p>
      </aside>
    </div>
  </div>;
}
