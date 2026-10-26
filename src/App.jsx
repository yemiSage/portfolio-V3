import { useCallback, useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  ArrowLeft2,
  ArrowRight2,
  Briefcase,
  Calendar,
  CloseCircle,
} from "iconsax-reactjs";

import ResumeContent, { ResponsiveResumeLink, openResumeInApp } from "./components/ResumePage";
import { applyRouteMetadata } from "./utils/seo";
import ScrambleText from "./components/ScrambleText";
import AskYemiChat from "./components/AskYemiChat";
import GithubStats from "./components/GithubStats";

const LimestoneCaseStudy = lazy(() => import("./components/LimestoneCaseStudy"));
const TasaAfricaCaseStudy = lazy(() => import("./components/TasaAfricaCaseStudy"));
const StayafrikaCaseStudy = lazy(() => import("./components/StayafrikaCaseStudy"));
const AboutPage = lazy(() => import("./components/AboutPage"));
const GuestbookPage = lazy(() => import("./components/GuestbookPage"));
const SeoDiagnosticOverlay = lazy(() => import("./components/SeoDiagnosticOverlay"));
import tasafricaImage from "../assets/figma/tasafrica.webp";
import limestoneImage from "../assets/figma/limestone.webp";
import figmaLogo from "../assets/figma/figma.svg";
import nextjsLogo from "../assets/figma/nextjs.svg";
import typescriptLogo from "../assets/figma/typescript.svg";
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
import HoverCursor from "./components/HoverCursor";
import { canHover } from "./utils/hover";
import ProjectFolder from "./components/ProjectFolder";
import AsciiPortrait from "./components/AsciiPortrait";
import SiteHeader, { ProfileLinks } from "./components/SiteHeader";


const portraitImage = "/avatar.webp";

const projects = [
  {
    name: "Stayafrika",
    company: "Stayafrika",
    logo: "/brands/stayafrika.svg",
    role: "Contract UI/UX Designer",
    year: "2026",
    image: "/shots/shot-36.webp",
    imageTreatment: "stayafrika",
    href: "/projects/stayafrika",
    tags: ["Travel", "Hospitality", "Marketplace"],
    description:
      "Designed Stayafrika from flows to launch, connecting property managers, landlords, event hosts, and everyday services all in one app.",
  },
  {
    name: "TASAfrica",
    company: "TASAfrica Sports",
    logo: "tasafrica",
    role: "UI/UX Designer (Solo)",
    year: "2024",
    image: tasafricaImage,
    href: "/projects/tasafrica",
    tags: ["AI", "Sport", "Social", "Analytics"],
    description:
      "Led design of 690+ screens across 8 features for a platform used by over 3 clubs.",
  },
  {
    name: "Limestone App",
    company: "Limestone Technologies",
    logo: "/brands/limestone.png",
    role: "Junior UI/UX Designer",
    year: "2024",
    image: limestoneImage,
    href: "/projects/limestone",
    tags: ["Community", "Security", "Real Estate", "B2B"],
    description:
      "Shipped offline check-ins so tenants could check in without internet access.",
  },
];

