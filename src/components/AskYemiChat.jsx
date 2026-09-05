import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSmartPortfolioReply, cleanChatOutput } from "../utils/chatKnowledge";

const DEFAULT_SUGGESTIONS = [
  "What is Yemi's design process?",
  "Tell me about TASAfrica",
  "What problem does Limestone App solve?",
  "What inspires Yemi?",
  "What tools and tech does Yemi use?",
  "How can I contact or hire Yemi?",
];

function getFollowUpSuggestions(lastQuery = "") {
  const q = lastQuery.toLowerCase();
  if (q.includes("tasafrica") || q.includes("sport")) {
    return [
      "What problem does Limestone App solve?",
      "What is Yemi's design process?",
      "How can I contact or hire Yemi?",
    ];
  }
  if (q.includes("limestone") || q.includes("security")) {
    return [
      "Tell me about TASAfrica",
      "What tools and tech does Yemi use?",
      "How can I contact or hire Yemi?",
    ];
  }
  if (q.includes("process") || q.includes("approach")) {
    return [
      "What makes Yemi's design approach unique?",
      "What inspires Yemi?",
      "Tell me about TASAfrica",
    ];
  }
  if (q.includes("contact") || q.includes("hire")) {
    return [
      "What projects has Yemi worked on?",
      "What is Yemi's design process?",
      "What tools and tech does Yemi use?",
    ];
  }
  return [
    "What is Yemi's design process?",
    "What are Yemi's favorite parts of design?",
    "What makes Yemi's design approach unique?",
  ];
}

