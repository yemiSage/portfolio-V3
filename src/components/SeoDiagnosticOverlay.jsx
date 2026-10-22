import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildDiagnosticReport, DISCOVERY_FILES, fetchDiscoveryDocument, readPageEvidence, schemaNodes, schemaTypes } from "../discoverability/diagnostics.js";
import {
  Sparkles,
  Sliders,
  X,
  Plus,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Bot,
  Share2,
  Code,
  RotateCcw,
  Tag,
  Globe,
  Eye,
  Minimize2,
} from "lucide-react";

// Industry recommended keywords organized by design sub-domains
const RECOMMENDED_KEYWORDS = [
  {
    category: "Roles & Seniority",
    items: [
      "Staff Product Designer",
      "Senior UI/UX Designer",
      "Lead Product Designer",
      "Design Technologist",
      "UX Consultant",
      "Design Mentor",
      "UX Researcher"
    ]
  },
  {
    category: "Design Specializations",
    items: [
      "Design Systems Architecture",
      "AI Interface Design",
      "Micro-Interactions",
      "Enterprise SaaS UX",
      "Design Sprints",
      "Mobile-First UX",
      "Human-Centered Design",
      "Conversion Rate Optimization"
    ]
  },
  {
    category: "Tools & Prototyping",
    items: [
      "Figma Variables & Tokens",
      "Framer Code Components",
      "React Prototyping",
      "Design Tokens",
      "Interactive Prototypes",
      "Design QA & Handoff"
    ]
  },
  {
    category: "Industry Verticals",
    items: [
      "FinTech Design",
      "B2B SaaS Platforms",
      "EdTech & Learning UX",
      "Community & Security UX",
      "Sports Scouting Analytics",
      "Marketplace UX"
    ]
  }
];

