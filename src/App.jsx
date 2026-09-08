import { useCallback, useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft2,
  ArrowRight2,
  CloseCircle,
  HamburgerMenu,
} from "iconsax-reactjs";

import FullScreenPreloader from "./components/FullScreenPreloader";
import PortfolioShowreel from "./components/PortfolioShowreel";
import ResumeContent, { ResponsiveResumeLink } from "./components/ResumePage";
import StreamingText from "./components/StreamingText";
import AskYemiChat from "./components/AskYemiChat";

const LimestoneCaseStudy = lazy(() => import("./components/LimestoneCaseStudy"));
const TasaAfricaCaseStudy = lazy(() => import("./components/TasaAfricaCaseStudy"));
const SeoDiagnosticOverlay = lazy(() => import("./components/SeoDiagnosticOverlay"));
import tasafricaImage from "../assets/figma/tasafrica.png";
import limestoneImage from "../assets/figma/limestone.png";
import xeruitImage from "../assets/figma/xeruit.png";
import figmaLogo from "../assets/figma/figma.svg";
import htmlCssLogo from "../assets/figma/html-css.svg";
import wordpressLogo from "../assets/figma/wordpress.svg";
import miroLogo from "../assets/figma/miro.svg";
import illustratorLogo from "../assets/figma/adobe-illustrator.svg";
import msSuiteLogo from "../assets/figma/ms-suite.svg";
import photoshopLogo from "../assets/figma/photoshop.svg";
import notionLogo from "../assets/figma/notion.svg";
import trelloLogo from "../assets/figma/trello.svg";
import googleAiLogo from "../assets/figma/google-ai.svg";
import antigravityLogo from "../assets/figma/antigravity.png";
import codexLogo from "../assets/figma/codex.svg";
import vsCodeLogo from "../assets/figma/vs-code.svg";
import claudeLogo from "../assets/figma/claude.svg";
import newBadgeLoop from "../assets/figma/new-badge-loop.svg";
import newBadgeStroke from "../assets/figma/new-badge-stroke.svg";
import AiAsteriskIcon from "./components/AiAsteriskIcon";

const portraitImage = "/portfolio-logo.svg";

const introSegments = [
  {
    text: "Hi, I am Yemi, a product designer for business and enterprise products.",
  },
  {
    text: "I design clear, intentional experiences for complex products, from B2B, B2C and SaaS platforms to marketplaces, AI-integrated systems, and operational products, balancing user needs with business goals.",
  },
];

const projects = [
  {
    name: "TASAfrica",
    image: tasafricaImage,
    href: "/projects/tasafrica",
    tags: ["AI", "Sport", "Social", "Analytics"],
    description:
      "Built a scalable design system and discovery flows that connect African talent with global scouts.",
  },
  {
    name: "Limestone App",
    image: limestoneImage,
    href: "/projects/limestone",
    tags: ["Community", "Security", "Real Estate", "B2B"],
    description:
      "Simplified community living with offline check-ins, panic alerts, and clearer security workflows.",
  },
  {
    name: "Xeruit Talent",
    image: xeruitImage,
    tags: ["AI", "Hiring", "SAAS", "B2B"],
    description:
      "Shipped an AI hiring OS with verified talent and scalable recruiter discovery.",
  },
];

const tools = [
  ["Figma", figmaLogo],
  ["Google AI Studio", googleAiLogo],
  ["Antigravity", antigravityLogo],
  ["Codex", codexLogo],
  ["Claude", claudeLogo],
  ["HTML and CSS", htmlCssLogo],
  ["Wordpress", wordpressLogo],
  ["Miro", miroLogo],
  ["Adobe Illustrator", illustratorLogo],
  ["MS Suite", msSuiteLogo],
  ["Photoshop", photoshopLogo],
  ["Notion", notionLogo],
  ["Trello", trelloLogo],
  ["VS Code", vsCodeLogo],
];

