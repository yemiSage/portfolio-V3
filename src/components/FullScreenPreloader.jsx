import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const QUOTES = [
  "Clarity first. Everything else follows.",
  "Useful products begin with thoughtful questions.",
  "Design the experience. Build the confidence.",
  "Simple on the surface, intentional underneath.",
  "Good design makes the next step feel obvious.",
  "Ideas become valuable when people can use them.",
  "Every detail should earn its place.",
];

const STORAGE_KEY = "recent_quotes_indices";
const MEMORY_LIMIT = 5;
let selectedQuoteForPageLoad = null;

function selectFreshQuote() {
  if (selectedQuoteForPageLoad) return selectedQuoteForPageLoad;

  const allIndices = QUOTES.map((_, index) => index);

  try {
    const storedValue = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    const recentIndices = Array.isArray(storedValue)
      ? storedValue.filter((index) => Number.isInteger(index) && allIndices.includes(index))
      : [];
    const freshIndices = allIndices.filter((index) => !recentIndices.includes(index));
    const selectionPool = freshIndices.length > 0 ? freshIndices : allIndices;
    const selectedIndex = selectionPool[Math.floor(Math.random() * selectionPool.length)];
    const nextRecentIndices = [
      ...recentIndices.filter((index) => index !== selectedIndex),
      selectedIndex,
    ].slice(-MEMORY_LIMIT);

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecentIndices));
    selectedQuoteForPageLoad = QUOTES[selectedIndex];
  } catch {
    selectedQuoteForPageLoad = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }

  return selectedQuoteForPageLoad;
}

export default function FullScreenPreloader({ onComplete, isInitial = true }) {
  const [activeQuote] = useState(selectFreshQuote);
  const [displayedText, setDisplayedText] = useState("");
  const [isFinishedTyping, setIsFinishedTyping] = useState(false);

  useEffect(() => {
    let characterIndex = 0;
    setDisplayedText("");
    setIsFinishedTyping(false);

    const typingInterval = window.setInterval(() => {
      characterIndex += 1;
      setDisplayedText(activeQuote.slice(0, characterIndex));

      if (characterIndex >= activeQuote.length) {
        window.clearInterval(typingInterval);
        setIsFinishedTyping(true);
      }
    }, 45);

    return () => window.clearInterval(typingInterval);
  }, [activeQuote]);

  useEffect(() => {
    if (!isFinishedTyping) return undefined;

    const dismissalTimer = window.setTimeout(onComplete, 800);
    return () => window.clearTimeout(dismissalTimer);
  }, [isFinishedTyping, onComplete]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, []);

  return (
    <motion.div
      className="preloader"
      initial={isInitial ? { y: 0 } : false}
      exit={{ y: "-100%" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      aria-label="Opening portfolio"
    >
      <p className="preloader-accessible-copy" aria-live="polite">
        {activeQuote}
      </p>
      <div className="preloader-copy" aria-hidden="true">
        <span>{displayedText}</span>
        {!isFinishedTyping && (
          <motion.span
            className="preloader-cursor"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </motion.div>
  );
}