function InfoIcon({ size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function ResetIcon({ size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function CloseIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ArrowUpIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

// Formatter for clean rendering of bullet points and case-study navigation links without asterisks or em-dashes
function FormattedAssistantText({ text, onNavigate }) {
  if (!text) return null;

  const cleaned = cleanChatOutput(text);
  const lines = cleaned.split("\n");

  const formatInline = (str) => {
    const parts = [];
    let lastIdx = 0;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(str)) !== null) {
      if (match.index > lastIdx) {
        parts.push(str.substring(lastIdx, match.index));
      }
      const label = match[1];
      const url = match[2];
      parts.push(
        <a
          key={match.index}
          href={url}
          className="rachel-chat-link"
          onClick={(e) => {
            if (url.startsWith("/") && onNavigate) {
              e.preventDefault();
              onNavigate(url);
            }
          }}
          target={url.startsWith("http") ? "_blank" : undefined}
          rel={url.startsWith("http") ? "noreferrer" : undefined}
        >
          {label}
        </a>
      );
      lastIdx = linkRegex.lastIndex;
    }
    if (lastIdx < str.length) {
      parts.push(str.substring(lastIdx));
    }
    return parts;
  };

  return (
    <div className="rachel-text-body">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} className="rachel-text-gap" />;
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          return (
            <div key={lIdx} className="rachel-list-item">
              <span className="rachel-bullet">•</span>
              <span>{formatInline(trimmed.slice(2))}</span>
            </div>
          );
        }
        return (
          <p key={lIdx} className="rachel-paragraph">
            {formatInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default function AskYemiChat({
  isOpen,
  onClose,
  onOpen,
  onNavigate,
}) {
  const [messages, setMessages] = useState([
    {
      id: "initial-msg",
      role: "assistant",
      content:
        "Yemi finds inspiration in ambitious people who are highly intentional about what they do. Surrounding himself with that kind of energy pushes him to do better work. He also draws inspiration from the challenges around him and the desire to create meaningful experiences through design and technology.",
      suggestions: [
        "What is Yemi's design process?",
        "What are Yemi's favorite parts of design?",
        "What makes Yemi's design approach unique?",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 640 : false
  );
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }

      const data = await response.json();
      const replyText = cleanChatOutput(
        data.reply ||
        getSmartPortfolioReply(text)
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: replyText,
          suggestions: getFollowUpSuggestions(text),
        },
      ]);
    } catch (error) {
      console.warn("Chat API unavailable or fallback used:", error);
      const fallbackReply = cleanChatOutput(getSmartPortfolioReply(text));

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: fallbackReply,
          suggestions: getFollowUpSuggestions(text),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: "assistant",
        content:
          "Yemi finds inspiration in ambitious people who are highly intentional about what they do. Surrounding himself with that kind of energy pushes him to do better work. He also draws inspiration from the challenges around him and the desire to create meaningful experiences through design and technology.",
        suggestions: [
          "What is Yemi's design process?",
          "What are Yemi's favorite parts of design?",
          "What makes Yemi's design approach unique?",
        ],
      },
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        type="button"
        id="ask-yemi-fab"
        className={`ask-yemi-fab ${isOpen ? "is-hidden" : ""}`}
        onClick={onOpen}
        aria-label="Open Ask yemiLLM chat"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="fab-text">Ask yemiLLM</span>
      </motion.button>

      {/* Main Chat Dialog / Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              id="rachel-chat-backdrop"
              className="rachel-chat-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              aria-hidden="true"
            />

            <motion.div
              id="rachel-chat-window"
              className="rachel-chat-window"
              role="dialog"
              aria-label="YEMILLM Portfolio Assistant"
              initial={isMobile ? { y: "100%" } : { x: "100%" }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: "100%" } : { x: "100%" }}
              transition={{
                type: "spring",
                damping: isMobile ? 28 : 32,
                stiffness: isMobile ? 280 : 320,
              }}
            >
              {/* Header */}
              <div className="rachel-chat-header">
                <div className="rachel-header-left">
                  <span className="rachel-header-title">YEMILLM</span>
                  <div className="rachel-info-wrapper">
                    <button
                      type="button"
                      className="rachel-info-button"
                      aria-label="About YEMILLM"
                      onClick={() => setShowInfoTooltip(!showInfoTooltip)}
                      onMouseEnter={() => setShowInfoTooltip(true)}
                      onMouseLeave={() => setShowInfoTooltip(false)}
                    >
                      <InfoIcon size={14} />
                    </button>
                    {showInfoTooltip && (
                      <div className="rachel-info-popover">
                        AI trained on Opeyemi Adegboye's design work, process, and background.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rachel-header-right">
                  <button
                    type="button"
                    id="rachel-reset-btn"
                    className="rachel-icon-button"
                    onClick={handleResetChat}
                    title="Reset conversation"
                    aria-label="Reset conversation"
                  >
                    <ResetIcon size={15} />
                  </button>
                  <button
                    type="button"
                    id="rachel-close-btn"
                    className="rachel-icon-button"
                    onClick={onClose}
                    title="Close"
                    aria-label="Close"
                  >
                    <CloseIcon size={15} />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="rachel-chat-body">
                {messages.map((msg, index) => {
                  const isLastAssistant =
                    msg.role === "assistant" &&
                    (index === messages.length - 1 ||
                      (index === messages.length - 2 && isLoading));

                  return (
                    <div
                      key={msg.id}
                      className={`rachel-message-wrap ${
                        msg.role === "user" ? "is-user" : "is-assistant"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <div className="rachel-user-bubble">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="rachel-assistant-content">
                          <FormattedAssistantText
                            text={msg.content}
                            onNavigate={(url) => {
                              if (onNavigate) {
                                onNavigate(url);
                                onClose();
                              }
                            }}
                          />

                          {/* Divider and suggested follow-up questions */}
                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="rachel-suggestions-container">
                              <div className="rachel-divider" />
                              <div className="rachel-suggestions-list">
                                {msg.suggestions.map((suggestion, sIdx) => (
                                  <button
                                    key={sIdx}
                                    type="button"
                                    className="rachel-suggestion-item"
                                    onClick={() => handleSendMessage(suggestion)}
                                    disabled={isLoading}
                                  >
                                    <span className="rachel-suggestion-arrow" aria-hidden="true">
                                      ↳
                                    </span>
                                    <span className="rachel-suggestion-text">
                                      {suggestion}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Thinking animation - ONLY pulsing dots, without text */}
                {isLoading && (
                  <div className="rachel-message-wrap is-assistant">
                    <div className="rachel-thinking-dots" aria-label="Thinking...">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Inset Input Field */}
              <div className="rachel-chat-footer">
                <form
                  className="rachel-input-box"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <input
                    ref={inputRef}
                    id="rachel-input-field"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about Yemi..."
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    id="rachel-send-btn"
                    className={`rachel-send-icon ${
                      inputValue.trim() && !isLoading ? "is-active" : ""
                    }`}
                    disabled={!inputValue.trim() || isLoading}
                    aria-label="Send message"
                  >
                    <ArrowUpIcon size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
