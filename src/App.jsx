import {
  ArrowDown,
  Instagram,
  Sms,
  Whatsapp,
} from "iconsax-reactjs";

import portraitImage from "../assets/figma/portrait.png";
import tasafricaImage from "../assets/figma/tasafrica.png";
import limestoneImage from "../assets/figma/limestone.png";
import xeruitImage from "../assets/figma/xeruit.png";
import figmaLogo from "../assets/figma/figma.svg";
import htmlCssLogo from "../assets/figma/html-css.svg";
import wordpressLogo from "../assets/figma/wordpress.svg";
import miroLogo from "../assets/figma/miro.svg";
import illustratorLogo from "../assets/figma/adobe-illustrator.svg";
import msSuiteLogo from "../assets/figma/ms-suite.svg";
import photoshopLogo from "../assets/figma/photoshop.svg";
import notionLogo from "../assets/figma/notion.svg";
import trelloLogo from "../assets/figma/trello.svg";
import googleAiLogo from "../assets/figma/google-ai.svg";
import antigravityLogo from "../assets/figma/antigravity.png";
import codexLogo from "../assets/figma/codex.svg";
import vsCodeLogo from "../assets/figma/vs-code.svg";
import claudeLogo from "../assets/figma/claude.svg";

const projects = [
  {
    name: "Soludesks Inc.",
    image: tasafricaImage,
    tags: ["Networking", "Sport", "Social Media"],
    description:
      "Built a scalable design system and discovery flows that connect African talent with global scouts.",
  },
  {
    name: "Limestone App",
    image: limestoneImage,
    tags: ["Networking", "Sport", "Social Media"],
    description:
      "Built a scalable design system and discovery flows that connect African talent with global scouts.",
  },
  {
    name: "Xeruit Talent",
    image: xeruitImage,
    tags: ["AI", "Hiring", "SAAS", "B2B"],
    description:
      "Built a scalable design system and discovery flows that connect African talent with global scouts.",
  },
];

const tools = [
  ["Figma", figmaLogo],
  ["HTML and CSS", htmlCssLogo],
  ["Wordpress", wordpressLogo],
  ["Miro", miroLogo],
  ["Adobe Illustrator", illustratorLogo],
  ["MS Suite", msSuiteLogo],
  ["Photoshop", photoshopLogo],
  ["Notion", notionLogo],
  ["Trello", trelloLogo],
  ["Google AI Studio", googleAiLogo],
  ["Antigravity", antigravityLogo],
  ["Codex", codexLogo],
  ["VS Code", vsCodeLogo],
  ["Claude", claudeLogo],
];

function SocialLink({ href, label, children }) {
  return (
    <a className="social-link" href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {children}
    </a>
  );
}

function Project({ project }) {
  return (
    <article className="project-card">
      <div className="project-copy">
        <div>
          <div className="project-tags" aria-label="Project categories">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <h3>{project.name}</h3>
        </div>
        <p>{project.description}</p>
      </div>
      <img
        className="project-visual"
        src={project.image}
        alt={`${project.name} product interface`}
      />
    </article>
  );
}

function App() {
  return (
    <main className="portfolio" id="top" data-node-id="3549:1194">
      <div className="portfolio-grid">
        <aside className="identity-column" aria-label="Introduction">
          <div className="identity-main">
            <a className="portrait" href="#top" aria-label="Back to the top">
              <img src={portraitImage} alt="Opeyemi Adegboye" />
            </a>

            <div className="intro-stack">
              <div className="intro-copy">
                <div className="intro-heading">
                  <p className="greeting">Hi 👋, i’m Yemi.</p>
                  <h1>UI/UX Engineer</h1>
                </div>
                <p className="intro-description">
                  I turn complex product ideas into clear, useful experiences user enjoy coming back to. I
                  don’t just think design, I think business.
                </p>
              </div>

              <div className="button-row">
                <a className="button button-primary" href="mailto:adegboyeopeyemi065@gmail.com">
                  Contact Me
                </a>
              </div>
            </div>
          </div>

          <div className="availability">
            <p className="find-me">Find me on</p>
            <div className="social-row">
              <SocialLink href="https://wa.me/2349122546487" label="WhatsApp">
                <Whatsapp size={20} color="currentColor" variant="Linear" />
              </SocialLink>
              <SocialLink href="https://www.instagram.com/ope_yemi066/" label="Instagram">
                <Instagram size={20} color="currentColor" variant="Linear" />
              </SocialLink>
              <SocialLink href="mailto:adegboyeopeyemi065@gmail.com" label="Email">
                <Sms size={20} color="currentColor" variant="Linear" />
              </SocialLink>
            </div>
          </div>
        </aside>

        <section className="content-column" aria-label="Portfolio content">
          <section className="hero-panel" aria-labelledby="designing-heading">
            <div className="hero-media" aria-label="Showreel placeholder" />
            <div className="hero-caption">
              <h2 id="designing-heading">Designing with clarity, building with intent.</h2>
              <a className="scroll-link" href="#work">
                <span>Scroll to explore</span>
                <ArrowDown size={24} color="currentColor" variant="Linear" />
              </a>
            </div>
          </section>

          <section className="projects" id="work" aria-label="Selected projects">
            {projects.map((project) => <Project key={project.name} project={project} />)}
          </section>

          <section className="toolbox" aria-labelledby="toolbox-heading">
            <div className="section-intro">
              <h2 id="toolbox-heading">My Tool Box</h2>
              <p>
                Over the course of four years now, i have found myself using these tools and making them
                part of my day to day activities.
              </p>
            </div>
            <ul className="tool-grid">
              {tools.map(([name, logo]) => (
                <li key={name} data-tool={name}>
                  <img src={logo} alt="" />
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </section>

          <footer className="footer">
            <p className="footer-statement">
              Define purpose, <em>solve problems,</em> set scope and <em>achieve goals</em> - let&apos;s
              make magic together
            </p>
            <nav className="footer-nav" aria-label="Footer navigation">
              <h2>Explore</h2>
              <div className="footer-links">
                <div>
                  <a href="#top">Articles</a>
                  <a href="#work">Projects</a>
                  <a href="#top">About Me</a>
                  <a href="mailto:adegboyeopeyemi065@gmail.com?subject=Resume%20request">Resume</a>
                </div>
                <div>
                  <a href="https://www.instagram.com/ope_yemi066/" target="_blank" rel="noreferrer">Instagram</a>
                  <a href="https://www.linkedin.com/in/opeyemiadegboyeazeez/" target="_blank" rel="noreferrer">LinkedIn</a>
                  <a href="mailto:adegboyeopeyemi065@gmail.com">Email</a>
                  <a href="https://wa.me/2349122546487" target="_blank" rel="noreferrer">WhatsApp</a>
                </div>
              </div>
            </nav>
          </footer>
        </section>
      </div>
    </main>
  );
}

export default App;