const contributedProjects = [
  {
    year: "2026",
    projects: [
      { name: "Norocio", status: "In development", isNew: true, logoDomain: "norocio.com", description: "A cross-border payments platform for global transfers, multi-currency accounts, and stablecoin." },
      { name: "Stayafrika", status: "www.stayafrika.com", href: "https://www.stayafrika.com", logoDomain: "stayafrika.com", description: "A travel marketplace for discovering stays, local experiences, and essential travel services across Africa." },
      { name: "Soludesks", status: "www.soludesks.com", href: "https://www.soludesks.com", logoDomain: "soludesks.com", description: "A B2B SaaS platform for managing team learning, support, attendance, and business operations." },
      { name: "Feexeet", status: "www.feexeet.com", href: "https://www.feexeet.com", logoDomain: "feexeet.com", description: "A service marketplace connecting homeowners and businesses with verified service professionals." },
    ],
  },
  {
    year: "2025",
    projects: [
      { name: "Flxfleet", status: "www.flxfleet.ca", href: "https://www.flxfleet.ca", logoDomain: "flxfleet.ca", description: "Canadian logistics platform for moving, delivery, driver booking, and real-time tracking." },
      { name: "AfternoonPrep", status: "www.afternoonprep.com", href: "https://www.afternoonprep.com", logoDomain: "afternoonprep.com", description: "A UK-based education platform for exam preparation, learning, and student practice." },
    ],
  },
];

const contributedProjectDescription =
  "A selection of products I’ve helped shape over the years, across different industries, teams, and business needs.";

const shots = Array.from(
  { length: 36 },
  (_, index) => `/shots/shot-${String(index + 1).padStart(2, "0")}.webp`,
);

function Tool({ name, logo }) {
  const showColor = (event) => event.currentTarget.classList.add("is-active");
  const hideColor = (event) => event.currentTarget.classList.remove("is-active");

  return (
    <li data-tool={name} onPointerMove={showColor} onPointerLeave={hideColor}>
      <img src={logo} alt="" />
      <span>{name}</span>
    </li>
  );
}

