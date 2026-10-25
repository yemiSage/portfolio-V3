import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowUp, Plus, ImagePlus, Mic, Square, X } from "lucide-react";
import { isVoiceInputSupported, useVoiceInput } from "./useVoiceInput";
import { defaultNotePosition, nearestNoteSpace } from "../utils/guestbookLayout.mjs";
import PersonalPageShell from "./PersonalPageShell";

const SECTIONS = [["the-wall", "The wall"], ["leave-a-note", "Leave a note"], ["a-small-note", "A small note"]];
const COLORS = { peach: "#fff0e5", lavender: "#f0edff", sage: "#ecf3ed", butter: "#fff8d9", paper: "#f3f3f5" };
const formatDate = value => new Date(value).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export default function GuestbookPage({ onOpenAiChat }) {
  const drag = useRef(null);
  const boardRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const pinchRef = useRef(null);
  zoomRef.current = zoom;
  const zoomBoard = (value, clientX, clientY) => {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const x = clientX == null ? board.clientWidth / 2 : clientX - rect.left;
    const y = clientY == null ? board.clientHeight / 2 : clientY - rect.top;
    const next = Math.max(.3, Math.min(2.5, value));
    const left = (board.scrollLeft + x) / zoomRef.current * next - x;
    const top = (board.scrollTop + y) / zoomRef.current * next - y;
    zoomRef.current = next;
    setZoom(next);
    requestAnimationFrame(() => { board.scrollLeft = left; board.scrollTop = top; });
  };
  useEffect(() => {
    const board = boardRef.current;
    const wheel = event => {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) zoomBoard(zoomRef.current * Math.exp(-event.deltaY * .008), event.clientX, event.clientY);
      else { board.scrollLeft += event.deltaX; board.scrollTop += event.deltaY; }
    };
    const pair = touches => {
      const [a,b] = touches;
      return { distance: Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY), x: (a.clientX+b.clientX)/2, y: (a.clientY+b.clientY)/2 };
    };
    const start = event => {
      if (event.touches.length !== 2) return;
      event.preventDefault();
      pinDrag.current = null; drag.current = null; suppressPinClick.current = true;
      const point = pair(event.touches), rect = board.getBoundingClientRect();
      pinchRef.current = { ...point, zoom: zoomRef.current, worldX: (board.scrollLeft + point.x - rect.left) / zoomRef.current, worldY: (board.scrollTop + point.y - rect.top) / zoomRef.current };
    };
    const move = event => {
      if (event.touches.length !== 2 || !pinchRef.current) return;
      event.preventDefault();
      const next = pair(event.touches), previous = pinchRef.current;
      zoomBoard(previous.zoom * next.distance / Math.max(1, previous.distance), next.x, next.y);
      const rect = board.getBoundingClientRect();
      requestAnimationFrame(() => { board.scrollLeft = previous.worldX * zoomRef.current - (next.x - rect.left); board.scrollTop = previous.worldY * zoomRef.current - (next.y - rect.top); });
    };
    const end = () => { pinchRef.current = null; };
    board.addEventListener("wheel", wheel, { passive: false });
    board.addEventListener("touchstart", start, { passive: false, capture: true });
    board.addEventListener("touchmove", move, { passive: false, capture: true });
    board.addEventListener("touchend", end);
    board.addEventListener("touchcancel", end);
    return () => {
      board.removeEventListener("wheel", wheel);
      board.removeEventListener("touchstart", start, true);
      board.removeEventListener("touchmove", move, true);
      board.removeEventListener("touchend", end); board.removeEventListener("touchcancel", end);
    };
  }, []);
  const composer = useRef(null);
  const avatarInput = useRef(null);
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
  const [avatar, setAvatar] = useState(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
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
      setNotes(data.notes); setActiveNote(data.notes[0]?.id || "host"); setCanSubmit(data.canSubmit); setStatus("ready");
    } catch (e) { if (e.name !== "AbortError") setStatus("error"); }
  };
  useEffect(() => { const controller = new AbortController(); load(controller.signal); return () => controller.abort(); }, []);
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => setResult(null), 5000);
    return () => clearTimeout(timer);
  }, [result]);
  const allNotes = [{ id: "host", name: "Yemi, your host", message: "The internet is a big place. I’m glad our paths crossed here.", color: "peach" }, ...notes];
  const boardWidth = Math.max(1600, ...allNotes.map((note, index) => (positions[note.id] || defaultNotePosition(index)).x + 300));
  const boardHeight = Math.max(1000, ...allNotes.map((note, index) => (positions[note.id] || defaultNotePosition(index)).y + 250));
  const selectAvatar = async event => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) { setVoiceNotice("Choose a JPEG, PNG or WebP image under 5MB."); return; }
    setAvatarBusy(true);
    const url = URL.createObjectURL(file);
    try {
      const image = new Image(); image.src = url; await image.decode();
      const canvas = document.createElement("canvas"); canvas.width = canvas.height = 96;
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff"; context.fillRect(0, 0, 96, 96);
      const side = Math.min(image.naturalWidth, image.naturalHeight);
      context.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, 96, 96);
      setAvatar(canvas.toDataURL("image/jpeg", .75)); setVoiceNotice("");
    } catch { setVoiceNotice("That image could not be opened. Try another file."); }
    finally { URL.revokeObjectURL(url); setAvatarBusy(false); }
  };
  const submit = async event => {
    event.preventDefault();
    if (sending || avatarBusy || voice.status !== "idle") return;
    setSending(true); setResult(null);
    try {
      const response = await fetch("/api/guestbook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, message, color, avatar, website: new FormData(event.currentTarget).get("website") }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "That note could not be sent. Please try again.");
      const currentPositions = Object.fromEntries(allNotes.map((note, index) => [note.id, positions[note.id] || defaultNotePosition(index)]));
      const board = boardRef.current;
      const location = nearestNoteSpace(Object.values(currentPositions), { x: (board?.scrollLeft || 0) / zoom + 20, y: (board?.scrollTop || 0) / zoom + 20 });
      setPositions({ ...currentPositions, [data.note.id]: location });
      setActiveNote(data.note.id);
      setNotes(current => [data.note, ...current.filter(note => note.id !== data.note.id)].slice(0, 100));
      setResult({ text: "Your note is on the wall. Thanks for stopping by!", error: false });
      setName(""); setMessage(""); setAvatar(null);
      composer.current?.close();
      requestAnimationFrame(() => {
        document.getElementById("the-wall")?.scrollIntoView({ block: "start" });
        boardRef.current?.scrollTo({ left: Math.max(0, location.x * zoom - 30), top: Math.max(0, location.y * zoom - 30), behavior: "auto" });
        requestAnimationFrame(() => document.getElementById(`pin-${data.note.id}`)?.focus({ preventScroll: true }));
      });
    } catch (e) { setResult({ text: e.message || "Could not connect. Please try again.", error: true }); }
    finally { setSending(false); }
  };
  return <PersonalPageShell page="guestbook" sections={SECTIONS} onOpenAiChat={onOpenAiChat}>
    <div className="guest-wall-header"><h1>Postal my wall</h1><span>{status === "loading" ? "Opening the book…" : `${notes.length} ${notes.length === 1 ? "published note" : "published notes"}`}</span></div>
    <section id="the-wall" className="guest-wall personal-section">
      <div className="guest-zoom" aria-label="Board zoom controls"><button type="button" aria-label="Zoom out" disabled={zoom <= .3} onClick={() => zoomBoard(zoomRef.current - .1)}>−</button><button type="button" aria-label="Reset zoom" onClick={() => zoomBoard(1)}>{Math.round(zoom * 100)}%</button><button type="button" aria-label="Zoom in" disabled={zoom >= 2.5} onClick={() => zoomBoard(zoomRef.current + .1)}>+</button></div>
      <div ref={boardRef} className="guest-wall-grid" role="region" aria-label="Guestbook notes. Drag or use arrow keys to explore." tabIndex={0}
        onPointerDown={event => {
          if (event.target.closest("button") || event.button !== 0 || pinchRef.current) return;
          const board = event.currentTarget;
          drag.current = { x: event.clientX, y: event.clientY, left: board.scrollLeft, top: board.scrollTop };
          board.setPointerCapture(event.pointerId);
          board.dataset.dragging = "true";
        }}
        onPointerMove={event => {
          if (drag.current) { event.currentTarget.scrollLeft = drag.current.left - (event.clientX - drag.current.x); event.currentTarget.scrollTop = drag.current.top - (event.clientY - drag.current.y); }
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
        <div className="guest-comment-space" style={{ width: boardWidth * zoom, height: boardHeight * zoom }}><div className="guest-comment-canvas" style={{ width: boardWidth, height: boardHeight, transform: `scale(${zoom})`, transformOrigin: "top left" }}>
        {allNotes.map((note, index) => <div className="guest-comment" key={note.id} style={{ "--pin-color": ["#8c42e8", "#317adf", "#d86536", "#2e956f"][index % 4], left: positions[note.id]?.x ?? defaultNotePosition(index).x, top: positions[note.id]?.y ?? defaultNotePosition(index).y }} onPointerDown={event => {
            if (pinchRef.current || event.button !== 0 || event.target.closest(".guest-comment-panel button")) return;
            event.stopPropagation();
            const card = event.currentTarget;
            pinDrag.current = { id: note.id, x: event.clientX, y: event.clientY, left: card.offsetLeft, top: card.offsetTop };
            suppressPinClick.current = false;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={event => {
            const start = pinDrag.current;
            if (!start || start.id !== note.id) return;
            const dx = (event.clientX - start.x) / zoom, dy = (event.clientY - start.y) / zoom;
            if (Math.hypot(dx, dy) < 4 && !suppressPinClick.current) return;
            suppressPinClick.current = true;
            const canvas = event.currentTarget.parentElement;
            setPositions(current => ({ ...current, [note.id]: { x: Math.max(8, Math.min(canvas.clientWidth - 268, start.left + dx)), y: Math.max(8, Math.min(boardHeight - 240, start.top + dy)) } }));
          }}
          onPointerUp={() => { pinDrag.current = null; }}
          onPointerCancel={() => { pinDrag.current = null; }}
          onLostPointerCapture={() => { pinDrag.current = null; }}
>
          <button type="button" className="guest-comment-pin" id={`pin-${note.id}`} aria-label={`Read note from ${note.name}`} aria-expanded={activeNote === note.id} aria-controls={`comment-${note.id}`}          onKeyDown={event => {
            if (!event.key.startsWith("Arrow")) return;
            event.preventDefault(); event.stopPropagation();
            const card = event.currentTarget.parentElement;
            const x = card.offsetLeft + (event.key === "ArrowRight" ? 20 : event.key === "ArrowLeft" ? -20 : 0);
            const y = card.offsetTop + (event.key === "ArrowDown" ? 20 : event.key === "ArrowUp" ? -20 : 0);
            setPositions(current => ({ ...current, [note.id]: { x: Math.max(8, Math.min(card.parentElement.clientWidth - 268, x)), y: Math.max(8, Math.min(boardHeight - 240, y)) } }));
          }}
          onClick={() => { if (suppressPinClick.current) { suppressPinClick.current = false; return; } setActiveNote(activeNote === note.id ? null : note.id); }}>{note.avatar ? <img src={note.avatar} alt="" /> : note.name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase()}</button>
          {activeNote === note.id && <article className="guest-comment-panel" id={`comment-${note.id}`}>
            <div className="guest-comment-author"><span className="guest-comment-avatar">{note.avatar ? <img src={note.avatar} alt="" /> : note.name[0].toUpperCase()}</span><strong>{note.name}</strong>{note.createdAt && <time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>}</div>
            <p>{note.message}</p>
          </article>}
        </div>)}
        </div></div>
      </div>
    </section>
    <section id="leave-a-note" className="personal-section guest-open-composer">
      <button type="button" className="button button-primary" onClick={() => { setResult(null); composer.current?.showModal(); }}>Leave a note <ArrowUpRight size={17} aria-hidden="true" /></button>
      {result && !result.error && <div role="status" className="guest-toast">{result.text}<button type="button" aria-label="Dismiss notification" onClick={() => setResult(null)}><X size={16} /></button></div>}
    </section>
    <dialog className="guest-composer-dialog" ref={composer} aria-labelledby="guest-composer-heading" onClose={() => { if (voice.status === "recording") voice.stop(); }} onClick={event => { if (event.target === composer.current) composer.current.close(); }}>
    <section className="guest-composer" aria-labelledby="guest-composer-heading">
      <div className="guest-composer-title"><h2 id="guest-composer-heading">Leave a note</h2><button type="button" className="guest-composer-close" aria-label="Close note form" onClick={() => composer.current.close()}><X size={18} /></button></div>
      <form className="guest-form" onSubmit={submit}>
        <div className="guest-name-field"><button type="button" className="guest-comment-avatar guest-avatar-button" aria-label="Add or change your photo or logo" onClick={() => avatarInput.current?.click()} disabled={avatarBusy || sending}>{avatar ? <img src={avatar} alt="Your avatar" /> : <Plus size={18} />}</button><input aria-label="Your name" name="name" autoComplete="nickname" value={name} onChange={e => setName(e.target.value)} maxLength={40} placeholder="Your name (optional)" /></div>
        <textarea aria-label="Your note" name="message" value={message} onChange={e => setMessage(e.target.value)} maxLength={180} minLength={1} required placeholder="I worked with Yemi and…" />
        <label className="guest-honeypot" aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <div className="guest-compose-toolbar">
          <label className="guest-avatar-upload" title="Add your photo or logo"><ImagePlus size={17} /><input ref={avatarInput} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload optional avatar" onChange={selectAvatar} disabled={avatarBusy || sending} /></label>
          {avatar && <button type="button" className="guest-mic" aria-label="Remove avatar" onClick={() => setAvatar(null)}><X size={14} /></button>}
          {voiceSupported && <button type="button" className="guest-mic" aria-label={voice.status === "recording" ? "Stop recording" : "Dictate note"} aria-pressed={voice.status === "recording"} disabled={sending || voice.status === "transcribing"} onClick={() => voice.status === "recording" ? voice.stop() : voice.start()}>{voice.status === "recording" ? <Square size={17} fill="currentColor" strokeWidth={0} /> : <Mic size={17} />}</button>}
          {voice.status === "recording" && <span className="guest-voice-wave" aria-hidden="true">{voice.levels.map((level, index) => <i key={index} style={{ height: `${3 + level * 22}px` }} />)}</span>}
          <span className="guest-compose-count">{voice.status === "recording" ? "Recording…" : voice.status === "transcribing" ? "Transcribing…" : `${message.length}/180`}</span>
          <button className="guest-send" type="submit" aria-label="Send note" disabled={sending || avatarBusy || !canSubmit || voice.status !== "idle" || !message.trim()}><ArrowUp size={19} /></button>
        </div>
        {voiceNotice && <p className="guest-voice-notice" role="status">{voiceNotice}</p>}
        {status === "ready" && !canSubmit && <p className="guest-result">The book isn’t accepting notes just yet. <a href="mailto:adegboyeopeyemi065@gmail.com">Send me a hello by email</a> in the meantime.</p>}
        {status === "error" && <p className="guest-result" data-error="true">The book couldn’t load. <button type="button" onClick={() => load()}>Try again</button></p>}
        {result?.error && <div className="guest-toast" data-error="true" role="alert">{result.text}<button type="button" aria-label="Dismiss notification" onClick={() => setResult(null)}><X size={16} /></button></div>}
      </form>
    </section>
    </dialog>
    <section id="a-small-note" className="personal-section guest-guidelines"><p>Notes appear on the wall as soon as you send them. No ads, links, or private details, please. Just a little of you.</p><p>Want to talk about a project instead? <a className="personal-text-link" href="mailto:adegboyeopeyemi065@gmail.com">Let’s talk <ArrowUpRight size={14} aria-hidden="true" /></a></p></section>
  </PersonalPageShell>;
}
