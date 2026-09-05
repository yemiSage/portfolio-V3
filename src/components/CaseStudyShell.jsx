import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft2, CloseCircle, HamburgerMenu } from "iconsax-reactjs";
import AiAsteriskIcon from "./AiAsteriskIcon";

const resumeUrl = "https://drive.google.com/file/d/1EQeSjevkPsXHZVUMtA8nd28qx604djE_/view?usp=sharing";

export function BulletList({ children }) {
  return <ul className="case-study-list">{children}</ul>;
}

export function CaseStudySection({ id, eyebrow, title, children, className = "" }) {
  return (
    <section className={`case-study-section ${className}`.trim()} id={id}>
      <div className="case-study-section-heading"><p>{eyebrow}</p></div>
      <h2>{title}</h2>
      <div className="case-study-section-body">{children}</div>
    </section>
  );
}

export function CaseStudyFooter({ onOpenAiChat }) {
  const triggerAiChat = onOpenAiChat || (() => window.dispatchEvent(new CustomEvent("open-yemi-llm")));

  return (
    <footer className="case-study-footer">
      <p className="footer-statement">Define purpose, <em>solve problems,</em> set scope and <em>achieve goals</em> - let&apos;s make magic together</p>
      <nav className="footer-nav" aria-label="Case study footer navigation">
        <h2>Explore</h2>
        <div className="footer-links">
          <div>
            <a href="/#top">Articles</a>
            <a href="/#work">Projects</a>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">Resume</a>
          </div>
          <div>
            <a href="https://www.instagram.com/ope_yemi066/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/in/opeyemiadegboyeazeez/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:adegboyeopeyemi065@gmail.com" target="_blank" rel="noopener noreferrer">Email</a>
            <a href="https://wa.me/2349122546487" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </nav>
    </footer>
  );
}

function SectionNavigation({ sections, activeSection, jumpMenuOpen, onJumpMenuToggle, onSectionSelect }) {
  const navigationRef = useRef(null);
  const [highlight, setHighlight] = useState({ top: 0, height: 0, visible: false });
  const moveHighlight = useCallback((sectionId) => {
    const navigation = navigationRef.current;
    const target = navigation?.querySelector(`[data-section-id="${sectionId}"]`);
    if (!navigation || !target) return;
    setHighlight({ top: target.offsetTop, height: target.offsetHeight, visible: true });
  }, []);

  useEffect(() => {
    moveHighlight(activeSection);
    const handleResize = () => moveHighlight(activeSection);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeSection, moveHighlight]);

  return (
    <nav className="case-study-index" aria-label="Sections on this page" ref={navigationRef} onPointerLeave={() => moveHighlight(activeSection)}>
      <div className="case-study-index-top">
        <a className="case-study-index-back" href="/#work"><ArrowLeft2 size={18} color="currentColor" variant="Linear" aria-hidden="true" /><span>Back to projects</span></a>
        <button className="case-study-jump" type="button" aria-expanded={jumpMenuOpen} aria-controls="case-study-jump-menu" onClick={onJumpMenuToggle}><span className="case-study-jump-icon" aria-hidden="true">↵</span><span>Jump to</span></button>
      </div>
      <span aria-hidden="true" className="case-study-nav-highlight" style={{ top: `${highlight.top}px`, height: `${highlight.height}px`, opacity: highlight.visible ? 1 : 0 }} />
      {sections.map(([id, label]) => <a key={id} className={`case-study-index-link${activeSection === id ? " is-active" : ""}`} data-section-id={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onPointerEnter={(event) => event.pointerType !== "touch" && moveHighlight(id)} onClick={(event) => onSectionSelect(event, id)}><span>{label}</span></a>)}
      {jumpMenuOpen && <div className="case-study-jump-menu" id="case-study-jump-menu">{sections.map(([id, label]) => <a key={id} className={activeSection === id ? "is-active" : ""} href={`#${id}`} onClick={(event) => onSectionSelect(event, id, true)}>{label}</a>)}</div>}
    </nav>
  );
}

export default function CaseStudyShell({ sections, projectName, date, children, className = "", onOpenAiChat }) {
  const [activeSection, setActiveSection] = useState(sections[0][0]);
  const [jumpMenuOpen, setJumpMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const triggerAiChat = onOpenAiChat || (() => window.dispatchEvent(new CustomEvent("open-yemi-llm")));

  useEffect(() => {
    const pageSections = sections.map(([id]) => document.getElementById(id)).filter(Boolean);
    let animationFrame;

    const syncActiveSection = () => {
      const readingLine = window.innerHeight * 0.28;
      const isAtPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let currentSection = pageSections[0];

      if (isAtPageEnd) {
        currentSection = pageSections.at(-1);
      } else {
        pageSections.forEach((section) => {
          if (section.getBoundingClientRect().top <= readingLine) currentSection = section;
        });
      }

      if (currentSection) setActiveSection(currentSection.id);
    };

    const handleScroll = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(syncActiveSection);
    };

    const requestedSectionId = decodeURIComponent(window.location.hash.slice(1));
    const requestedSection = pageSections.find((section) => section.id === requestedSectionId);
    if (requestedSection) {
      requestedSection.scrollIntoView({ block: "start" });
      setActiveSection(requestedSection.id);
    } else {
      window.scrollTo(0, 0);
      syncActiveSection();
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sections]);

  const handleSectionSelect = (event, id, closeJumpMenu = false) => {
    event.preventDefault();
    if (closeJumpMenu) setJumpMenuOpen(false);
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <main className={`case-study-page ${className}`.trim()}>
      <aside className={`case-study-rail${mobileMenuOpen ? " is-menu-open" : ""}`} aria-label={`${projectName} case study navigation`}>
        <div className="case-study-rail-top">
          <nav className="case-study-profile-links" aria-label="Profile links">
            <button
              type="button"
              className="nav-yemi-llm-btn case-study-yemi-llm-btn"
              onClick={triggerAiChat}
              aria-label="Open Yemi LLM"
            >
              <AiAsteriskIcon size={14} />
              <span>Yemi LLM</span>
            </button>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">Resume</a>
          </nav>
          <button className="case-study-menu-toggle" type="button" aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileMenuOpen} aria-controls="case-study-mobile-menu" onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}>{mobileMenuOpen ? <CloseCircle size={26} color="currentColor" variant="Linear" aria-hidden="true" /> : <HamburgerMenu size={26} color="currentColor" variant="Linear" aria-hidden="true" />}</button>
        </div>
        {mobileMenuOpen && (
          <nav className="case-study-mobile-menu" id="case-study-mobile-menu" aria-label="Mobile navigation">
            <button
              type="button"
              className="nav-yemi-llm-btn case-study-mobile-yemi-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                triggerAiChat();
              }}
              aria-label="Open Yemi LLM"
            >
              <AiAsteriskIcon size={20} />
              <span>Yemi LLM</span>
            </button>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">Resume</a>
          </nav>
        )}
        <SectionNavigation sections={sections} activeSection={activeSection} jumpMenuOpen={jumpMenuOpen} onJumpMenuToggle={() => setJumpMenuOpen((isOpen) => !isOpen)} onSectionSelect={handleSectionSelect} />
        <div className="case-study-rail-meta"><p>Product design case study</p><span>{date}</span></div>
      </aside>
      <article className="case-study-content">{children}<CaseStudyFooter onOpenAiChat={triggerAiChat} /></article>
    </main>
  );
}
