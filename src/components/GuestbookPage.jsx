import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import PersonalPageShell from "./PersonalPageShell";

const SECTIONS = [["the-wall", "The wall"], ["leave-a-note", "Leave a note"], ["a-small-note", "A small note"]];
const COLORS = { peach: "#fff0e5", lavender: "#f0edff", sage: "#ecf3ed", butter: "#fff8d9", paper: "#f3f3f5" };
const formatDate = value => new Date(value).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export default function GuestbookPage({ onOpenAiChat }) {
  const drag = useRef(null);
  const composer = useRef(null);
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
    if (sending) return;
    setSending(true); setResult(null);
    try {
      const response = await fetch("/api/guestbook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, message, color, website: new FormData(event.currentTarget).get("website") }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "That note could not be sent. Please try again.");
      setNotes(current => [data.note, ...current.filter(note => note.id !== data.note.id)].slice(0, 100));
      setResult({ text: "Your note is on the wall. Thanks for stopping by!", error: false });
      setName(""); setMessage("");
      composer.current?.close();
      document.getElementById("the-wall")?.scrollIntoView({ block: "start" });
    } catch (e) { setResult({ text: e.message || "Could not connect. Please try again.", error: true }); }
    finally { setSending(false); }
  };
  return <PersonalPageShell page="guestbook" sections={SECTIONS} onOpenAiChat={onOpenAiChat}>
    <section id="the-wall" className="guest-wall personal-section"><div className="guest-wall-header"><h2>Good company.</h2><span>{status === "loading" ? "Opening the book…" : `${notes.length} ${notes.length === 1 ? "published note" : "published notes"}`}</span></div>
      <div className="guest-wall-grid" role="region" aria-label="Guestbook notes. Drag or use arrow keys to explore." tabIndex={0}
        onPointerDown={event => {
          if (event.pointerType !== "mouse" || event.button !== 0) return;
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
        <article className="guest-note guest-owner-note" style={{ "--note-color": COLORS.peach }}><small>A NOTE FROM YOUR HOST</small><p>The internet is a big place. I’m glad our paths crossed here.</p><footer><span>Yemi, your host</span><span aria-hidden="true">↗</span></footer></article>
        {notes.map((note,index) => <article className="guest-note" key={note.id} style={{ "--note-color": COLORS[note.color] || COLORS.paper, "--note-tilt": `${[1.5,-1,2,-2][index%4]}deg` }}><p>{note.message}</p><footer><span>{note.name}</span><time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time></footer></article>)}
      </div>
    </section>
    <section id="leave-a-note" className="personal-section guest-open-composer">
      <button type="button" className="button button-primary" onClick={() => { setResult(null); composer.current?.showModal(); }}>Leave your note <ArrowUpRight size={17} aria-hidden="true" /></button>
      {result && !result.error && <p role="status" className="guest-result">{result.text}</p>}
    </section>
    <dialog className="guest-composer-dialog" ref={composer} aria-labelledby="guest-composer-heading" onClick={event => { if (event.target === composer.current) composer.current.close(); }}>
    <section className="guest-composer" aria-labelledby="guest-composer-heading">
      <div className="guest-composer-title"><h2 id="guest-composer-heading">A page in the book. Yours.</h2><button type="button" className="guest-composer-close" aria-label="Close note form" onClick={() => composer.current.close()}><X size={20} /></button></div>
      <form className="guest-form" onSubmit={submit}>
        <label>Your name<input name="name" autoComplete="nickname" value={name} onChange={e => setName(e.target.value)} maxLength={40} required placeholder="What should I call you?" /></label>
        <label><span className="guest-field-heading">Your note<span>{message.length}/180</span></span><textarea name="message" value={message} onChange={e => setMessage(e.target.value)} maxLength={180} minLength={2} required placeholder="I worked with Yemi and… Oh, Yemi is… I was here and…" /></label>
        <label className="guest-honeypot" aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <div className="guest-form-actions"><fieldset className="guest-colors"><legend>Pick your paper</legend>{Object.entries(COLORS).map(([value, hex]) => <label key={value}><input type="radio" name="color" value={value} checked={color === value} onChange={() => setColor(value)} aria-label={`${value} paper`} /><span className="guest-color-chip" style={{ "--note-color": hex }} /></label>)}</fieldset>
        <button className="button button-primary guest-submit" type="submit" disabled={sending || !canSubmit}>{sending ? "Sending your note…" : "Leave your note"}<ArrowUpRight size={17} aria-hidden="true" /></button></div>
        {status === "ready" && !canSubmit && <p className="guest-result">The book isn’t accepting notes just yet. <a href="mailto:adegboyeopeyemi065@gmail.com">Send me a hello by email</a> in the meantime.</p>}
        {status === "error" && <p className="guest-result" data-error="true">The book couldn’t load. <button type="button" onClick={() => load()}>Try again</button></p>}
        {result?.error && <p className="guest-result" data-error={result.error} role={result.error ? "alert" : "status"}>{result.text}</p>}
      </form>
    </section>
    </dialog>
    <section id="a-small-note" className="personal-section guest-guidelines"><p>Notes appear on the wall as soon as you send them. No ads, links, or private details, please. Just a little of you.</p><p>Want to talk about a project instead? <a className="personal-text-link" href="mailto:adegboyeopeyemi065@gmail.com">Let’s talk <ArrowUpRight size={14} aria-hidden="true" /></a></p></section>
  </PersonalPageShell>;
}