// Projects tab: shown like the case studies, with a folder of phone screenshots
// (3:4, in public/folders) and the tech stack in place of the cover image.
const projectFolders = [
  {
    name: "Toraflare",
    href: "https://toraflare.com",
    tags: ["Fashion", "E-commerce", "Payments"],
    description:
      "Designed and built an online fashion store for made-to-order pieces, with checkout, order emails and an admin for the team.",
    images: ["/folders/toraflare-1.webp", "/folders/toraflare-2.webp", "/folders/toraflare-3.webp"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Drizzle", "Cloudflare"],
  },
  {
    name: "ProductHub Africa",
    href: "https://pha-pi.vercel.app",
    tags: ["EdTech", "Community", "Web App"],
    description:
      "Designed and built the web app for a tech education community, from bootcamp sign-ups to course pages and facilitators.",
    images: ["/folders/producthub-1.webp", "/folders/producthub-2.webp", "/folders/producthub-3.webp"],
    stack: ["Next.js", "TypeScript", "Google Gemini", "Vercel"],
  },
  {
    name: "Kilanra",
    href: "https://kilanra.vercel.app",
    tags: ["Marketplace", "Delivery", "Logistics"],
    description:
      "Designed and built a local commerce platform where customers order from nearby stores, vendors run their shops, and riders deliver.",
    images: ["/folders/kilanra-1.webp", "/folders/kilanra-2.webp", "/folders/kilanra-3.webp"],
    stack: ["Astro", "Next.js", "TypeScript", "Turborepo", "Vercel"],
  },
];

const workTabs = [
  { id: "case-studies", label: "Case studies" },
  { id: "projects", label: "Projects" },
  { id: "shots", label: "Shots" },
];

const tools = [
  ["Figma", figmaLogo],
  ["Google AI Studio", googleAiLogo],
  ["Antigravity", antigravityLogo],
  ["Codex", codexLogo],
  ["Claude", claudeLogo],
  ["Next.js", nextjsLogo],
  ["TypeScript", typescriptLogo],
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
      { name: "Xeruit Talent", status: "xeruit.com", href: "https://xeruit.com", logoDomain: "xeruit.com", description: "Shipped an AI hiring OS with verified talent and scalable recruiter discovery." },
      { name: "Soludesks", status: "www.soludesks.com", href: "https://www.soludesks.com", logoDomain: "soludesks.com", description: "A B2B SaaS platform for managing team learning, support, attendance, and business operations." },
      { name: "Feexeet", status: "feexeet.com", href: "https://feexeet.com/", logoDomain: "feexeet.com", description: "A service marketplace connecting homeowners and businesses with verified service professionals." },
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
  const showColor = (event) => {
    if (canHover() && event.pointerType !== "touch") event.currentTarget.classList.add("is-active");
  };
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
        <h2 id="contributed-projects-heading">Other projects I contributed to</h2>
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
                  data-cursor={project.href ? "View project" : "In development"}
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

// Project thumbnail: a muted, looping video when the project has one (played only while
// on screen, fading in over the still image), otherwise the image.
function ProjectVisual({ project }) {
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [reduceMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const showVideo = Boolean(project.video) && !reduceMotion;

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
  }, [showVideo]);

  const alt = `${project.name} product interface`;
  if (project.imageTreatment === "stayafrika") {
    return (
      <div className="project-visual project-visual-stayafrika">
        <div className="stayafrika-preview-window">
          <img src={project.image} alt={alt} />
        </div>
      </div>
    );
  }
  if (!showVideo) return <img className="project-visual" src={project.image} alt={alt} />;

  return (
    <div className="project-visual project-visual-video">
      <img src={project.image} alt={alt} />
      <video
        ref={videoRef}
        className={isVideoReady ? "is-ready" : ""}
        src={project.video}
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setIsVideoReady(true)}
        aria-hidden="true"
      />
    </div>
  );
}

function Project({ project, visual, cursorLabel = "View case study" }) {
  const resetTilt = (event) => {
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
  };

  const handlePointerMove = (event) => {
    if (!canHover() || event.pointerType === "touch") {
      resetTilt(event);
      return;
    }
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    card.style.setProperty("--tilt-y", `${(x * 1.6).toFixed(2)}deg`);
    card.style.setProperty("--tilt-x", `${(-y * 1.1).toFixed(2)}deg`);
  };

  const isFolderProject = Boolean(visual);
  const Card = project.href && !isFolderProject ? "a" : "article";

  return (
    <Card
      className={`project-card${isFolderProject ? " project-card--folder" : ""}`}
      {...(!isFolderProject ? {
        "data-cursor": cursorLabel,
        href: project.href,
        ...(project.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {}),
        "aria-label": project.href ? (project.href.startsWith("http") ? `Open ${project.name} website` : `View ${project.name} case study`) : undefined,
      } : {})}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="project-copy">
        <div>
          <h3>{isFolderProject ? (
            <a href={project.href} target="_blank" rel="noopener noreferrer">{project.name}</a>
          ) : project.name}</h3>
          <div className="project-tags" aria-label="Project categories">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <p>{project.description}</p>
      </div>
      {visual || <ProjectVisual project={project} />}
    </Card>
  );
}

