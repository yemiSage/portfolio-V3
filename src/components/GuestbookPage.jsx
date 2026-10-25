import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowUp, Mic, Square, X } from "lucide-react";
import { isVoiceInputSupported, useVoiceInput } from "./useVoiceInput";
import PersonalPageShell from "./PersonalPageShell";

const SECTIONS = [["the-wall", "The wall"], ["leave-a-note", "Leave a note"], ["a-small-note", "A small note"]];
const COLORS = { peach: "#fff0e5", lavender: "#f0edff", sage: "#ecf3ed", butter: "#fff8d9", paper: "#f3f3f5" };
const formatDate = value => new Date(value).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export default function GuestbookPage({ onOpenAiChat }) {
  const drag = useRef(null);
  const composer = useRef(null);
  const pinDrag = useRef(null);
  const suppressPinClick = useRef(false);
  const [positions, setPositions] = useState({});
  const [activeNote, setActiveNote] = useState("host");
  const [voiceNotice, setVoiceNotice] = useState("");
  const [voiceSupported] = useState(isVoiceInputSupported);
  const voice = useVoiceInput({
    onText: text => { setMessage(current => (current.trim() ? `${current.trim()} ${text}` : text).slice(0, 180)); setVoiceNotice("Review your words, then press Send when ready."); },
    onError: setVoiceNotice,
  });
  const [notes, setNotes] = useState([]);
  const [status, setStatus] = useState("loading");
  const [canSubmit, setCanSubmit] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("peach");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const load = async signal => {
    try {
      const response = await fetch("/api/guestbook", { signal });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setNotes(data.notes); setCanSubmit(data.canSubmit); setStatus("ready");
    } catch (e) { if (e.name !== "AbortError") setStatus("error"); }
  };
  useEffect(() => { const controller = new AbortController(); load(controller.signal); return () => controller.abort(); }, []);
  const submit = async event => {
    event.preventDefault();
    if (sending || voice.status !== "idle") return;
    setSending(true); setResult(null);
    try {
      const response = await fetch("/api/guestbook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, message, color, website: new FormData(event.currentTarget).get("website") }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "That note could not be sent. Please try again.");
      setActiveNote(data.note.id);
      setNotes(current => [data.note, ...current.filter(note => note.id !== data.note.id)].slice(0, 100));
      setResult({ text: "Your note is on the wall. Thanks for stopping by!", error: false });
      setName(""); setMessage("");
      composer.current?.close();
      document.getElementById("the-wall")?.scrollIntoView({ block: "start" });
    } catch (e) { setResult({ text: e.message || "Could not connect. Please try again.", error: true }); }
    finally { setSending(false); }
  };
  return <PersonalPageShell page="guestbook" sections={SECTIONS} onOpenAiChat={onOpenAiChat}>
    <div className="guest-wall-header"><h1>Postal my wall</h1><span>{status === "loading" ? "Opening the book…" : `${notes.length} ${notes.length === 1 ? "published note" : "published notes"}`}</span></div>
    <section id="the-wall" className="guest-wall personal-section">
      <div className="guest-wall-grid" role="region" aria-label="Guestbook notes. Drag or use arrow keys to explore." tabIndex={0}
        onPointerDown={event => {
          if (event.target.closest("button") || event.pointerType !== "mouse" || event.button !== 0) return;
          const board = event.currentTarget;
          drag.current = { x: event.clientX, left: board.scrollLeft };
          board.setPointerCapture(event.pointerId);
          board.dataset.dragging = "true";
        }}
        onPointerMove={event => {
          if (drag.current) event.currentTarget.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
        }}
        onPointerUp={event => { drag.current = null; delete event.currentTarget.dataset.dragging; }}
        onPointerCancel={event => { drag.current = null; delete event.currentTarget.dataset.dragging; }}
        onLostPointerCapture={event => { drag.current = null; delete event.currentTarget.dataset.dragging; }}
        onKeyDown={event => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const board = event.currentTarget;
          board.scrollLeft = event.key === "Home" ? 0 : event.key === "End" ? board.scrollWidth : board.scrollLeft + (event.key === "ArrowRight" ? 300 : -300);
        }}>
        <div className="guest-comment-canvas" style={{ width: `${Math.max(800, (notes.length + 1) * 350)}px` }}>
        {[{ id: "host", name: "Yemi, your host", message: "The internet is a big place. I’m glad our paths crossed here.", color: "peach" }, ...notes].map((note, index) => <div className="guest-comment" key={note.id} style={{ "--pin-color": ["#8c42e8", "#317adf", "#d86536", "#2e956f"][index % 4], left: positions[note.id]?.x ?? index * 350 + 16, top: positions[note.id]?.y ?? [20, 110, 45, 150][index % 4] }}>
          <button type="button" className="guest-comment-pin" aria-label={`Read note from ${note.name}`} aria-expanded={activeNote === note.id} aria-controls={`comment-${note.id}`} onPointerDown={event => {
            if (event.button !== 0) return;
            event.stopPropagation();
            const card = event.currentTarget.parentElement;
            pinDrag.current = { id: note.id, x: event.clientX, y: event.clientY, left: card.offsetLeft, top: card.offsetTop };
            suppressPinClick.current = false;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={event => {
            const start = pinDrag.current;
            if (!start || start.id !== note.id) return;
            const dx = event.clientX - start.x, dy = event.clientY - start.y;
            if (Math.hypot(dx, dy) < 4 && !suppressPinClick.current) return;
            suppressPinClick.current = true;
            const canvas = event.currentTarget.parentElement.parentElement;
            setPositions(current => ({ ...current, [note.id]: { x: Math.max(8, Math.min(canvas.clientWidth - 328, start.left + dx)), y: Math.max(8, Math.min(200, start.top + dy)) } }));
          }}
          onPointerUp={() => { pinDrag.current = null; }}
          onPointerCancel={() => { pinDrag.current = null; }}
          onLostPointerCapture={() => { pinDrag.current = null; }}
          onKeyDown={event => {
            if (!event.key.startsWith("Arrow")) return;
            event.preventDefault(); event.stopPropagation();
            const card = event.currentTarget.parentElement;
            const x = card.offsetLeft + (event.key === "ArrowRight" ? 20 : event.key === "ArrowLeft" ? -20 : 0);
            const y = card.offsetTop + (event.key === "ArrowDown" ? 20 : event.key === "ArrowUp" ? -20 : 0);
            setPositions(current => ({ ...current, [note.id]: { x: Math.max(8, Math.min(card.parentElement.clientWidth - 328, x)), y: Math.max(8, Math.min(200, y)) } }));
          }}
          onClick={() => { if (suppressPinClick.current) { suppressPinClick.current = false; return; } setActiveNote(activeNote === note.id ? null : note.id); }}>{note.name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase()}</button>
          {activeNote === note.id && <article className="guest-comment-panel" id={`comment-${note.id}`}>
            <header><span>Comment</span><button type="button" aria-label="Close comment" onClick={() => setActiveNote(null)}><X size={18} /></button></header>
            <div className="guest-comment-author"><span className="guest-comment-avatar">{note.name[0].toUpperCase()}</span><strong>{note.name}</strong>{note.createdAt && <time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>}</div>
            <p>{note.message}</p>
          </article>}
        </div>)}
        </div>
      </div>
    </section>
    <section id="leave-a-note" className="personal-section guest-open-composer">
      <button type="button" className="button button-primary" onClick={() => { setResult(null); composer.current?.showModal(); }}>Leave a note <ArrowUpRight size={17} aria-hidden="true" /></button>
      {result && !result.error && <p role="status" className="guest-result">{result.text}</p>}
    </section>
    <dialog className="guest-composer-dialog" ref={composer} aria-labelledby="guest-composer-heading" onClose={() => { if (voice.status === "recording") voice.stop(); }} onClick={event => { if (event.target === composer.current) composer.current.close(); }}>
    <section className="guest-composer" aria-labelledby="guest-composer-heading">
      <div className="guest-composer-title"><h2 id="guest-composer-heading">Leave a note</h2><button type="button" className="guest-composer-close" aria-label="Close note form" onClick={() => composer.current.close()}><X size={18} /></button></div>
      <form className="guest-form" onSubmit={submit}>
        <label className="guest-name-field"><span className="guest-comment-avatar" aria-hidden="true">{name.trim()[0]?.toUpperCase() || "?"}</span><input aria-label="Your name" name="name" autoComplete="nickname" value={name} onChange={e => setName(e.target.value)} maxLength={40} required placeholder="Your name" /></label>
        <textarea aria-label="Your note" name="message" value={message} onChange={e => setMessage(e.target.value)} maxLength={180} minLength={2} required placeholder="I worked with Yemi and…" />
        <label className="guest-honeypot" aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <div className="guest-compose-toolbar">
          {voiceSupported && <button type="button" className="guest-mic" aria-label={voice.status === "recording" ? "Stop recording" : "Dictate note"} aria-pressed={voice.status === "recording"} disabled={sending || voice.status === "transcribing"} onClick={() => voice.status === "recording" ? voice.stop() : voice.start()}>{voice.status === "recording" ? <Square size={17} /> : <Mic size={17} />}</button>}
          <span className="guest-compose-count">{voice.status === "recording" ? "Recording…" : voice.status === "transcribing" ? "Transcribing…" : `${message.length}/180`}</span>
          <button className="guest-send" type="submit" aria-label="Send note" disabled={sending || !canSubmit || voice.status !== "idle" || !name.trim() || message.trim().length < 2}><ArrowUp size={19} /></button>
        </div>
        {voiceNotice && <p className="guest-voice-notice" role="status">{voiceNotice}</p>}
        {status === "ready" && !canSubmit && <p className="guest-result">The book isn’t accepting notes just yet. <a href="mailto:adegboyeopeyemi065@gmail.com">Send me a hello by email</a> in the meantime.</p>}
        {status === "error" && <p className="guest-result" data-error="true">The book couldn’t load. <button type="button" onClick={() => load()}>Try again</button></p>}
        {result?.error && <p className="guest-result" data-error={result.error} role={result.error ? "alert" : "status"}>{result.text}</p>}
      </form>
    </section>
    </dialog>
    <section id="a-small-note" className="personal-section guest-guidelines"><p>Notes appear on the wall as soon as you send them. No ads, links, or private details, please. Just a little of you.</p><p>Want to talk about a project instead? <a className="personal-text-link" href="mailto:adegboyeopeyemi065@gmail.com">Let’s talk <ArrowUpRight size={14} aria-hidden="true" /></a></p></section>
  </PersonalPageShell>;
}
