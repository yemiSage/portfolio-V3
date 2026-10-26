import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowUp, Plus, ImagePlus, Mic, Square, X } from "lucide-react";
import { isVoiceInputSupported, useVoiceInput } from "./useVoiceInput";
import PersonalPageShell from "./PersonalPageShell";

const SECTIONS = [["the-wall", "The wall"], ["leave-a-note", "Leave a note"], ["a-small-note", "A small note"]];
const COLORS = { peach: "#fff0e5", lavender: "#f0edff", sage: "#ecf3ed", butter: "#fff8d9", paper: "#f3f3f5" };
const formatDate = value => new Date(value).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export default function GuestbookPage({ onOpenAiChat }) {
  const composer = useRef(null);
  const avatarInput = useRef(null);
  const [voiceNotice, setVoiceNotice] = useState("");
  const [voiceSupported] = useState(isVoiceInputSupported);
  const voice = useVoiceInput({
    onText: text => { setMessage(current => (current.trim() ? `${current.trim()} ${text}` : text).slice(0, 180)); setVoiceNotice("Review your words, then press Send when ready."); },
    onError: setVoiceNotice,
  });
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState("host");
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
      setNotes(data.notes); setCanSubmit(data.canSubmit); setStatus("ready");
    } catch (e) { if (e.name !== "AbortError") setStatus("error"); }
  };
  useEffect(() => { const controller = new AbortController(); load(controller.signal); return () => controller.abort(); }, []);
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => setResult(null), 5000);
    return () => clearTimeout(timer);
  }, [result]);
  const allNotes = [{ id: "host", name: "Yemi, your host", message: "The internet is a big place. I’m glad our paths crossed here.", color: "peach" }, ...notes];
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
      setActiveNote(data.note.id);
      setNotes(current => [data.note, ...current.filter(note => note.id !== data.note.id)].slice(0, 100));
      setResult({ text: "Your note is on the wall. Thanks for stopping by!", error: false });
      setName(""); setMessage(""); setAvatar(null);
      composer.current?.close();
      requestAnimationFrame(() => {
        document.getElementById("the-wall")?.scrollIntoView({ block: "start" });
        requestAnimationFrame(() => document.getElementById(`pin-${data.note.id}`)?.focus({ preventScroll: true }));
      });
    } catch (e) { setResult({ text: e.message || "Could not connect. Please try again.", error: true }); }
    finally { setSending(false); }
  };
  return <PersonalPageShell page="guestbook" sections={SECTIONS} onOpenAiChat={onOpenAiChat}>
    <div className="guest-wall-header"><h1>Postal my wall</h1><span>{status === "loading" ? "Opening the book…" : `${notes.length} ${notes.length === 1 ? "published note" : "published notes"}`}</span></div>
    <section id="the-wall" className="guest-wall personal-section">
      <div className="guest-notes-grid" role="list" aria-label="Guestbook notes">
        {allNotes.map((note, index) => <div role="listitem" key={note.id} style={{ "--pin-color": ["#8c42e8", "#317adf", "#d86536", "#2e956f"][index % 4] }}>
          <button type="button" className="guest-comment-pin" id={`pin-${note.id}`} aria-label={`Read note from ${note.name}`} aria-expanded={activeNote === note.id} aria-controls={`comment-${note.id}`} onClick={() => setActiveNote(current => current === note.id ? null : note.id)}>{note.avatar ? <img src={note.avatar} alt="" /> : note.name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase()}</button>
          <article hidden={activeNote !== note.id} className="guest-comment-panel" id={`comment-${note.id}`} tabIndex={-1} aria-label={`Note from ${note.name}`}>
            <div className="guest-comment-author"><span className="guest-comment-avatar">{note.avatar ? <img src={note.avatar} alt="" /> : note.name[0].toUpperCase()}</span><strong>{note.name}</strong>{note.createdAt && <time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>}</div>
            <p>{note.message}</p>
          </article>
        </div>)}
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
