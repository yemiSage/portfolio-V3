import {
  ArrowDown,
  Instagram,
  Sms,
  Whatsapp,
} from "iconsax-reactjs";

const asset = (name) => `/assets/figma/${name}`;

const projects = [
  {
    name: "Soludesks Inc.",
    image: asset("tasafrica.png"),
    tags: ["Networking", "Sport", "Social Media"],
    description:
      "Built a scalable design system and discovery flows that connect African talent with global scouts.",
  },
  {
    name: "Limestone App",
    image: asset("limestone.png"),
    tags: ["Networking", "Sport", "Social Media"],
    description:
      "Built a scalable design system and discovery flows that connect African talent with global scouts.",
  },
  {
    name: "Xeruit Talent",
    image: asset("xeruit.png"),
    tags: ["AI", "Hiring", "SAAS", "B2B"],
    description:
      "Built a scalable design system and discovery flows that connect African talent with global scouts.",
  },
];

const tools = [
  ["Figma", asset("figma.svg")],
  ["HTML and CSS", asset("html-css.svg")],
  ["Wordpress", asset("wordpress.svg")],
  ["Miro", asset("miro.svg")],
  ["Adobe Illustrator", asset("adobe-illustrator.svg")],
  ["MS Suite", asset("ms-suite.svg")],
  ["Photoshop", asset("photoshop.svg")],
  ["Notion", asset("notion.svg")],
  ["Trello", asset("trello.svg")],
  ["Google AI Studio", asset("google-ai.svg")],
  ["Antigravity", asset("antigravity.png")],
  ["Codex", asset("codex.svg")],
  ["VS Code", asset("vs-code.svg")],
  ["Claude", asset("claude.svg")],
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
              <img src={asset("portrait.png")} alt="Opeyemi Adegboye" />
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
