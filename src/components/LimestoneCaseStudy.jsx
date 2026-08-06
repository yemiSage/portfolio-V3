import { useEffect, useState } from "react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";

const portraitImage = "/portfolio-logo.svg";

const sections = [
  ["overview", "Overview"],
  ["background", "Background"],
  ["role", "My role"],
  ["problem", "Problem statement"],
  ["goals", "Goals"],
  ["process", "Process"],
  ["key-flows", "Key product flows"],
  ["offline-checkin", "Offline check-in"],
  ["results", "Results"],
  ["decisions", "Key decisions"],
  ["takeaways", "Takeaways"],
];

const media = {
  hero: "https://res.cloudinary.com/dv7yvatu2/image/upload/q_auto,f_auto/v1770125887/Container_qndsnc.png",
  video: "https://framerusercontent.com/assets/DUr5y4hxZrnm6SVKq8X882qBzKQ.mp4",
  onboarding: [
    "https://framerusercontent.com/images/RuhVGUvBDvB4t7Vni1jmyFkEpk.png",
    "https://framerusercontent.com/images/huYdWBA7mflVrWvP0QN2xJmtz0.png",
    "https://framerusercontent.com/images/RQmfFd2UhQ2bL6wf6E37BKcuqU.png",
    "https://framerusercontent.com/images/ZMk2eaGVXbk5BXXxkaSkoRbOQ.png",
  ],
  panic: "https://framerusercontent.com/images/tIIOMHreqUtnssP6WMYNKRrBo.png",
  offline: [
    "https://res.cloudinary.com/dv7yvatu2/image/upload/q_auto,f_auto/v1770799109/Offline_2_i3jbth.png",
    "https://res.cloudinary.com/dv7yvatu2/image/upload/q_auto,f_auto/v1770799108/offline_1_w3zblp.png",
  ],
  dashboard: "https://res.cloudinary.com/dv7yvatu2/image/upload/q_auto,f_auto/v1770799108/Image_lhrcrd.png",
};

function BulletList({ children }) {
  return <ul className="case-study-list">{children}</ul>;
}

function CaseStudySection({ id, eyebrow, title, children, className = "" }) {
  return (
    <section className={`case-study-section ${className}`.trim()} id={id}>
      <div className="case-study-section-heading">
        <p>{eyebrow}</p>
      </div>
      <h2>{title}</h2>
      <div className="case-study-section-body">{children}</div>
    </section>
  );
}

