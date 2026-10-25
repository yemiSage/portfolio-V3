import { useRef, useState } from "react";
import { ArrowUpRight, X, ArrowRight } from "lucide-react";
import PersonalPageShell from "./PersonalPageShell";
import { ABOUT_JOURNEY, ABOUT_SECTIONS } from "../data/about";

export default function AboutPage({ onOpenAiChat }) {
  const dialog = useRef(null);
  const [photo, setPhoto] = useState(null);
  const viewPhoto = (src, alt) => { setPhoto({ src, alt }); dialog.current?.showModal(); };
  const capsule = (src, label, className = "") => <button className={`word-photo ${className}`} type="button" onClick={() => viewPhoto(src, label)} aria-label={`View photo: ${label}`}><img src={src} alt="" width="120" height="80" /><span aria-hidden="true">↗</span></button>;
  return <PersonalPageShell page="about" sections={ABOUT_SECTIONS} onOpenAiChat={onOpenAiChat}>
    <section id="hello" className="about-hero personal-section">
      <p className="personal-eyebrow"><span className="personal-tiny-star" aria-hidden="true">✳</span> THE PERSON BEHIND THE PIXELS</p>
      <h1>I’m Yemi {capsule("/about/portrait.png", "A portrait of Yemi", "word-photo--portrait")}.<br />An engineer’s mind.<br />A designer’s {capsule("/shots/shot-36.webp", "A glimpse of the Stayafrika interface")} eye.<br />A builder’s hands<span className="personal-accent">.</span></h1>
      <div className="about-intro-line"><span>DESIGN ENGINEER, PRODUCT & AI</span><span>LAGOS, NIGERIA ↗</span></div>
      <p className="about-lede">I like knowing how things work. I care even more about how they feel to the person using them.</p>
      <div className="about-prose"><p>I’m Adegboye Opeyemi. I started in electrical and electronics engineering, found my way into product design, and kept following that curiosity into code. These days, I design and build digital products across SaaS, marketplaces, and AI.</p><p>The part I enjoy most? Turning a complicated system into something that makes sense. Something useful. Something a real person can pick up and get on with their day.</p></div>
      <a href="#the-journey" className="personal-text-link">A little of the backstory <span aria-hidden="true">↓</span></a>
    </section>
    <section id="the-journey" className="personal-section about-journey">
      <div className="personal-section-label"><span>01 / THE JOURNEY</span><span>A FEW CHAPTERS, SO FAR</span></div>
      <h2>Different tools.<br />The same curiosity.</h2>
      {ABOUT_JOURNEY.map(item => <article className="about-chapter" key={item.year}>
        <div className="about-chapter-year"><span className="about-timeline-dot" />{item.year}</div>
        <div className="about-chapter-content"><h3>{item.title}</h3><p>{item.body}</p>
          <button className="about-photo-card" type="button" onClick={() => viewPhoto(item.image, item.alt)} aria-label={`View photo: ${item.alt}`}><img src={item.image} alt={item.alt} loading="lazy" width="680" height="520" /><span>{item.caption}<ArrowUpRight size={16} aria-hidden="true" /></span></button>
        </div>
      </article>)}
    </section>
    <section id="how-i-think" className="personal-section">
      <div className="personal-section-label"><span>02 / HOW I THINK</span><span>THE THINGS I COME BACK TO</span></div>
      <h2>Make it work.<br />Make it make sense.</h2>
      <div className="about-beliefs">{[
        ["01", "Purpose before polish.", "I start with the person, the problem, and the reason it matters. The beautiful interface comes from getting those things right."],
        ["02", "Design and build belong together.", "Engineering taught me to think in systems. Design taught me to look for the human in them. I bring both to the same conversation."],
        ["03", "Stay a student. Share what you learn.", "Teaching product design and working with different teams keeps me open. A good question can be more useful than a quick answer."],
      ].map(([n,title,body]) => <article key={n}><span>{n}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
    </section>
    <section id="off-the-clock" className="personal-section about-off-clock">
      <p className="about-word-story">Away from the pixels, you’ll find me at a tech meetup {capsule("/about/collaboration.png", "ProductHub Africa friends", "word-photo--wide")}, playing a little FIFA, singing, or putting a few words into a poem. I like good conversations, people who are curious, and figuring out what to make next<span className="personal-accent">.</span></p>
      <p className="about-small-note">And yes. Coffee, semo and results still keep me going.</p>
    </section>
    <section id="say-hello" className="personal-section about-invitation">
      <p className="personal-eyebrow">THANKS FOR GETTING TO KNOW ME</p><h2>Now, a little<br />about you<span className="personal-accent">?</span></h2><p>Leave a thought, a kind word, or just your name. I’d love to know you stopped by.</p>
      <div className="about-contact-actions"><a className="button button-primary about-guestbook-button" href="/guestbook">Leave a note in my guestbook <ArrowUpRight size={17} aria-hidden="true" /></a><a className="personal-text-link" href="mailto:adegboyeopeyemi065@gmail.com">Or start a conversation <ArrowRight size={15} aria-hidden="true" /></a></div>
    </section>
    <dialog className="personal-photo-dialog" aria-label="Photo viewer" ref={dialog} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}><button type="button" onClick={() => dialog.current.close()} aria-label="Close photo"><X size={22} /></button>{photo && <figure><img src={photo.src} alt={photo.alt} /><figcaption>{photo.alt}</figcaption></figure>}</dialog>
  </PersonalPageShell>;
}