// Case studies: cover on a soft panel, then client, title, role and year, and a full-width link.
function CaseStudyCard({ project }) {
  return (
    <a className="case-card" href={project.href} aria-label={`Read the ${project.name} case study`}>
      <div className="case-card-media">
        <ProjectVisual project={project} />
      </div>
      <div className="case-card-body">
        <h3>{project.description}</h3>
        <p className="case-card-client">{project.name}</p>
        <ul className="case-card-meta" aria-label="Role and year">
          <li>
            <Briefcase size={18} color="currentColor" variant="Linear" aria-hidden="true" />
            {project.role}
          </li>
          <li>
            <Calendar size={18} color="currentColor" variant="Linear" aria-hidden="true" />
            {project.year}
          </li>
        </ul>
        <span className="case-card-cta">
          Read Case Study
          <ArrowUpRight size={18} aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/+$/, ""));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  const isLimestoneCaseStudy = path === "/projects/limestone";
  const isTasaAfricaCaseStudy = path === "/projects/tasafrica";
  const isStayafrikaCaseStudy = path === "/projects/stayafrika";
  const isResumePage = path === "/resume";
  const isPersonalPage = path === "/about" || path === "/guestbook";
  const [activePanel, setActivePanel] = useState(isResumePage ? "resume" : "home");

  useEffect(() => {
    applyRouteMetadata(path || "/");
    const frame = requestAnimationFrame(() => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id) document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [path]);

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
      setPath(new URL(normalizedTarget, window.location.origin).pathname.replace(/\/+$/, "") || "/");
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

  const [activeWork, setActiveWork] = useState("case-studies");
  const [tabsStuck, setTabsStuck] = useState(false);
  const tabsSentinelRef = useRef(null);
  useEffect(() => {
    const node = tabsSentinelRef.current;
    if (!node) return undefined;
    const topOffset = window.matchMedia("(max-width: 767px)").matches ? 68 : parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--page-padding")) || 32;
    const observer = new IntersectionObserver(
      ([entry]) => setTabsStuck(!entry.isIntersecting && entry.boundingClientRect.top < topOffset),
      { rootMargin: `-${topOffset}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  });
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPageScrolling, setIsPageScrolling] = useState(false);
  const [isInitialReady, setIsInitialReady] = useState(false);

  useEffect(() => {
    const markReady = () => {
      setTimeout(() => setIsInitialReady(true), 200);
    };

    if (document.readyState === "complete") {
      markReady();
    } else {
      window.addEventListener("load", markReady, { once: true });
      return () => window.removeEventListener("load", markReady);
    }
  }, []);

  const isSiteLoading = !isInitialReady || isTransitioning;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const lightboxPointerStart = useRef(null);

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

  // Visiting /resume directly shows the home page with the resume in the in-app browser.
  useEffect(() => {
    if (window.location.pathname.replace(/\/+$/, "") !== "/resume") return;
    window.history.replaceState({}, "", "/");
    setPath("/");
    setActivePanel("home");
    window.setTimeout(openResumeInApp, 150);
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
      // Case-study sections handle their own scrolling and active navigation.
      if (href.startsWith("#")) return;

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
        if (cleanHref === "/resume") {
          event.preventDefault();
          openResumeInApp();
        } else if (
          cleanHref === "/projects/tasafrica" ||
          cleanHref === "/projects/limestone" ||
          cleanHref === "/projects/stayafrika" ||
          cleanHref === "/about" ||
          cleanHref === "/guestbook" ||
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

  // The global link handler opens the resume in the in-app browser; just stop the navigation here.
  const showResume = (event) => {
    event.preventDefault();
  };

  const showHome = (event) => {
    event?.preventDefault();
    navigateTo("/");
    window.requestAnimationFrame(() => document.getElementById("about")?.scrollIntoView({ behavior: "auto" }));
  };

  const homeAnchorHref = (anchor) => (activePanel === "resume" ? `/${anchor}` : anchor);

  const handleChatNavigate = (url) => {
    if (url.split("#")[0] === "/resume") {
      openResumeInApp();
      return;
    }
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

  if (isPersonalPage) {
    return <Suspense fallback={null}>
      {topProgressBar}
      {path === "/about" ? <AboutPage onOpenAiChat={() => setIsChatOpen(true)} /> : <GuestbookPage onOpenAiChat={() => setIsChatOpen(true)} />}
      <AskYemiChat isOpen={isChatOpen} onOpen={() => setIsChatOpen(true)} onClose={() => setIsChatOpen(false)} onNavigate={handleChatNavigate} mobileMenuOpen={false} isSiteLoading={isTransitioning} />
    </Suspense>;
  }

  if (isLimestoneCaseStudy || isStayafrikaCaseStudy) {
    return (
      <Suspense fallback={null}>
        {topProgressBar}
        {isStayafrikaCaseStudy
          ? <StayafrikaCaseStudy onOpenAiChat={() => setIsChatOpen(true)} />
          : <LimestoneCaseStudy onOpenAiChat={() => setIsChatOpen(true)} />}
        <AskYemiChat
          isOpen={isChatOpen}
          onOpen={() => setIsChatOpen(true)}
          onClose={() => setIsChatOpen(false)}
          onNavigate={handleChatNavigate}
          mobileMenuOpen={mobileMenuOpen}
          isSiteLoading={isSiteLoading}
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
          mobileMenuOpen={mobileMenuOpen}
          isSiteLoading={isSiteLoading}
        />
      </Suspense>
    );
  }

  return (
    <>
      {topProgressBar}
      <HoverCursor />

      <main
        className={`portfolio${isPageScrolling ? " is-scrolling" : ""}`}
        id="top"
        data-node-id="3549:1194"
      >
      <SiteHeader onOpenAiChat={() => setIsChatOpen(true)} menuOpen={mobileMenuOpen} onMenuChange={setMobileMenuOpen} />

      <div className="portfolio-grid">
        <aside className="identity-column" aria-label="Introduction">
          <div className="identity-main">
            <div className="identity-content-top">
              <div className="identity-top">
                <a className="portrait portrait-ascii" href={homeAnchorHref("#top")} aria-label="Back to the top">
                  <AsciiPortrait src={portraitImage} alt="Opeyemi Adegboye" />
                </a>
                <ProfileLinks onOpenAiChat={() => setIsChatOpen(true)} />
              </div>

              <div className="intro-stack" id="about">
                <div className="intro-copy">
                  <div className="intro-heading">
                    <p className="greeting">Need a Professional</p>
                    <h1>
                      <ScrambleText text={"Design Engineer,\nProduct & AI"} active={!isSiteLoading} />
                    </h1>
                  </div>
                  <div className="intro-description">
                    <p>Hi, I am Yemi. It's been four (4) years now designing and building B2B SaaS, enterprise, marketplace, and AI products, turning complex workflows into simple experiences.</p>
                    <p>The curiosity of knowing How it was done, why it was done, and what it's done in a certain, led me to design. <strong>Coffee, semo and results keep me going</strong></p>
                  </div>
                </div>

                <div className="button-row intro-followup">
                  <a className="button button-primary" href="mailto:adegboyeopeyemi065@gmail.com" target="_blank" rel="noopener noreferrer">
                    Contact Me
                  </a>
                </div>
              </div>
            </div>

            {/* GitHub Activity positioned at the far bottom of the fixed section */}
            <GithubStats />
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
                <div ref={tabsSentinelRef} className="work-tabs-sentinel" aria-hidden="true" />
                <div className={`work-tabs-bar${tabsStuck ? " is-stuck" : ""}`}>
                  <div className="work-toggle" role="tablist" aria-label="Portfolio work type">
                    {workTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={activeWork === tab.id}
                        className={activeWork === tab.id ? "is-selected" : ""}
                        onClick={() => {
                          setActiveWork(tab.id);
                          closeLightbox();
                          requestAnimationFrame(() => {
                            const sentinel = tabsSentinelRef.current;
                            if (!sentinel) return;
                            const mobile = window.matchMedia("(max-width: 767px)").matches;
                            const headerHeight = mobile ? document.querySelector(".mobile-header")?.offsetHeight ?? 0 : 0;
                            // Place the tabs directly below the mobile header, with the first item visible beneath them.
                            const top = sentinel.getBoundingClientRect().top + window.scrollY - headerHeight + 1;
                            window.scrollTo({ top: Math.max(top, 0), left: 0, behavior: "auto" });
                          });
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <button type="button" className="desktop-chat-launcher yemmy-notion-bubble" aria-label="Ask yemiLLM" onClick={() => setIsChatOpen(true)}><span className="yemmy-notion-badge"><span className="yemmy-notion-sparkle" aria-hidden="true" style={{ display: "inline-block", padding: "2px" }}>✦</span><span className="yemmy-notion-tag">Ask yemiLLM</span></span></button>
                </div>

                <section className="projects" id="work" aria-label="Selected projects">
                  {activeWork === "case-studies" ? (
                    <div className="case-card-list">
                      {projects.map((project) => <CaseStudyCard key={project.name} project={project} />)}
                    </div>
                  ) : activeWork === "projects" ? (
                    <div className="project-card-list">
                    {projectFolders.map((project) => (
                      <Project key={project.name} project={project} cursorLabel="View project" visual={<ProjectFolder project={project} />} />
                    ))}
                    </div>
                  ) : (
                    <div className="shots-grid" role="tabpanel" aria-label="Design shots">
                      {shots.map((image, index) => (
                        <button
                          className="shot-card"
                          data-cursor="View image"
                          key={image}
                          type="button"
                          aria-label={`Open portfolio design shot ${index + 1}`}
                          onClick={() => setLightboxIndex(index)}
                        >
                          <img
                            src={`/thumbnails/shot-${String(index + 1).padStart(2, "0")}.webp`}
                            srcSet={`/thumbnails/shot-${String(index + 1).padStart(2, "0")}.webp 720w, ${image} 1878w`}
                            sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 45vw, 25vw"
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

                {activeWork !== "shots" && <ContributedProjects />}

                <section className="toolbox" aria-labelledby="toolbox-heading">
                  <div className="section-intro">
                    <h2 id="toolbox-heading">My Tool Box</h2>
                    <p>
                      The tools I use every day to design, prototype and ship production code, refined over four
                      years of product work.
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
                    Define purpose, <em>solve problems,</em> set scope and <em>ship it</em> - let&apos;s
                    build something together
                  </p>
                  <nav className="footer-nav" aria-label="Footer navigation">
                    <h2>Explore</h2>
                    <div className="footer-links">
                      <div>
                        <a href={homeAnchorHref("#work")}>Projects</a>
                        <a href="/about">About</a>
                        <a href="/guestbook">Guestbook</a>
                        <ResponsiveResumeLink onDesktopClick={showResume} isActive={activePanel === "resume"} />
                      </div>
                      <div>
                        <a href="https://github.com/yemiSage" target="_blank" rel="noopener noreferrer">GitHub</a>
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
        isSiteLoading={isSiteLoading}
      />

      <Suspense fallback={null}>
        <SeoDiagnosticOverlay />
      </Suspense>

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
