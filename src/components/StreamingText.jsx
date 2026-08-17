import { useEffect, useMemo, useState } from "react";

function makeChunks(segments) {
  return segments.flatMap((segment, segmentIndex) => {
    const words = segment.text.trim().split(/\s+/).filter(Boolean);
    const chunks = [];
    let group = [];

    words.forEach((word, index) => {
      group.push(word);
      const endsPhrase = /[,;:]$/.test(word);
      const endsSentence = /[.!?]$/.test(word);
      const isLastWord = index === words.length - 1;

      if (group.length >= 4 || endsPhrase || endsSentence || isLastWord) {
        chunks.push({
          text: `${group.join(" ")}${isLastWord && segmentIndex === segments.length - 1 ? "" : " "}`,
          emphasis: Boolean(segment.emphasis),
          segmentIndex,
          pause: endsSentence ? 230 : endsPhrase ? 130 : 42,
        });
        group = [];
      }
    });

    return chunks;
  });
}

export default function StreamingText({ className = "", segments, onComplete, complete = false }) {
  const chunks = useMemo(() => makeChunks(segments), [segments]);
  const [visibleCount, setVisibleCount] = useState(complete ? chunks.length : 0);
  const [finished, setFinished] = useState(complete);

  useEffect(() => {
    if (complete) {
      setVisibleCount(chunks.length);
      setFinished(true);
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleCount(chunks.length);
      setFinished(true);
      onComplete?.();
      return undefined;
    }

    let index = 0;
    let timer;
    const revealNext = () => {
      index += 1;
      setVisibleCount(index);
      if (index >= chunks.length) {
        setFinished(true);
        onComplete?.();
        return;
      }
      timer = window.setTimeout(revealNext, chunks[index - 1].pause);
    };

    timer = window.setTimeout(revealNext, 100);
    return () => window.clearTimeout(timer);
  }, [chunks, complete, onComplete]);

  const visibleChunks = chunks.slice(0, visibleCount);
  const activeSegmentIndex = chunks[Math.max(visibleCount - 1, 0)]?.segmentIndex ?? 0;

  return (
    <div className={`${className} streaming-text`}>
      {segments.map((segment, segmentIndex) => (
        <p className="streaming-text-paragraph" key={`${segmentIndex}-${segment.text}`}>
          <span className="streaming-text-visual" aria-hidden="true">
            {visibleChunks
              .filter((chunk) => chunk.segmentIndex === segmentIndex)
              .map((chunk, index) => {
                const Tag = chunk.emphasis ? "strong" : "span";
                return <Tag className="streaming-text-chunk" key={`${index}-${chunk.text}`}>{chunk.text}</Tag>;
              })}
            {!finished && activeSegmentIndex === segmentIndex && (
              <span className="streaming-text-caret" aria-hidden="true" />
            )}
          </span>
          <span className="sr-only">{segment.text}</span>
        </p>
      ))}
    </div>
  );
}
