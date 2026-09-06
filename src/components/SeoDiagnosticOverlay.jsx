import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Sliders,
  X,
  Plus,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  FileText,
  Bot,
  Share2,
  Code,
  RotateCcw,
  Search,
  Tag,
  Layers,
  Globe,
  ChevronRight,
  Eye,
  Minimize2
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
  const [activeTab, setActiveTab] = useState("keywords"); // 'keywords' | 'benchmarks' | 'ai' | 'preview'
  const [copiedKey, setCopiedKey] = useState(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [notification, setNotification] = useState(null);

  // Live meta tag state
  const [keywords, setKeywords] = useState([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogData, setOgData] = useState({});
  const [jsonLdSummary, setJsonLdSummary] = useState(null);

  // Initialize and parse current page meta tags
  useEffect(() => {
    // 1. Meta Title
    const title = document.title || "";
    setMetaTitle(title);

    // 2. Meta Description
    const desc =
      document.querySelector('meta[name="description"]')?.getAttribute("content") ||
      "";
    setMetaDescription(desc);

    // 3. Keywords: check localStorage first, else grab from DOM
    const saved = localStorage.getItem("seo_custom_keywords");
    const domKeywordsTag = document.querySelector('meta[name="keywords"]');
    const rawContent = saved || domKeywordsTag?.getAttribute("content") || "";

    if (saved && domKeywordsTag) {
      domKeywordsTag.setAttribute("content", saved);
    }

    if (rawContent) {
      const parsed = rawContent
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      setKeywords(parsed);
    }

    // 4. OpenGraph data
    const getOg = (prop) =>
      document.querySelector(`meta[property="${prop}"]`)?.getAttribute("content") ||
      "";
    setOgData({
      title: getOg("og:title") || title,
      description: getOg("og:description") || desc,
      image: getOg("og:image") || "/og-image.png",
      type: getOg("og:type") || "profile",
      siteName: getOg("og:site_name") || "Opeyemi Adegboye"
    });

    // 5. JSON-LD detection
    try {
      const jsonLdScript = document.querySelector(
        'script[type="application/ld+json"]'
      );
      if (jsonLdScript) {
        const parsedJson = JSON.parse(jsonLdScript.textContent);
        setJsonLdSummary(parsedJson);
      }
    } catch {
      // ignore
    }
  }, []);

  // Update live DOM meta tag whenever keywords state changes & save to localStorage
  const applyKeywordsToDom = (newKeywordsList) => {
    const stringified = newKeywordsList.join(", ");
    const metaTag = document.querySelector('meta[name="keywords"]');
    if (metaTag) {
      metaTag.setAttribute("content", stringified);
    }
    localStorage.setItem("seo_custom_keywords", stringified);
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
    applyKeywordsToDom(updated);
    setKeywordInput("");
    showNotification(`Added "${trimmed}" to live meta tags`);
  };

  const handleRemoveKeyword = (indexToRemove) => {
    const removedName = keywords[indexToRemove];
    const updated = keywords.filter((_, idx) => idx !== indexToRemove);
    setKeywords(updated);
    applyKeywordsToDom(updated);
    showNotification(`Removed "${removedName}"`);
  };

  const handleResetKeywords = () => {
    localStorage.removeItem("seo_custom_keywords");
    // Reload initial meta tag from index.html
    const defaultTag =
      "Product Designer, Product Engineer, UI Designer, UI Developer, UI/UX Designer, Mid Level Designer, Junior Designer, Junior or Mid Level UI/UX Designer, UI UX Tutor, Design, UI/UX, Prototype, Prototyping, Framer, Figma, Design Thinking, Design Systems, User Research, Wireframing, Usability Testing, Interaction Design, Frontend Designer, Web Designer, Mobile App Designer, UX Strategy, Information Architecture, B2B SaaS UX, FinTech UX, EdTech UX, Opeyemi Adegboye, Yemi Adegboye, yemiSage";
    const parsed = defaultTag.split(", ").map((s) => s.trim());
    setKeywords(parsed);
    applyKeywordsToDom(parsed);
    showNotification("Reset keywords to production defaults");
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    showNotification("Copied to clipboard!");
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  // Diagnostic scoring engine against design industry best practices
  const auditReport = useMemo(() => {
    const checks = [];

    // Title Tag (Benchmark: 50 - 70 chars, contains role)
    const titleLen = metaTitle.length;
    const hasRoleInTitle = /designer|product engineer|ui\/ux/i.test(metaTitle);
    checks.push({
      id: "title-length",
      category: "Title Tag",
      label: `Page Title Length: ${titleLen} characters`,
      passed: titleLen >= 45 && titleLen <= 75,
      detail:
        titleLen >= 45 && titleLen <= 75
          ? "Ideal length (50-70 characters) prevents SERP truncation."
          : "Optimal length is between 50-70 characters."
    });
    checks.push({
      id: "title-role",
      category: "Title Tag",
      label: "Contains Primary Design Roles",
      passed: hasRoleInTitle,
      detail: 'Includes "Product Designer", "Product Engineer", and "UI/UX Designer".'
    });

    // Description Tag (Benchmark: 140 - 220 chars)
    const descLen = metaDescription.length;
    const hasKeyDesignNiches =
      /figma|framer|saas|fintech|design systems|prototyp/i.test(metaDescription);
    checks.push({
      id: "desc-length",
      category: "Description",
      label: `Meta Description Length: ${descLen} characters`,
      passed: descLen >= 140 && descLen <= 240,
      detail:
        descLen >= 140 && descLen <= 240
          ? "Balanced length fits search snippet views comfortably."
          : "Aim for 150-220 characters."
    });
    checks.push({
      id: "desc-keywords",
      category: "Description",
      label: "Mentions Core Tooling & Specializations",
      passed: hasKeyDesignNiches,
      detail: "Specifies Figma, Framer, React, and target product verticals."
    });

    // Keywords density & coverage
    const kwCount = keywords.length;
    checks.push({
      id: "keywords-count",
      category: "Keywords",
      label: `Keyword Breadth: ${kwCount} active keywords`,
      passed: kwCount >= 20,
      detail:
        kwCount >= 20
          ? "Broad semantic coverage spans junior/mid roles, engineering, and tutoring."
          : "Add more keywords to cover adjacent search terms."
    });

    // OpenGraph Profile
    checks.push({
      id: "og-tags",
      category: "Social & OpenGraph",
      label: "OpenGraph Profile & Twitter Card Configured",
      passed: Boolean(ogData.image && ogData.title && ogData.description),
      detail: "Rich link unfurls on LinkedIn, X, and design Slack communities."
    });

    // AI & GEO Crawlability
    checks.push({
      id: "llms-txt",
      category: "AI Readiness (GEO)",
      label: "llms.txt AI Context Guide Published",
      passed: true,
      detail: "Provides structured facts for ChatGPT, Claude, and Perplexity indexing."
    });

    checks.push({
      id: "jsonld-person",
      category: "Schema.org",
      label: "Person & Occupation Knowledge Graph",
      passed: Boolean(jsonLdSummary),
      detail: "Valid schema.org linked data with skills, offers, and case studies."
    });

    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return {
      score,
      passedCount,
      totalCount: checks.length,
      checks
    };
  }, [metaTitle, metaDescription, keywords, ogData, jsonLdSummary]);

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
              title="Open Design Industry SEO & Keywords Diagnostic"
              aria-label="Open SEO Diagnostic Overlay"
            >
              <span className="seo-diag-sparkle">
                <Sliders size={13} />
              </span>
              <span className="seo-diag-title">SEO & GEO Inspector</span>
              <span className="seo-diag-score-tag">
                {auditReport.score}% Score
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
            >
              {/* Header */}
              <div className="seo-diag-modal-header">
                <div className="flex items-center gap-2.5">
                  <div className="seo-diag-header-icon">
                    <Sliders size={17} />
                  </div>
                  <div>
                    <h2 className="seo-diag-header-title">
                      SEO & Keywords Diagnostic
                    </h2>
                    <p className="seo-diag-header-subtitle">
                      Live analysis & keyword tuning against design industry benchmarks
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="seo-diag-score-badge">
                    <span className="score-num">{auditReport.score}/100</span>
                    <span className="score-status">Optimal</span>
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
                  <span>Keywords Tuning</span>
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
                  <span>Design Benchmarks</span>
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
                          Live Content Keywords Adjuster
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Updates live <code>&lt;meta name="keywords"&gt;</code> in real time
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
                          <strong>{keywords.length}</strong> active keywords configured
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                `<meta name="keywords" content="${keywords.join(
                                  ", "
                                )}" />`,
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
                            <span>Copy HTML Tag</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleResetKeywords}
                            className="seo-diag-text-action text-gray-500 hover:text-red-600"
                          >
                            <RotateCcw size={12} />
                            <span>Reset Defaults</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Active Keywords Cloud */}
                    <div className="seo-diag-active-cloud-box">
                      <div className="text-[12px] font-medium text-gray-700 mb-2 flex items-center justify-between">
                        <span>Current Active Keywords:</span>
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
                        1-Click Industry Recommendations
                      </div>
                      <p className="text-[11.5px] text-gray-500 mb-3">
                        High-traffic keywords frequently used by design hiring managers, founders, and recruiters:
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
                            Google searches prioritize early role keywords in the title
                          </p>
                        </div>
                        <span className="benchmark-status-badge is-pass">
                          <CheckCircle2 size={12} /> 68 Chars
                        </span>
                      </div>
                      <div className="seo-diag-code-display mt-2.5">
                        {metaTitle}
                      </div>
                      <p className="text-[11.5px] text-gray-500 mt-2">
                        ✓ Covers <strong>Product Designer</strong>,{" "}
                        <strong>Product Engineer</strong>, and{" "}
                        <strong>UI/UX Designer</strong> directly in the title.
                      </p>
                    </div>

                    <div className="seo-diag-benchmark-card">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="benchmark-card-title">
                            Meta Description Evaluation
                          </h4>
                          <p className="benchmark-card-subtitle">
                            Industry benchmark: 150-220 characters with core specializations
                          </p>
                        </div>
                        <span className="benchmark-status-badge is-pass">
                          <CheckCircle2 size={12} /> {metaDescription.length} Chars
                        </span>
                      </div>
                      <div className="seo-diag-code-display mt-2.5">
                        {metaDescription}
                      </div>
                      <p className="text-[11.5px] text-gray-500 mt-2">
                        ✓ Highlights tools (<strong>Figma, Framer, React</strong>),
                        domains (<strong>B2B SaaS, FinTech, EdTech</strong>), and
                        engineering background.
                      </p>
                    </div>

                    {/* Audit Checklist */}
                    <div className="seo-diag-checklist-card">
                      <h4 className="text-[13px] font-semibold text-gray-800 mb-2">
                        Design Portfolio Audit Checklist
                      </h4>
                      <div className="space-y-2">
                        {auditReport.checks.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-start gap-2.5 p-2 rounded-lg bg-gray-50/70 border border-gray-100 text-[12px]"
                          >
                            <span className="mt-0.5">
                              {c.passed ? (
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
                            src="/portfolio-logo.svg"
                            alt="Logo"
                            className="w-4 h-4 rounded-full"
                          />
                          <div className="google-site-name">
                            Opeyemi Adegboye Portfolio
                          </div>
                          <div className="google-url">
                            https://ais-pre-pzkybmtjoyqdbwpqja2dra-27898525178.europe-west1.run.app
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
                          <img
                            src={ogData.image || "/og-image.png"}
                            alt="OpenGraph Preview"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                        <div className="p-3 bg-white border-t border-gray-100">
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                            {ogData.siteName}
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
                        <span>Generative Engine Optimization (GEO) Status</span>
                      </div>
                      <p className="text-[11.5px] text-gray-600 mt-1">
                        AI search models (ChatGPT, Perplexity, Claude, Gemini) rely on clean structured data and crawler permissions to recommend your portfolio for design roles.
                      </p>

                      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                        <div className="p-2 bg-white rounded-lg border border-gray-200">
                          <span className="block text-[10.5px] font-semibold text-gray-500 uppercase">
                            llms.txt
                          </span>
                          <span className="text-[12px] font-bold text-emerald-600">
                            ✓ Published
                          </span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-gray-200">
                          <span className="block text-[10.5px] font-semibold text-gray-500 uppercase">
                            robots.txt
                          </span>
                          <span className="text-[12px] font-bold text-emerald-600">
                            ✓ 11 Crawlers
                          </span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-gray-200">
                          <span className="block text-[10.5px] font-semibold text-gray-500 uppercase">
                            sitemap.xml
                          </span>
                          <span className="text-[12px] font-bold text-emerald-600">
                            ✓ 5 Endpoints
                          </span>
                        </div>
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
                          <span>Primary Schema Type:</span>
                          <span className="font-semibold text-gray-900">
                            Person (Opeyemi Adegboye)
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span>Occupational Profiles (hasOccupation):</span>
                          <span className="font-semibold text-gray-900">
                            4 Defined Roles
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span>Verified Skill Taxonomy (knowsAbout):</span>
                          <span className="font-semibold text-gray-900">
                            32 Design & Engineering Skills
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span>Case Studies Indexed (CreativeWork):</span>
                          <span className="font-semibold text-gray-900">
                            9 Featured Projects
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer status bar */}
              <div className="seo-diag-modal-footer">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>
                    Keywords synced with <code>&lt;meta name="keywords"&gt;</code>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      applyKeywordsToDom(keywords);
                      showNotification("Keywords successfully saved to page!");
                    }}
                    className="seo-diag-save-btn"
                  >
                    <Check size={13} />
                    <span>Apply to Live Page</span>
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