export default function LimestoneCaseStudy() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    window.scrollTo(0, 0);

    const observedSections = sections
      .map(([id]) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) setActiveSection(visibleEntry.target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.15, 0.5] },
    );

    observedSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="case-study-page">
      <aside className="case-study-rail" aria-label="Limestone case study navigation">
        <div className="case-study-rail-top">
          <a className="case-study-avatar" href="/" aria-label="Return to portfolio home">
            <img src={portraitImage} alt="Opeyemi Adegboye" />
          </a>
        </div>

        <nav className="case-study-index" aria-label="Sections on this page">
          <a className="case-study-index-back" href="/#work">
            <ArrowLeft2 size={18} color="currentColor" variant="Linear" aria-hidden="true" />
            <span>Back to projects</span>
          </a>
          {sections.map(([id, label]) => (
            <a
              key={id}
              className={activeSection === id ? "is-active" : ""}
              href={`#${id}`}
              aria-current={activeSection === id ? "location" : undefined}
            >
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="case-study-rail-meta">
          <p>Product design case study</p>
          <span>March 2024</span>
        </div>
      </aside>

      <article className="case-study-content">
        <header className="case-study-intro" id="overview">
          <h1>Designing a smart community platform for safer, simpler, connected living</h1>
          <p className="case-study-lede">Lifestyle, real estate and community management in one dependable mobile experience.</p>

          <div className="case-study-tags" aria-label="Project categories">
            <span>Mobile app</span>
            <span>Community</span>
            <span>Security</span>
            <span>Real estate</span>
          </div>

          <div className="case-study-meta-grid" aria-label="Project details">
            <div><span>Client</span><strong>Limestone Technologies</strong></div>
            <div><span>Services</span><strong>User research, UI design</strong></div>
            <div><span>Timeline</span><strong>March 2024</strong></div>
            <div>
              <span>Live link</span>
              <a href="https://play.google.com/store/apps/details?id=com.limestone.community&hl=en-US&pli=1" target="_blank" rel="noreferrer">View Site</a>
            </div>
          </div>

          <figure className="case-study-hero-image">
            <img src={media.hero} alt="My Limestone mobile application shown on a blue background" />
          </figure>
        </header>

        <CaseStudySection
          id="background"
          eyebrow="Background"
          title="Empowering safer and more connected residential communities"
        >
          <p>
            My Limestone is a community management platform designed for residential estates. It helps
            residents manage visitor access, utility payments, emergency alerts and communication with
            estate managers from one place.
          </p>
          <p>
            Bringing these services into a single mobile experience improves security coordination while
            making everyday community tasks easier for residents.
          </p>
          <video className="case-study-video" controls muted playsInline preload="metadata" poster={media.hero}>
            <source src={media.video} type="video/mp4" />
          </video>
        </CaseStudySection>

        <CaseStudySection id="role" eyebrow="My role" title="Working across the product from research to shipped flows">
          <BulletList>
            <li>Redesigned key tenant and property-management flows to improve usability.</li>
            <li>Designed and shipped Offline Check-in for communities with unreliable internet.</li>
            <li>Worked with product managers and engineers to refine complex workflows.</li>
            <li>Improved the information architecture and resident onboarding experience.</li>
          </BulletList>
        </CaseStudySection>

        <CaseStudySection
          id="problem"
          eyebrow="Problem statement"
          title="Managing essential community services with unreliable connectivity"
        >
          <p>
            Residential estates increasingly rely on digital systems, but unreliable internet can disrupt
            the moments where residents and security teams need those systems most.
          </p>
          <BulletList>
            <li>Guest check-ins could fail at the gate when a connection dropped.</li>
            <li>Emergency alerts were slow or difficult to reach.</li>
            <li>Onboarding depended too heavily on estate managers.</li>
            <li>Important services were scattered across separate workflows.</li>
          </BulletList>
        </CaseStudySection>

        <CaseStudySection id="goals" eyebrow="Goals" title="Make the essential journeys faster, clearer and more reliable">
          <div className="case-study-goal-grid">
            <article><h3>Work offline</h3><p>Allow security teams to check in guests even without internet.</p></article>
            <article><h3>Reduce friction</h3><p>Let residents create accounts and request estate access themselves.</p></article>
            <article><h3>Support emergencies</h3><p>Make the panic alert immediately accessible and location aware.</p></article>
            <article><h3>Unify services</h3><p>Bring daily community tools into one understandable dashboard.</p></article>
          </div>
        </CaseStudySection>

        <CaseStudySection id="process" eyebrow="Process" title="Redesigning the resident workflows that mattered most">
          <p>
            I mapped the complete resident journey, reviewed the highest-friction tasks and worked with the
            product and engineering teams to balance resident clarity with estate-management requirements.
          </p>
          <div className="case-study-process-line" aria-label="Design process">
            <span>Audit</span><i aria-hidden="true" /><span>Map flows</span><i aria-hidden="true" /><span>Prototype</span><i aria-hidden="true" /><span>Validate</span><i aria-hidden="true" /><span>Ship</span>
          </div>
        </CaseStudySection>

        <CaseStudySection id="key-flows" eyebrow="Key product flows" title="Simplifying onboarding, estate access and emergency response">
          <div className="case-study-flow-copy">
            <div>
              <h3>Resident onboarding</h3>
              <p>
                Previously, estate managers manually created resident accounts. The new flow lets residents
                sign up, enter an estate code and request access for verification, reducing administrative work.
              </p>
            </div>
            <div>
              <h3>Panic alert</h3>
              <p>
                A one-tap emergency action alerts security teams and emergency contacts with the resident’s
                real-time location, making help easier to reach under pressure.
              </p>
            </div>
          </div>
          <div className="case-study-phone-grid case-study-phone-grid-four">
            {media.onboarding.map((image, index) => (
              <img key={image} src={image} alt={`My Limestone onboarding screen ${index + 1}`} loading="lazy" />
            ))}
          </div>
          <figure className="case-study-wide-media case-study-panic-media">
            <img src={media.panic} alt="My Limestone panic alert experience" loading="lazy" />
          </figure>
        </CaseStudySection>

        <CaseStudySection
          id="offline-checkin"
          eyebrow="Offline check-in"
          title="Keeping visitor access moving when the network fails"
        >
          <p>
            Residents generate QR guest passes that security personnel can scan without an active connection.
            Check-in data is stored locally and synchronised as soon as the device reconnects.
          </p>
          <div className="case-study-phone-grid case-study-phone-grid-two">
            {media.offline.map((image, index) => (
              <img key={image} src={image} alt={`Offline guest check-in screen ${index + 1}`} loading="lazy" />
            ))}
          </div>
          <figure className="case-study-wide-media">
            <img src={media.dashboard} alt="My Limestone estate security dashboard" loading="lazy" />
          </figure>
        </CaseStudySection>

        <CaseStudySection id="results" eyebrow="Results" title="A more dependable experience for residents and security teams">
          <div className="case-study-result-grid">
            <article><strong>Offline-ready</strong><p>Visitor check-ins continue during connectivity outages.</p></article>
            <article><strong>Self-service</strong><p>Residents can complete onboarding without manager-led account creation.</p></article>
            <article><strong>Faster response</strong><p>Emergency alerts are easier to find and send with location context.</p></article>
            <article><strong>Clearer system</strong><p>Community services are organised within one consistent dashboard.</p></article>
          </div>
          <div className="case-study-store-links">
            <a href="https://play.google.com/store/apps/details?id=com.limestone.community&hl=en-US&pli=1" target="_blank" rel="noreferrer">
              View on Google Play <ArrowRight2 size={17} color="currentColor" variant="Linear" />
            </a>
            <a href="https://apps.apple.com/ng/app/my-limestone/id6449851791" target="_blank" rel="noreferrer">
              View on the App Store <ArrowRight2 size={17} color="currentColor" variant="Linear" />
            </a>
          </div>
        </CaseStudySection>

        <CaseStudySection id="decisions" eyebrow="Key decisions" title="Design choices that made the system more resilient">
          <BulletList>
            <li>Simplified onboarding and tenant workflows around the actions residents understood.</li>
            <li>Used an offline-first access model for a security-critical gate experience.</li>
            <li>Reorganised navigation and content hierarchy around everyday community tasks.</li>
            <li>Reduced property-manager complexity without removing the detail they needed.</li>
          </BulletList>
        </CaseStudySection>

        <CaseStudySection id="takeaways" eyebrow="Takeaways" title="Designing for the moments where reliability matters most">
          <p>
            The most rewarding part of the work was treating unreliable connectivity as a product condition,
            not an edge case. Offline Check-in and the redesigned Panic Alert made the experience safer and
            more useful in real community settings.
          </p>
          <p>
            Adoption and resident feedback improved after launch. The next step is to keep refining the QR
            experience and expand the platform’s safety features as more communities come online.
          </p>
        </CaseStudySection>
      </article>
    </main>
  );
}
