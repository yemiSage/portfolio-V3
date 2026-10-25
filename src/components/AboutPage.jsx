import { useRef, useState } from "react";
import { ArrowUpRight, X, ArrowRight } from "lucide-react";
import AsciiPortrait from "./AsciiPortrait";
import PersonalPageShell from "./PersonalPageShell";
import { ABOUT_JOURNEY, ABOUT_SECTIONS } from "../data/about";
export default function AboutPage({ onOpenAiChat }) {
  const dialog = useRef(null);
  const [showPortraitPhoto, setShowPortraitPhoto] = useState(false);
  const [photo, setPhoto] = useState(null);
  const viewPhoto = (src, alt) => { setPhoto({ src, alt }); dialog.current?.showModal(); };
  const capsule = (src, label, className = "") => <button className={`word-photo ${className}`} type="button" onClick={() => viewPhoto(src, label)} aria-label={`View photo: ${label}`}><img src={src} alt="" width="120" height="80" /><span aria-hidden="true">↗</span></button>;
  return <PersonalPageShell page="about" sections={ABOUT_SECTIONS} onOpenAiChat={onOpenAiChat}>
    <div className="about-intro">
      <h1>An engineer’s mind.<br />A designer’s <span className="about-tool-icons" aria-label="Figma, Codex, Claude and VS Code">{[["figma", "Figma"], ["codex", "Codex"], ["claude", "Claude"], ["vscode", "VS Code"]].map(([icon, label]) => <img key={icon} src={`/icons/${icon}.svg`} alt={label} width="22" height="22" />)}</span> eye.</h1>
      <div className="about-intro-line"><span>DESIGN ENGINEER, PRODUCT & AI</span><span>LAGOS, NIGERIA ↗</span></div>
    </div>
    <section id="hello" className="about-hero personal-section">
      <div className="about-prose"><div><p>I’m Adboye Opeyemi. I started in electrical and electronics engineering, found my way into product design, and kept following that curiosity into code. These days, I design and build digital products across SaaS, marketplaces, and AI.</p><p>The part I enjoy most? Turning a complicated system into something that makes sense. Something useful. Something a real person can pick up and get on with their day.</p></div><button type="button" className="about-ascii-portrait" onClick={() => setShowPortraitPhoto(value => !value)} aria-pressed={showPortraitPhoto} aria-label={showPortraitPhoto ? "Show ASCII portrait" : "Show black-and-white portrait"}>{showPortraitPhoto ? <img className="portrait-monochrome" src="/about/portrait-cutout.png" alt="Black-and-white portrait of Yemi" width="320" height="320" /> : <AsciiPortrait src="/avatar.webp" alt="ASCII portrait of Yemi" hoverRadius={5} monochrome detailed />}</button></div>
    </section>
    <section id="the-journey" className="personal-section about-journey">
      <div className="case-study-section-heading"><p>The journey</p></div>
      <h2>Different tools.<br />The same curiosity.</h2>
      {ABOUT_JOURNEY.map(item => <article className="about-chapter" key={item.year}>
        <div className="about-chapter-year"><span className="about-timeline-dot" />{item.year}</div>
        <div className="about-chapter-content"><h3>{item.title}</h3><p>{item.body}</p>
          <button className="about-photo-card" type="button" onClick={() => viewPhoto(item.image, item.alt)} aria-label={`View photo: ${item.alt}`}><img src={item.image} alt={item.alt} loading="lazy" width="680" height="520" /></button>
        </div>
      </article>)}
    </section>
    <section id="how-i-think" className="personal-section">
      <div className="case-study-section-heading"><p>How I think</p></div>
      <h2>Make it work.<br />Make it make sense.</h2>
      <div className="about-beliefs">{[
        ["01", "Purpose before polish.", "I start with the person, the problem, and the reason it matters. The beautiful interface comes from getting those things right."],
        ["02", "Design and build belong together.", "Engineering taught me to think in systems. Design taught me to look for the human in them. I bring both to the same conversation."],
        ["03", "Stay a student. Share what you learn.", "Teaching product design and working with different teams keeps me open. A good question can be more useful than a quick answer."],
      ].map(([n,title,body]) => <article key={n}><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
    </section>
    <section id="off-the-clock" className="personal-section about-off-clock">
      <p className="about-word-story">Away from the pixels, you’ll find me at a tech meetup {capsule("/about/collaboration.png", "ProductHub Africa friends", "word-photo--wide")}, playing a little FIFA, singing, or putting a few words into a poem. I like good conversations, people who are curious, and figuring out what to make next<span className="personal-accent">.</span></p>
    </section>
    <section id="say-hello" className="personal-section about-invitation">
      <h2>Now, a little<br />about you<span className="personal-accent">?</span></h2><p>Leave a thought, a kind word, or just your name. I’d love to know you stopped by.</p>
      <div className="about-contact-actions"><a className="button button-primary about-guestbook-button" href="/guestbook">Leave a note in my guestbook <ArrowUpRight size={17} aria-hidden="true" /></a><a className="personal-text-link" href="mailto:adegboyeopeyemi065@gmail.com">Or start a conversation <ArrowRight size={15} aria-hidden="true" /></a></div>
    </section>
    <dialog className="personal-photo-dialog" aria-label="Photo viewer" ref={dialog} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}><button type="button" onClick={() => dialog.current.close()} aria-label="Close photo"><X size={22} /></button>{photo && <figure><img src={photo.src} alt={photo.alt} className={photo.src === "/avatar.webp" ? "portrait-monochrome" : undefined} /><figcaption>{photo.alt}</figcaption></figure>}</dialog>
  </PersonalPageShell>;
}