export default function SeoDiagnosticOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [alwaysShowInProd, setAlwaysShowInProd] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("seo_tool_always_show") === "true";
    }
    return false;
  });

  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("seo") || params.has("diagnostics")) return true;
      if (localStorage.getItem("seo_tool_always_show") === "true") return true;
      // In dev mode, show by default. In production, keep hidden unless requested via ?seo or hotkey
      return Boolean(import.meta.env.DEV);
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState("benchmarks");
  const [copiedKey, setCopiedKey] = useState(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [notification, setNotification] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    modalRef.current?.focus();
    const handleModalKey = (event) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key !== "Tab") return;
      const elements = Array.from(modalRef.current?.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]') || [])
        .filter((element) => element.getClientRects().length > 0);
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === modalRef.current)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === modalRef.current)) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleModalKey);
    return () => {
      document.removeEventListener("keydown", handleModalKey);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isOpen]);

  // Keyboard shortcut (Cmd+Shift+S or Ctrl+Shift+S) to open or reveal anywhere
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        setIsVisible(true);
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Optional writing notes are browser-local and never affect the score or page metadata.
  const [keywords, setKeywords] = useState([]);
  const [page, setPage] = useState(null);
  const [files, setFiles] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const metaTitle = page?.title || "";
  const metaDescription = page?.description || "";
  const ogData = page?.og || {};
  const jsonLdSummary = page?.schemas || [];
  const entities = schemaNodes(jsonLdSummary);
  const types = schemaTypes(jsonLdSummary);
  const person = entities.find((node) => [node["@type"]].flat().includes("Person"));
  const arrayCount = (value) => value == null ? 0 : [value].flat().length;
  const listedWorkCount = entities.filter((node) => [node["@type"]].flat().includes("ItemList"))
    .reduce((total, node) => total + arrayCount(node.itemListElement), 0);

  useEffect(() => {
    try {
      setKeywords((localStorage.getItem("seo_custom_keywords") || "").split(",").map((word) => word.trim()).filter(Boolean));
    } catch {
      // Storage may be unavailable; diagnostics still work.
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const read = () => {
      const next = readPageEvidence(document);
      setPage((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.head, { childList: true, subtree: true, attributes: true, characterData: true });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    window.addEventListener("popstate", read);
    return () => {
      observer.disconnect();
      window.removeEventListener("popstate", read);
    };
  }, [isVisible, isOpen, refreshKey]);

  useEffect(() => {
    if (!isVisible) return;
    let active = true;
    setFiles({});
    const controllers = DISCOVERY_FILES.map((kind) => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10000);
      fetchDiscoveryDocument(kind, { signal: controller.signal }).then((result) => {
        if (active) setFiles((previous) => ({ ...previous, [kind]: result }));
      }).catch(() => {
        if (active) setFiles((previous) => ({ ...previous, [kind]: { passed: false, detail: "Request timed out; could not verify this document." } }));
      }).finally(() => window.clearTimeout(timeout));
      return { controller, timeout };
    });
    return () => {
      active = false;
      controllers.forEach(({ controller, timeout }) => {
        window.clearTimeout(timeout);
        controller.abort();
      });
    };
  }, [isVisible, isOpen, refreshKey]);

  const saveKeywordNotes = (newKeywordsList) => {
    try {
      localStorage.setItem("seo_custom_keywords", newKeywordsList.join(", "));
      return true;
    } catch {
      showNotification("Browser storage is unavailable; notes are kept for this session only.");
      return false;
    }
  };

  const handleAddKeyword = (val) => {
    const trimmed = (val || keywordInput).trim();
    if (!trimmed) return;

    if (keywords.some((k) => k.toLowerCase() === trimmed.toLowerCase())) {
      showNotification(`"${trimmed}" is already in your keywords list.`);
      setKeywordInput("");
      return;
    }

    const updated = [...keywords, trimmed];
    setKeywords(updated);
    saveKeywordNotes(updated);
    setKeywordInput("");
    showNotification(`Added "${trimmed}" to browser-local notes`);
  };

  const handleRemoveKeyword = (indexToRemove) => {
    const removedName = keywords[indexToRemove];
    const updated = keywords.filter((_, idx) => idx !== indexToRemove);
    setKeywords(updated);
    saveKeywordNotes(updated);
    showNotification(`Removed "${removedName}"`);
  };

  const handleResetKeywords = () => {
    setKeywords([]);
    if (saveKeywordNotes([])) showNotification("Cleared browser-local keyword notes");
  };

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
      showNotification("Copied to clipboard!");
    } catch {
      showNotification("Clipboard unavailable in this browser.");
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  const auditReport = useMemo(() => buildDiagnosticReport(page, files), [page, files]);
  const scoreLabel = auditReport.score === null ? "Checking…" : `${auditReport.score}/100`;
  const scoreStatus = auditReport.score === null ? "Pending" : auditReport.score === 100 ? "Checks passed" : "Needs review";

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Discrete Floating Trigger (Fixed on bottom-left, away from AskYemi on bottom-right) */}
      <div
        id="seo-diagnostic-launcher"
        className="seo-diag-launcher"
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          zIndex: 890
        }}
      >
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              className="seo-diag-toast"
            >
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          {!isMinimized ? (
            <button
              type="button"
              id="seo-diag-open-btn"
              onClick={() => setIsOpen(true)}
              className="seo-diag-pill-btn"
              title="Open page discoverability checks"
              aria-label="Open SEO Diagnostic Overlay"
            >
              <span className="seo-diag-sparkle">
                <Sliders size={13} />
              </span>
              <span className="seo-diag-title">SEO & GEO Inspector</span>
              <span className="seo-diag-score-tag">
                {scoreLabel}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="seo-diag-mini-btn"
              title="Expand SEO Inspector"
              aria-label="Expand SEO Inspector"
            >
              <Sliders size={15} />
            </button>
          )}

          {!isMinimized && (
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="seo-diag-minimize-btn"
              title="Minimize SEO button"
              aria-label="Minimize button"
            >
              <Minimize2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Diagnostic Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="seo-diag-modal-backdrop" onClick={() => setIsOpen(false)}>
            <motion.div
              className="seo-diag-modal-container"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              ref={modalRef}
              tabIndex={-1}
              aria-modal="true"
              aria-labelledby="seo-diag-heading"
            >
              {/* Header */}
              <div className="seo-diag-modal-header">
                <div className="flex items-center gap-2.5">
                  <div className="seo-diag-header-icon">
                    <Sliders size={17} />
                  </div>
                  <div>
                    <h2 className="seo-diag-header-title" id="seo-diag-heading">
                      SEO & Discoverability Diagnostic
                    </h2>
                    <p className="seo-diag-header-subtitle">
                      Current-page checks · not a search-ranking or AI-citation score
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`seo-diag-score-badge${auditReport.score === 100 ? "" : " needs-review"}`} aria-live="polite">
                    <span className="score-num">{scoreLabel}</span>
                    <span className="score-status">{scoreStatus}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="seo-diag-close-btn"
                    aria-label="Close Diagnostic Panel"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="seo-diag-tabs-bar">
                <button
                  type="button"
                  onClick={() => setActiveTab("keywords")}
                  className={`seo-diag-tab ${
                    activeTab === "keywords" ? "is-active" : ""
                  }`}
                >
                  <Tag size={14} />
                  <span>Keyword Notes</span>
                  <span className="tab-pill">{keywords.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("benchmarks")}
                  className={`seo-diag-tab ${
                    activeTab === "benchmarks" ? "is-active" : ""
                  }`}
                >
                  <CheckCircle2 size={14} />
                  <span>Page Checks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`seo-diag-tab ${
                    activeTab === "preview" ? "is-active" : ""
                  }`}
                >
                  <Eye size={14} />
                  <span>Google & Social Snippet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ai")}
                  className={`seo-diag-tab ${
                    activeTab === "ai" ? "is-active" : ""
                  }`}
                >
                  <Bot size={14} />
                  <span>AI & Schema.org</span>
                </button>
              </div>

              {/* Content Body */}
              <div className="seo-diag-modal-body">
                {/* TAB 1: KEYWORDS TUNING (Requested Core Feature) */}
                {activeTab === "keywords" && (
                  <div className="seo-diag-tab-content">
                    {/* Top Explanation & Input */}
                    <div className="seo-diag-section-box">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-semibold text-gray-800 text-[13px] flex items-center gap-1.5">
                          <Sliders size={14} className="text-[#e0733d]" />
                          Content Keyword Notes
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Saved in this browser only. Notes do not affect the score or publish content.
                        </span>
                      </div>

                      {/* Add Keyword Input Field */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddKeyword();
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          aria-label="Keyword note"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          placeholder="Type custom role or specialty (e.g. Design Lead, Micro-Interactions)..."
                          className="seo-diag-input"
                        />
                        <button
                          type="submit"
                          className="seo-diag-add-btn"
                          disabled={!keywordInput.trim()}
                        >
                          <Plus size={14} />
                          <span>Add</span>
                        </button>
                      </form>

                      {/* Keyword quick tools */}
                      <div className="flex items-center justify-between text-[11.5px] mt-3 text-gray-500 pt-2 border-t border-gray-100">
                        <span>
                          <strong>{keywords.length}</strong> keyword notes
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                keywords.join(", "),
                                "meta-tag"
                              )
                            }
                            className="seo-diag-text-action"
                          >
                            {copiedKey === "meta-tag" ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                            <span>Copy Notes</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleResetKeywords}
                            className="seo-diag-text-action text-gray-500 hover:text-red-600"
                          >
                            <RotateCcw size={12} />
                            <span>Clear Notes</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Active Keywords Cloud */}
                    <div className="seo-diag-active-cloud-box">
                      <div className="text-[12px] font-medium text-gray-700 mb-2 flex items-center justify-between">
                        <span>Saved Keyword Notes:</span>
                        <span className="text-[11px] text-gray-400">
                          Click × to remove
                        </span>
                      </div>
                      <div className="seo-diag-tags-wrap">
                        {keywords.map((kw, idx) => (
                          <span key={`${kw}-${idx}`} className="seo-diag-active-chip">
                            <span>{kw}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveKeyword(idx)}
                              className="chip-remove-btn"
                              title={`Remove "${kw}"`}
                            >
                              <X size={11} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 1-Click Design Industry Recommendations */}
                    <div className="seo-diag-recommendations-section">
                      <div className="text-[12.5px] font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-[#e0733d]" />
                        Writing Prompts
                      </div>
                      <p className="text-[11.5px] text-gray-500 mb-3">
                        Optional topic ideas. Use only terms that truthfully describe your work; no search-volume data is available here.
                      </p>

                      <div className="space-y-3">
                        {RECOMMENDED_KEYWORDS.map((group) => (
                          <div key={group.category} className="seo-diag-rec-group">
                            <span className="rec-group-title">
                              {group.category}
                            </span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {group.items.map((item) => {
                                const isAdded = keywords.some(
                                  (k) => k.toLowerCase() === item.toLowerCase()
                                );
                                return (
                                  <button
                                    key={item}
                                    type="button"
                                    onClick={() =>
                                      isAdded ? null : handleAddKeyword(item)
                                    }
                                    disabled={isAdded}
                                    className={`seo-diag-rec-chip ${
                                      isAdded ? "is-added" : ""
                                    }`}
                                  >
                                    {isAdded ? (
                                      <Check size={11} className="text-emerald-600" />
                                    ) : (
                                      <Plus size={11} />
                                    )}
                                    <span>{item}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: DESIGN BENCHMARKS AUDIT */}
                {activeTab === "benchmarks" && (
                  <div className="seo-diag-tab-content space-y-4">
                    <div className="seo-diag-benchmark-card">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="benchmark-card-title">
                            Title Tag Evaluation
                          </h4>
                          <p className="benchmark-card-subtitle">
                            Compared with the maintained title for this page
                          </p>
                        </div>
                        <span className={`benchmark-status-badge${auditReport.checks.find((check) => check.id === "title")?.passed ? " is-pass" : ""}`}>
                          {metaTitle.length} Chars
                        </span>
                      </div>
                      <div className="seo-diag-code-display mt-2.5">
                        {metaTitle}
                      </div>
                      <p className="text-[11.5px] text-gray-500 mt-2">
                        Title length is informational. Search engines may adjust the displayed title.
                      </p>
                    </div>

                    <div className="seo-diag-benchmark-card">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="benchmark-card-title">
                            Meta Description Evaluation
                          </h4>
                          <p className="benchmark-card-subtitle">
                            Compared with the maintained description for this page
                          </p>
                        </div>
                        <span className={`benchmark-status-badge${auditReport.checks.find((check) => check.id === "description")?.passed ? " is-pass" : ""}`}>
                          {metaDescription.length} Chars
                        </span>
                      </div>
                      <div className="seo-diag-code-display mt-2.5">
                        {metaDescription}
                      </div>
                      <p className="text-[11.5px] text-gray-500 mt-2">
                        Descriptions should summarize this page accurately. Search engines may choose a different snippet.
                      </p>
                    </div>

                    {/* Audit Checklist */}
                    <div className="seo-diag-checklist-card">
                      <h4 className="text-[13px] font-semibold text-gray-800 mb-2">
                        {auditReport.passedCount}/{auditReport.totalCount} technical checks passed
                      </h4>
                      <div className="space-y-2">
                        {auditReport.checks.map((c) => (
                          <div
                            key={c.id}
                            className="seo-diag-check-row flex items-start gap-2.5 p-2 rounded-lg bg-gray-50/70 border border-gray-100 text-[12px]"
                            data-check={c.id}
                            data-status={c.passed === null ? "pending" : c.passed ? "passed" : "failed"}
                          >
                            <span className="mt-0.5">
                              {c.passed === true ? (
                                <CheckCircle2
                                  size={15}
                                  className="text-emerald-600"
                                />
                              ) : (
                                <AlertCircle size={15} className="text-amber-500" />
                              )}
                            </span>
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">
                                {c.label}
                              </span>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                {c.detail}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: SEARCH & SOCIAL SNIPPET PREVIEW */}
                {activeTab === "preview" && (
                  <div className="seo-diag-tab-content space-y-4">
                    {/* Google SERP Preview */}
                    <div>
                      <div className="text-[12px] font-semibold text-gray-800 mb-1.5 flex items-center gap-1.5">
                        <Globe size={14} className="text-[#e0733d]" />
                        Google Desktop Search Result Preview
                      </div>
                      <div className="seo-diag-google-preview">
                        <div className="google-url-row">
                          <img
                            src="/avatar.webp"
                            alt="Logo"
                            className="w-4 h-4 rounded-full"
                          />
                          <div className="google-site-name">
                            Opeyemi Adegboye Portfolio
                          </div>
                          <div className="google-url">
                            {page?.canonical || "No canonical URL found"}
                          </div>
                        </div>
                        <h3 className="google-title">{metaTitle}</h3>
                        <p className="google-snippet">{metaDescription}</p>
                      </div>
                    </div>

                    {/* Social Share Preview (LinkedIn / X) */}
                    <div>
                      <div className="text-[12px] font-semibold text-gray-800 mb-1.5 flex items-center gap-1.5">
                        <Share2 size={14} className="text-[#e0733d]" />
                        LinkedIn & X (Twitter) Card Preview
                      </div>
                      <div className="seo-diag-social-preview">
                        <div className="social-img-wrap">
                          {ogData.image ? <img
                            src={ogData.image || undefined}
                            alt="OpenGraph Preview"
                            className="w-full h-auto object-cover"
                          /> : <p>No Open Graph image tag found.</p>}
                        </div>
                        <div className="p-3 bg-white border-t border-gray-100">
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                            {ogData.site_name || "Site name tag missing"}
                          </span>
                          <h4 className="text-[13px] font-semibold text-gray-900 mt-0.5 leading-snug">
                            {ogData.title}
                          </h4>
                          <p className="text-[11.5px] text-gray-500 line-clamp-2 mt-1">
                            {ogData.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: AI READINESS & SCHEMA.ORG */}
                {activeTab === "ai" && (
                  <div className="seo-diag-tab-content space-y-3">
                    <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-900">
                        <Bot size={16} className="text-[#e0733d]" />
                        <span>Discovery Documents & Structured Data</span>
                      </div>
                      <p className="text-[11.5px] text-gray-600 mt-1">
                        Live checks use this browser’s current origin. They do not confirm indexing, crawler access through a CDN, or AI recommendations. llms.txt is a supplementary convention.
                      </p>

                      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                        {DISCOVERY_FILES.map((kind) => (
                          <div key={kind} className="p-2 bg-white rounded-lg border border-gray-200" title={files[kind]?.detail}>
                            <a href={`/${kind}`} target="_blank" rel="noreferrer" className="block text-[10.5px] font-semibold text-gray-500">{kind}</a>
                            <span className={`text-[12px] font-bold ${files[kind]?.passed ? "text-emerald-600" : "text-gray-600"}`}>
                              {!files[kind] ? "Checking…" : !files[kind].passed ? "Could not verify" :
                                kind === "robots.txt" ? `${files[kind].agentCount} agent declarations` :
                                  kind === "sitemap.xml" ? `${files[kind].urlCount} URLs listed` : "HTTP 200 · verified"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12.5px] font-semibold text-gray-800 flex items-center gap-1.5">
                          <Code size={14} className="text-[#e0733d]" />
                          JSON-LD Schema.org Entity Graph
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(jsonLdSummary, null, 2),
                              "jsonld"
                            )
                          }
                          className="seo-diag-text-action"
                        >
                          {copiedKey === "jsonld" ? (
                            <Check size={12} className="text-emerald-600" />
                          ) : (
                            <Copy size={12} />
                          )}
                          <span>Copy Schema JSON</span>
                        </button>
                      </div>

                      <div className="text-[11.5px] space-y-1.5 text-gray-600">
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span>Detected Schema Types:</span>
                          <span className="font-semibold text-gray-900">
                            {types.join(", ") || "None found"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span>Occupational Profiles (hasOccupation):</span>
                          <span className="font-semibold text-gray-900">
                            {arrayCount(person?.hasOccupation)} declared
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span>Declared Topics (knowsAbout):</span>
                          <span className="font-semibold text-gray-900">
                            {arrayCount(person?.knowsAbout)} topics
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span>Works listed on this page:</span>
                          <span className="font-semibold text-gray-900">
                            {listedWorkCount || entities.filter((node) => [node["@type"]].flat().includes("CreativeWork")).length} listed · indexing unverified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer status bar */}
              <div className="seo-diag-modal-footer">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[11px] text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>
                      Checking {window.location.origin}{page?.path || "/"}
                    </span>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-gray-900 select-none pl-0 sm:pl-2 sm:border-l sm:border-gray-200">
                    <input
                      type="checkbox"
                      checked={alwaysShowInProd}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setAlwaysShowInProd(val);
                        localStorage.setItem("seo_tool_always_show", val ? "true" : "false");
                        showNotification(
                          val
                            ? "Inspector preference saved for this browser"
                            : "Inspector hidden here on production; use Ctrl/Cmd+Shift+S or ?seo to reveal it"
                        );
                      }}
                      className="rounded border-gray-300 text-[#e0733d] focus:ring-0"
                    />
                    <span>Always show in this browser</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRefreshKey((key) => key + 1);
                    }}
                    className="seo-diag-save-btn"
                  >
                    <RotateCcw size={13} />
                    <span>Run Checks Again</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
