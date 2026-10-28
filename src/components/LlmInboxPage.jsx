import { useRef, useState } from "react";
import "../llm-inbox.css";

export default function LlmInboxPage() {
  const accessKey = useRef("");
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  async function refresh(event) {
    event?.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/llm-inbox", {
        headers: { Authorization: `Bearer ${accessKey.current}` }, cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) setEntries(null);
        throw new Error(result.error || "Unable to load conversations.");
      }
      setEntries(result.entries);
      setUpdatedAt(new Date());
    } catch (cause) { setError(cause.message || "Unable to reach the inbox. Please try again."); }
    finally { setBusy(false); }
  }

  function lock() {
    accessKey.current = "";
    setEntries(null);
    setSearch("");
    setError("");
    setUpdatedAt(null);
  }

  const query = search.trim().toLowerCase();
  const visible = (entries || []).filter(entry => `${entry.question} ${entry.answer} ${entry.page}`.toLowerCase().includes(query));
  return <main className="llm-inbox">
    <a className="llm-back" href="/">← Back to portfolio</a>
    <header className="llm-inbox-heading">
      <div><p className="llm-eyebrow">PRIVATE · OWNER INBOX</p><h1>Conversations with yemiLLM</h1>
        <p>What visitors are asking, in their own words.</p></div>
      {entries !== null && <div className="llm-actions"><button onClick={refresh} disabled={busy}>{busy ? "Refreshing…" : "Refresh"}</button><button onClick={lock} disabled={busy}>Lock inbox</button></div>}
    </header>
    {error && <p className="llm-error" role="alert">{error}</p>}
    {entries === null ? <form className="llm-login" onSubmit={refresh}>
      <label htmlFor="llm-key">Owner access key</label>
      <input id="llm-key" type="password" autoComplete="current-password" required onChange={event => { accessKey.current = event.target.value; }} />
      <button type="submit" disabled={busy}>{busy ? "Opening…" : "Open inbox"}</button>
      <small>The key stays in memory for this visit. Reloading locks the inbox.</small>
    </form> : <>
      <section className="llm-toolbar" aria-label="Filter conversations">
        <div><strong>{entries.length} saved exchanges</strong><p>Latest 500 · Last 90 days{updatedAt && ` · Updated ${updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}</p></div>
        <label>Search conversations<input type="search" placeholder="Question, answer or page…" value={search} onChange={event => setSearch(event.target.value)} /></label>
      </section>
      <p className="llm-result-count" role="status">{visible.length} {visible.length === 1 ? "exchange" : "exchanges"}{query ? " matching your search" : ""}</p>
      {visible.length === 0 ? <div className="llm-empty"><h2>{query ? "No matching conversations" : "Your inbox is ready."}</h2><p>{query ? "Try a different word or page name." : "New visitor questions and answers will appear here after they chat with yemiLLM."}</p></div> : <div className="llm-exchanges">{visible.map(entry => <article key={entry.id} className="llm-exchange">
        <div className="llm-exchange-meta"><time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString()}</time><span>{entry.page || "/"}</span>{entry.status !== "complete" && <span>Partial response</span>}</div>
        <h2>{entry.question}</h2>
        <details><summary>Read yemiLLM’s answer</summary><p className="llm-answer">{entry.answer || "No answer was captured."}</p><small>{entry.source}</small></details>
      </article>)}</div>}
    </>}
  </main>;
}
