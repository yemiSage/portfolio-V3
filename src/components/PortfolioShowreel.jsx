import { useEffect, useMemo, useRef, useState } from "react";
import { cubicBezier, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import "./PortfolioShowreel.css";

export const SHOWREEL_CONFIG = {
  duration: 16,
  colors: {
    background: "#f2f2f2",
    foreground: "#111111",
    muted: "#8a8a8a",
    line: "rgba(17,17,17,0.16)",
  },
  motion: {
    ease: [0.22, 1, 0.36, 1],
    fade: 0.22,
    enter: 0.38,
    movement: 18,
  },
  copy: {
    introName: "Hello, I am Yemi",
    introRole: "Product/UX Designer",
    setup: "I don’t just",
    pixelsAction: "move pixels.",
    connector: "and",
  },
  assets: {
    pixels: "/showreel/pixels.png",
    final: "/showreel-final.png",
  },
  outcomes: {
    users: { lead: "I move", word: "users.", image: "/showreel/users.png", start: 4.6, end: 6.3 },
    revenue: { lead: "I move", word: "revenue.", image: "/showreel/revenue.png", start: 6.1, end: 7.8 },
    hearts: { lead: "I move", word: "hearts.", image: "/showreel/hearts.png", start: 7.6, end: 9.3 },
    investors: { lead: "I move", word: "investors.", image: "/showreel/investors.png", start: 9.1, end: 10.8 },
    clarity: { lead: "I move", word: "clarity.", image: "/showreel/clarity.png", start: 10.6, end: 11.95 },
    goals: { lead: "I drive", word: "business goals.", image: "/showreel/business-goals.png", start: 12.8, end: 15 },
  },
  connectorScene: { start: 11.95, end: 12.8 },
  scenes: [
    { id: "intro", start: 0, end: 2.8 },
    { id: "intent", start: 2.6, end: 4.8 },
    { id: "outcomes", start: 4.6, end: 15 },
  ],
};

const EASE = cubicBezier(...SHOWREEL_CONFIG.motion.ease);

function useSceneOpacity(clock, scene, reducedMotion) {
  const fade = reducedMotion ? 0.5 : SHOWREEL_CONFIG.motion.fade;
  return useTransform(
    clock,
    [scene.start, scene.start + fade, scene.end - fade, scene.end],
    [0, 1, 1, 0],
    { ease: EASE },
  );
}

function useReveal(clock, start, reducedMotion, distance = SHOWREEL_CONFIG.motion.movement) {
  const enter = reducedMotion ? 0.52 : SHOWREEL_CONFIG.motion.enter;
  const opacity = useTransform(clock, [start, start + enter], [0, 1], { ease: EASE });
  const y = useTransform(clock, [start, start + enter], [reducedMotion ? 0 : distance, 0], { ease: EASE });
  const clipPath = useTransform(
    clock,
    [start, start + enter],
    [reducedMotion ? "inset(0 0 0 0)" : "inset(0 0 100% 0)", "inset(0 0 0% 0)"],
    { ease: EASE },
  );
  return { opacity, y, clipPath };
}

function Scene({ clock, scene, reducedMotion, className = "", children }) {
  const opacity = useSceneOpacity(clock, scene, reducedMotion);
  return (
    <motion.section className={`yemi-reel-scene ${className}`} style={{ opacity }} aria-hidden="true">
      {children}
    </motion.section>
  );
}

function IntroScene({ clock, scene, reducedMotion }) {
  const name = useReveal(clock, 0.12, reducedMotion, 16);
  const role = useReveal(clock, 0.6, reducedMotion, 14);

  return (
    <Scene clock={clock} scene={scene} reducedMotion={reducedMotion} className="yemi-intro-scene">
      <div className="yemi-intro-lockup">
        <motion.h2 style={name}>{SHOWREEL_CONFIG.copy.introName}</motion.h2>
        <motion.p className="yemi-intro-role" style={role}>{SHOWREEL_CONFIG.copy.introRole}</motion.p>
      </div>
    </Scene>
  );
}

function InlineMedia({ source, className = "", style }) {
  return (
    <motion.span className={`yemi-inline-media ${className}`} style={style} aria-hidden="true">
      <span className="yemi-inline-frame">
        <img src={source} alt="" loading="lazy" decoding="async" />
      </span>
    </motion.span>
  );
}

function IntentScene({ clock, scene, reducedMotion }) {
  const lead = useReveal(clock, scene.start + 0.08, reducedMotion, 12);
  const shift = useTransform(
    clock,
    [scene.start + 0.45, scene.start + 1.15],
    ["0cqw", reducedMotion ? "-8cqw" : "-15cqw"],
    { ease: EASE },
  );
  const tail = useReveal(clock, scene.start + 0.78, reducedMotion, 8);
  const imageOpacity = useTransform(
    clock,
    [scene.start + 0.72, scene.start + 1.02, scene.end - 0.42, scene.end],
    [0, 1, 1, 0],
    { ease: EASE },
  );

  return (
    <Scene clock={clock} scene={scene} reducedMotion={reducedMotion} className="yemi-intent-scene">
      <motion.div className="yemi-intent-line" style={{ x: shift }}>
        <motion.span className="yemi-muted-word" style={lead}>{SHOWREEL_CONFIG.copy.setup}</motion.span>
        <motion.span className="yemi-intent-tail" style={tail}>
          <InlineMedia source={SHOWREEL_CONFIG.assets.pixels} style={{ opacity: imageOpacity }} />
          <span>{SHOWREEL_CONFIG.copy.pixelsAction}</span>
        </motion.span>
      </motion.div>
    </Scene>
  );
}

function OutcomeBeat({ clock, reducedMotion, outcome }) {
  const wordOpacity = useTransform(
    clock,
    [outcome.start, outcome.start + 0.24, outcome.end - 0.24, outcome.end],
    [0, 1, 1, 0],
    { ease: EASE },
  );
  const wordY = useTransform(
    clock,
    [outcome.start, outcome.start + 0.3, outcome.end - 0.3, outcome.end],
    [reducedMotion ? 0 : 8, 0, 0, reducedMotion ? 0 : -8],
    { ease: EASE },
  );
  const imageOpacity = useTransform(
    clock,
    [outcome.start + 0.04, outcome.start + 0.36, outcome.end - 0.36, outcome.end - 0.04],
    [0, 1, 1, 0],
    { ease: EASE },
  );
  const imageScale = useTransform(
    clock,
    [outcome.start, outcome.end],
    [reducedMotion ? 1 : 0.98, reducedMotion ? 1 : 1.03],
    { ease: EASE },
  );

  return (
    <motion.div className="yemi-outcome-beat" style={{ opacity: wordOpacity, y: wordY }}>
      <span className="yemi-outcome-lead">{outcome.lead}</span>
      <InlineMedia source={outcome.image} className="yemi-outcome-media" style={{ opacity: imageOpacity, scale: imageScale }} />
      <span>{outcome.word}</span>
    </motion.div>
  );
}

function OutcomesScene({ clock, scene, reducedMotion }) {
  const outcomes = Object.values(SHOWREEL_CONFIG.outcomes);
  const connectorScene = SHOWREEL_CONFIG.connectorScene;
  const connectorOpacity = useTransform(
    clock,
    [connectorScene.start, connectorScene.start + 0.14, connectorScene.end - 0.14, connectorScene.end],
    [0, 1, 1, 0],
    { ease: EASE },
  );
  const connectorY = useTransform(
    clock,
    [connectorScene.start, connectorScene.start + 0.22],
    [reducedMotion ? 0 : 8, 0],
    { ease: EASE },
  );

  return (
    <Scene clock={clock} scene={scene} reducedMotion={reducedMotion} className="yemi-outcomes-scene">
      <div className="yemi-persistent-outcomes">
        <div className="yemi-outcome-composition">
          {outcomes.map((outcome) => (
            <OutcomeBeat key={outcome.word} clock={clock} reducedMotion={reducedMotion} outcome={outcome} />
          ))}
        </div>
        <motion.p className="yemi-connector-scene" style={{ opacity: connectorOpacity, y: connectorY }}>
          {SHOWREEL_CONFIG.copy.connector}
        </motion.p>
      </div>
    </Scene>
  );
}

function FinalScene({ clock, completed, onReplay }) {
  const opacity = useTransform(clock, [14.98, 15.08], [0, 1], { ease: EASE });
  const imageY = useTransform(clock, [15, 15.95], ["100%", "0%"], { ease: EASE });

  return (
    <motion.section className="yemi-reel-final" style={{ opacity }} aria-hidden={!completed}>
      <motion.div className="yemi-final-image" style={{ y: imageY }}>
        <img src={SHOWREEL_CONFIG.assets.final} alt="" aria-hidden="true" />
      </motion.div>
      {completed && (
        <button
          type="button"
          className="yemi-replay-button"
          aria-label="Replay portfolio showreel"
          onClick={(event) => { event.stopPropagation(); onReplay(); }}
        >
          <span className="yemi-replay-icon" aria-hidden="true" />
        </button>
      )}
    </motion.section>
  );
}

const SCENE_COMPONENTS = {
  intro: IntroScene,
  intent: IntentScene,
  outcomes: OutcomesScene,
};

export default function PortfolioShowreel() {
  const rootRef = useRef(null);
  const animationFrameRef = useRef(null);
  const clock = useMotionValue(0);
  const reducedMotion = Boolean(useReducedMotion());
  const [manualPause, setManualPause] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [inView, setInView] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(() => !document.hidden);
  const playing = inView && documentVisible && !manualPause && !completed;
  const cssVariables = useMemo(
    () => Object.fromEntries(Object.entries(SHOWREEL_CONFIG.colors).map(([key, value]) => [`--yemi-${key}`, value])),
    [],
  );

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      { threshold: [0, 0.35, 0.75] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (!playing) return undefined;
    let previous = performance.now();
    const tick = (timestamp) => {
      const delta = Math.min((timestamp - previous) / 1000, 0.1);
      previous = timestamp;
      const next = clock.get() + delta;
      if (next >= SHOWREEL_CONFIG.duration) {
        clock.set(SHOWREEL_CONFIG.duration);
        setCompleted(true);
        animationFrameRef.current = null;
        return;
      }
      clock.set(next);
      animationFrameRef.current = requestAnimationFrame(tick);
    };
    animationFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [clock, playing]);

  const replay = () => {
    clock.set(0);
    setCompleted(false);
    setManualPause(false);
  };

  const togglePlayback = () => {
    if (completed) {
      replay();
      return;
    }
    setManualPause((paused) => !paused);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePlayback();
    }
  };

  return (
    <div
      className={`portfolio-showreel yemi-reel${playing ? " is-playing" : " is-paused"}${completed ? " is-complete" : ""}`}
      ref={rootRef}
      role="group"
      aria-label="Silent animated portfolio introduction for Yemi."
      style={cssVariables}
    >
      <div
        className="yemi-reel-stage"
        role="button"
        tabIndex={0}
        aria-label={completed ? "Replay portfolio showreel" : playing ? "Pause portfolio showreel" : "Resume portfolio showreel"}
        aria-pressed={!playing}
        onClick={togglePlayback}
        onKeyDown={handleKeyDown}
      >
        {SHOWREEL_CONFIG.scenes.map((scene) => {
          const Component = SCENE_COMPONENTS[scene.id];
          return <Component key={scene.id} clock={clock} scene={scene} reducedMotion={reducedMotion} />;
        })}
        <FinalScene clock={clock} completed={completed} onReplay={replay} />
      </div>

      {!completed && <div className="yemi-reel-controls">
        <button
          type="button"
          className="yemi-reel-control"
          aria-label={playing ? "Pause portfolio showreel" : "Resume portfolio showreel"}
          onClick={(event) => { event.stopPropagation(); togglePlayback(); }}
        >
          <span className={playing ? "yemi-pause-icon" : "yemi-play-icon"} aria-hidden="true" />
        </button>
      </div>}
    </div>
  );
}