function ContributedProjects() {
  return (
    <section className="contributed-projects" aria-labelledby="contributed-projects-heading">
      <div className="section-intro">
        <h2 id="contributed-projects-heading">Other project I contributed to</h2>
        <p>{contributedProjectDescription}</p>
      </div>

      <div className="contribution-groups">
        {contributedProjects.map((group) => (
          <div className="contribution-group" key={group.year}>
            <p className="contribution-year">{group.year}</p>
            <div className="contribution-list">
              {group.projects.map((project) => {
                const ContributionTag = project.href ? "a" : "article";
                return (
                <ContributionTag
                  className="contribution-item"
                  key={project.name}
                  {...(project.href ? { href: project.href, target: "_blank", rel: "noopener noreferrer", "aria-label": `Open ${project.name} in a new tab` } : {})}
                >
                  <div className="contribution-thumbnail" aria-hidden="true">
                    <span>{project.name.slice(0, 2)}</span>
                    <img
                      src={project.logo || `https://www.google.com/s2/favicons?domain=${project.logoDomain}&sz=128`}
                      alt=""
                      loading="lazy"
                      onError={(event) => { event.currentTarget.style.display = "none"; }}
                    />
                  </div>
                  <div className="contribution-item-heading">
                    <div className="contribution-name-wrap">
                      <h3>{project.name}</h3>
                      {project.isNew && (
                        <span className="new-badge" aria-label="New">
                          <span>New</span>
                          <img src={newBadgeLoop} alt="" />
                          <img src={newBadgeStroke} alt="" />
                        </span>
                      )}
                    </div>
                    <span>{project.status}</span>
                  </div>
                  <p>{project.description ?? contributedProjectDescription}</p>
                </ContributionTag>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Project({ project }) {
  const handlePointerMove = (event) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    card.style.setProperty("--tilt-y", `${(x * 12).toFixed(2)}deg`);
    card.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
  };

  const resetTilt = (event) => {
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
  };

  const Card = project.href ? "a" : "article";

  return (
    <Card
      className="project-card"
      href={project.href}
      aria-label={project.href ? `View ${project.name} case study` : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="project-copy">
        <div>
          <h3>{project.name}</h3>
          <div className="project-tags" aria-label="Project categories">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <p>{project.description}</p>
      </div>
      <img
        className="project-visual"
        src={project.image}
        alt={`${project.name} product interface`}
      />
    </Card>
  );
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/+$/, ""));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  const isLimestoneCaseStudy = path === "/projects/limestone";
  const isTasaAfricaCaseStudy = path === "/projects/tasafrica";
  const isResumePage = path === "/resume";
  const [activePanel, setActivePanel] = useState(isResumePage ? "resume" : "home");

  const navigateTo = useCallback((targetPath) => {
    const normalizedTarget = targetPath.replace(/\/+$/, "") || "/";
    const currentNormalized = window.location.pathname.replace(/\/+$/, "") || "/";
    
    setIsTransitioning(true);
    setTransitionProgress(15);

    const timer1 = setTimeout(() => setTransitionProgress(45), 80);
    const timer2 = setTimeout(() => setTransitionProgress(75), 180);
    const timer3 = setTimeout(() => setTransitionProgress(90), 320);

    const timerComplete = setTimeout(() => {
      window.history.pushState({}, "", normalizedTarget);
      setPath(normalizedTarget);
      setActivePanel(normalizedTarget === "/resume" ? "resume" : "home");
      setTransitionProgress(100);
      window.scrollTo(0, 0);

      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionProgress(0);
      }, 150);
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerComplete);
    };
  }, [path]);

  const [activeWork, setActiveWork] = useState("projects");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPageScrolling, setIsPageScrolling] = useState(false);
  const [hasIntroStreamed, setHasIntroStreamed] = useState(false);
  const [showPreloader, setShowPreloader] = useState(() => {
    return !isResumePage && sessionStorage.getItem("portfolio-preloader-seen") !== "true";
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const lightboxPointerStart = useRef(null);
  const handleIntroStreamingComplete = useCallback(() => setHasIntroStreamed(true), []);

  // Reading Progress Indicator State & Effect
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clipboard Copier with Custom Visual Toast
  const [toastMessage, setToastMessage] = useState("");

  const handleCopyText = useCallback((text, label = "Content") => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage(`${label} copied to clipboard!`);
      setTimeout(() => setToastMessage(""), 2000);
    }).catch(() => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setToastMessage(`${label} copied to clipboard!`);
      } catch (err) {
        console.error("Failed to copy text", err);
      }
      document.body.removeChild(textArea);
      setTimeout(() => setToastMessage(""), 2000);
    });
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      const copyableElement = e.target.closest("[data-copyable='true'], code, pre, .copyable-item");
      if (copyableElement) {
        if (e.target.tagName === "A" || e.target.tagName === "BUTTON") return;
        const textToCopy = copyableElement.getAttribute("data-copy-value") || copyableElement.innerText || copyableElement.textContent;
        const label = copyableElement.getAttribute("data-copy-label") || "Text";
        handleCopyText(textToCopy, label);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleCopyText]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isTyping = activeEl && (
        activeEl.tagName === "INPUT" || 
        activeEl.tagName === "TEXTAREA" || 
        activeEl.isContentEditable
      );

      if (e.key === "Escape") {
        setIsChatOpen(false);
        setLightboxIndex(null);
      } else if ((e.key === "k" || e.key === "K") && !isTyping) {
        e.preventDefault();
        setIsChatOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeLightbox = () => setLightboxIndex(null);
  const showPreviousShot = () => setLightboxIndex((index) => (index - 1 + shots.length) % shots.length);
  const showNextShot = () => setLightboxIndex((index) => (index + 1) % shots.length);

  useEffect(() => {
    if (lightboxIndex === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPreviousShot();
      if (event.key === "ArrowRight") showNextShot();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    let scrollEndTimer;
    const updateScrollState = () => {
      setIsPageScrolling(true);
      window.clearTimeout(scrollEndTimer);
      scrollEndTimer = window.setTimeout(() => setIsPageScrolling(false), 160);
    };

    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      window.clearTimeout(scrollEndTimer);
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  useEffect(() => {
    const syncPanelWithHistory = () => {
      const newPath = window.location.pathname.replace(/\/+$/, "");
      setPath(newPath);
      setActivePanel(newPath === "/resume" ? "resume" : "home");
    };

    window.addEventListener("popstate", syncPanelWithHistory);
    return () => window.removeEventListener("popstate", syncPanelWithHistory);
  }, []);

  useEffect(() => {
    const handleOpenYemiLlm = () => setIsChatOpen(true);
    window.addEventListener("open-yemi-llm", handleOpenYemiLlm);
    return () => window.removeEventListener("open-yemi-llm", handleOpenYemiLlm);
  }, []);

  useEffect(() => {
    const handleGlobalLinkClick = (event) => {
      const anchor = event.target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      const isExternal =
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("//") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        (anchor.hostname && anchor.hostname !== window.location.hostname);

      if (isExternal) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
      } else {
        const cleanHref = href.split("#")[0];
        if (
          cleanHref === "/projects/tasafrica" ||
          cleanHref === "/projects/limestone" ||
          cleanHref === "/resume" ||
          cleanHref === "/" ||
          cleanHref === ""
        ) {
          event.preventDefault();
          navigateTo(href);
        }
      }
    };

    document.addEventListener("click", handleGlobalLinkClick, { capture: true });
    return () => document.removeEventListener("click", handleGlobalLinkClick, { capture: true });
  }, [navigateTo]);

  const showResume = (event) => {
    event.preventDefault();
    navigateTo("/resume");
  };

  const showHome = (event) => {
    event?.preventDefault();
    navigateTo("/");
    window.requestAnimationFrame(() => document.getElementById("about")?.scrollIntoView({ behavior: "auto" }));
  };

  const homeAnchorHref = (anchor) => (activePanel === "resume" ? `/${anchor}` : anchor);

  const handleChatNavigate = (url) => {
    navigateTo(url);
  };

  const topProgressBar = (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="top-loading-progress-bar"
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#818cf8] via-[#f472b6] to-[#4f46e5] z-[99999] shadow-[0_1px_8px_rgba(129,140,248,0.4)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: transitionProgress / 100 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.15 }}
          style={{ originX: 0 }}
        />
      )}
    </AnimatePresence>
  );

  if (isLimestoneCaseStudy) {
    return (
      <Suspense fallback={null}>
        {topProgressBar}
        <LimestoneCaseStudy onOpenAiChat={() => setIsChatOpen(true)} />
        <AskYemiChat
          isOpen={isChatOpen}
          onOpen={() => setIsChatOpen(true)}
          onClose={() => setIsChatOpen(false)}
          onNavigate={handleChatNavigate}
        />
      </Suspense>
    );
  }

  if (isTasaAfricaCaseStudy) {
    return (
      <Suspense fallback={null}>
        {topProgressBar}
        <TasaAfricaCaseStudy onOpenAiChat={() => setIsChatOpen(true)} />
        <AskYemiChat
          isOpen={isChatOpen}
          onOpen={() => setIsChatOpen(true)}
          onClose={() => setIsChatOpen(false)}
          onNavigate={handleChatNavigate}
        />
      </Suspense>
    );
  }

  return (
    <>
      {topProgressBar}
      <AnimatePresence>
        {showPreloader && (
          <FullScreenPreloader key="portfolio-preloader" onComplete={() => { sessionStorage.setItem("portfolio-preloader-seen", "true"); setShowPreloader(false); }} />
        )}
      </AnimatePresence>

      <main
        className={`portfolio${isPageScrolling ? " is-scrolling" : ""}`}
        id="top"
        data-node-id="3549:1194"
      >
      <header className="mobile-header">
        <a className="portrait mobile-brand" href={homeAnchorHref("#top")} aria-label="Back to the top">
          <img src={portraitImage} alt="Opeyemi Adegboye" />
        </a>
        <div className="mobile-header-actions">
          <a className="mobile-contact-button" href="mailto:adegboyeopeyemi065@gmail.com" target="_blank" rel="noopener noreferrer">Contact Me</a>
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          >
            {mobileMenuOpen ? (
              <CloseCircle size={24} color="currentColor" variant="Linear" aria-hidden="true" />
            ) : (
              <HamburgerMenu size={24} color="currentColor" variant="Linear" aria-hidden="true" />
            )}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
            <button
              type="button"
              className="nav-yemi-llm-btn"
              onClick={() => {
                setIsChatOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              <AiAsteriskIcon size={14} />
              <span>yemiLLM</span>
            </button>
            <ResponsiveResumeLink onMobileClick={() => setMobileMenuOpen(false)} />
          </nav>
        )}
      </header>

      <div className="portfolio-grid">
        <aside className="identity-column" aria-label="Introduction">
          <div className="identity-main">
            <div className="identity-top">
              <a className="portrait" href={homeAnchorHref("#top")} aria-label="Back to the top">
                <img src={portraitImage} alt="Opeyemi Adegboye" />
              </a>
              <nav className="identity-links" aria-label="Profile links">
                <button
                  type="button"
                  id="yemi-llm-nav-btn"
                  className="nav-yemi-llm-btn"
                  onClick={() => setIsChatOpen(true)}
                  aria-label="Open yemiLLM"
                >
                  <AiAsteriskIcon size={14} />
                  <span>yemiLLM</span>
                </button>
                <ResponsiveResumeLink onDesktopClick={showResume} isActive={activePanel === "resume"} />
              </nav>
            </div>

            <div className="intro-stack" id="about">
              <div className="intro-copy">
                <div className="intro-heading">
                  <p className="greeting">Need a Professional</p>
                  <h1 aria-label="Product Designer Who Codes?">
                    <span className="title-line title-line-desktop"><span>Product Designer Who Codes?</span></span>
                    <span className="title-line title-line-mobile"><span>Product Designer Who Codes?</span></span>
                  </h1>
                </div>
                <StreamingText
                  className="intro-description"
                  complete={hasIntroStreamed}
                  onComplete={handleIntroStreamingComplete}
                  segments={introSegments}
                />
              </div>

              <div className={`button-row intro-followup${hasIntroStreamed ? " is-revealed" : ""}`}>
                <a className="button button-primary" href="mailto:adegboyeopeyemi065@gmail.com" target="_blank" rel="noopener noreferrer">
                  Contact Me
                </a>
              </div>
            </div>
          </div>

        </aside>

        <section className={`content-column${activePanel === "resume" ? " content-column-resume" : ""}`} aria-label="Portfolio content">
          <AnimatePresence mode="wait">
            {activePanel === "resume" ? (
              <motion.div
                key="resume"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <ResumeContent onBack={showHome} />
              </motion.div>
            ) : (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <section className="hero-panel" aria-label="Portfolio showreel and work navigation">
                  <div className="hero-media">
                    <PortfolioShowreel />
                  </div>
                  <div className="hero-caption">
                    <div className="work-toggle" role="tablist" aria-label="Portfolio work type">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeWork === "projects"}
                        className={activeWork === "projects" ? "is-selected" : ""}
                        onClick={() => {
                          setActiveWork("projects");
                          closeLightbox();
                        }}
                      >
                        Projects
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeWork === "shots"}
                        className={activeWork === "shots" ? "is-selected" : ""}
                        onClick={() => setActiveWork("shots")}
                      >
                        Shots
                      </button>
                    </div>
                  </div>
                </section>

                <section className="projects" id="work" aria-label="Selected projects">
                  {activeWork === "projects" ? (
                    projects.map((project) => <Project key={project.name} project={project} />)
                  ) : (
                    <div className="shots-grid" role="tabpanel" aria-label="Design shots">
                      {shots.map((image, index) => (
                        <button
                          className="shot-card"
                          key={image}
                          type="button"
                          aria-label={`Open portfolio design shot ${index + 1}`}
                          onClick={() => setLightboxIndex(index)}
                        >
                          <img
                            src={`/thumbnails/shot-${String(index + 1).padStart(2, "0")}.webp`}
                            alt=""
                            width="720"
                            height="556"
                            loading="lazy"
                            decoding="async"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                <ContributedProjects />

                <section className="toolbox" aria-labelledby="toolbox-heading">
                  <div className="section-intro">
                    <h2 id="toolbox-heading">My Tool Box</h2>
                    <p>
                      Over the course of four years now, i have found myself using these tools and making them
                      part of my day to day activities.
                    </p>
                  </div>
                  <ul className="tool-grid">
                    {tools.map(([name, logo]) => (
                      <Tool key={name} name={name} logo={logo} />
                    ))}
                  </ul>
                </section>

                <footer className="footer">
                  <p className="footer-statement">
                    Define purpose, <em>solve problems,</em> set scope and <em>achieve goals</em> - let&apos;s
                    make magic together
                  </p>
                  <nav className="footer-nav" aria-label="Footer navigation">
                    <h2>Explore</h2>
                    <div className="footer-links">
                      <div>
                        <a href={homeAnchorHref("#top")}>Articles</a>
                        <a href={homeAnchorHref("#work")}>Projects</a>
                        <ResponsiveResumeLink onDesktopClick={showResume} isActive={activePanel === "resume"} />
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
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {lightboxIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio design shot"
          onMouseDown={(event) => event.target === event.currentTarget && closeLightbox()}
          onPointerDown={(event) => {
            lightboxPointerStart.current = event.clientX;
          }}
          onPointerUp={(event) => {
            if (lightboxPointerStart.current === null) return;
            const delta = event.clientX - lightboxPointerStart.current;
            lightboxPointerStart.current = null;
            if (Math.abs(delta) < 48) return;
            if (delta < 0) showNextShot();
            else showPreviousShot();
          }}
          onPointerCancel={() => { lightboxPointerStart.current = null; }}
        >
          <button className="lightbox-close" type="button" onClick={closeLightbox} aria-label="Close image viewer">
            <CloseCircle size={30} color="currentColor" variant="Linear" />
          </button>
          <button className="lightbox-nav lightbox-previous" type="button" onClick={showPreviousShot} aria-label="Previous image">
            <ArrowLeft2 size={32} color="currentColor" variant="Linear" />
          </button>
          <img
            className="lightbox-image"
            src={shots[lightboxIndex]}
            alt={`Portfolio design shot ${lightboxIndex + 1}`}
            width="1878"
            height="1450"
            decoding="async"
          />
          <button className="lightbox-nav lightbox-next" type="button" onClick={showNextShot} aria-label="Next image">
            <ArrowRight2 size={32} color="currentColor" variant="Linear" />
          </button>
          <div className="lightbox-progress" aria-label={`Image ${lightboxIndex + 1} of ${shots.length}`}>
            {shots.map((_, index) => (
              <span key={index} className={index === lightboxIndex ? "is-active" : ""} />
            ))}
          </div>
        </div>
      )}
      </main>

      <AskYemiChat
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
        onNavigate={handleChatNavigate}
        mobileMenuOpen={mobileMenuOpen}
      />

      <Suspense fallback={null}>
        <SeoDiagnosticOverlay />
      </Suspense>

      {/* Reading Progress Indicator Bar */}
      {(isLimestoneCaseStudy || isTasaAfricaCaseStudy || activePanel === "resume") && (
        <div 
          id="reading-progress-indicator"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: `${scrollProgress}%`,
            height: "4px",
            backgroundColor: "#4f46e5",
            zIndex: 100000,
            transition: "width 0.08s ease-out"
          }}
        />
      )}

      {/* Minimalist 'Copied!' Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: "84px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#1f2937",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "500",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.15)",
              zIndex: 1000000,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span style={{ color: "#10b981" }}>✓</span> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
