import { useEffect, useRef, useState } from "react";
import CaseStudyShell, { CaseStudySection } from "./CaseStudyShell";
import {
  OverviewIllustration, BrandingIllustration, HomefindIllustration,
  MessagingIllustration, SchedulingIllustration, ListingIllustration,
} from "./StayafrikaFigures";
import "../stayafrika.css";
import "../stayafrika-figures.css";

const sections = [
  ["overview", "Overview"], ["branding", "White labelling"],
  ["homefind", "Property transactions"], ["messaging", "Custom messaging"],
  ["listings", "Shared listing patterns"], ["guests", "Bringing existing guests"],
  ["results", "Launch & reflection"], ["takeaways", "Takeaways"],
];

// The diagrams are native Figma layers at their authored size. Only the
// illustration canvas scales; the article text follows the site's breakpoints.
function ProductFigure({ height, label, children }) {
  const container = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 866));
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  return (
    <figure className="stay-product-figure" ref={container} role="img" aria-label={label}>
      <div className="stay-figure-viewport" style={{ height: height * scale }}>
        <div className="sf-native" aria-hidden="true" inert style={{ width: 866, height, transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </figure>
  );
}

function DesignDecision({ title, children }) {
  return <div className="stay-design-decision"><h3>{title}</h3><p>{children}</p></div>;
}

export default function StayafrikaCaseStudy({ onOpenAiChat }) {
  return (
    <CaseStudyShell sections={sections} projectName="StayAfrika" date="Dec 2025 – Aug 2026" className="stayafrika-case-study" onOpenAiChat={onOpenAiChat}>
      <header className="case-study-intro">
        <h1>Designing connected property experiences for StayAfrika</h1>
        <p className="case-study-lede">White labelling, property payments, custom messaging and familiar listing flows.</p>
        <div className="case-study-meta-grid" aria-label="Project details">
          <div><span>Client</span><strong>Private LLTDC</strong></div>
          <div><span>Team</span><strong>1 designer · 4 engineers · 1 PM</strong></div>
          <div><span>Role</span><strong>UI/UX Designer</strong></div>
          <div><span>Timeline</span><strong>Dec 2025 – Aug 2026</strong></div>
        </div>
      </header>

      <CaseStudySection id="overview" eyebrow="Overview" title="Different journeys. Different user personas. A familiar way through.">
        <p>StayAfrika brings together stays, homes, services and experiences. Behind those journeys are businesses managing properties, people hosting events, communicating with guests and keeping track of what happens next.</p>
        <ProductFigure height={515} label="StayAfrika property details with an image gallery, payment plan and inspection scheduling"><OverviewIllustration /></ProductFigure>
        <p>I handled the design thinking, user flows and UI/UX design for the features in this case study, working with 2 frontend engineers, 2 backend engineers and a product manager.</p>
        <div className="stay-contributions" aria-label="My contribution">
          {["Business identity", "Property transactions", "Guest communication", "Listing consistency"].map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}
        </div>
        <p>I started designing in December 2025. After beta testing with hired testers, the product launched around August 2026.</p>
      </CaseStudySection>

      <CaseStudySection id="branding" eyebrow="White labelling" title="Different businesses need an experience tailored to their work.">
        <p>For a property business, identity carries through the website, the listings and the messages guests receive. I designed the white-label setup around the assets that make that identity recognisable.</p>
        <ProductFigure height={476.914} label="Brand identity setup with logo, favicon, hero content and colour controls beside a website preview"><BrandingIllustration /></ProductFigure>
        <DesignDecision title="Making the result visible during setup">I placed the website preview beside the branding controls, so the business can see where its assets belong. The same controls remain available in settings when the brand needs an update.</DesignDecision>
      </CaseStudySection>

      <CaseStudySection id="homefind" eyebrow="Homefind, made for property owners and managers" title="Handling property payments transparently.">
        <p>A property purchase involves trust, a plan, an inspection and several steps before the paperwork is complete. I worked on the payment flow and its connection to messages, keeping the property and its progress in view.</p>
        <ProductFigure height={587.679} label="Payment plan selection connected to inspection, buyer review, guarantor verification, payment and legal documentation"><HomefindIllustration /></ProductFigure>
        <DesignDecision title="Connecting the transaction to the conversation">The message flow brings inspection details and transaction stages into the conversation. Buyers and managers have a property-specific place to see what comes next.</DesignDecision>
      </CaseStudySection>

      <CaseStudySection id="messaging" eyebrow="Custom messaging" title="Writing once, with room for the details that change.">
        <p>Hosts send many messages with the same purpose: confirming a booking, sharing arrival information or following up after a stay. I designed reusable templates with guest, trip and listing details that can change for each booking.</p>
        <ProductFigure height={488} label="Reusable guest message template with listing selection and scheduling controls"><MessagingIllustration /></ProductFigure>
        <ProductFigure height={638.402} label="Personalisation fields for guests, trips and listings, alongside message scheduling by booking event and listing time zone"><SchedulingIllustration /></ProductFigure>
        <DesignDecision title="Keeping content and delivery together">Hosts can attach a template to selected listings, add personal details and set its timing. Those controls stay close to the message they’re composing.</DesignDecision>
      </CaseStudySection>

      <CaseStudySection id="listings" eyebrow="Shared listing patterns" title="Different things to list. A familiar way to do it.">
        <p>Homes, Moments and Essentials each ask for different information. I worked on a shared structure for the listing experience, with familiar progress, question placement and navigation across categories.</p>
        <ProductFigure height={497} label="Shared business interface patterns with consistent selection, editing and save controls"><ListingIllustration /></ProductFigure>
        <DesignDecision title="Keeping the structure familiar">The surrounding pattern stays consistent while the questions respond to the category. A property needs room and location details; a service or experience needs a clear explanation of what guests will get.</DesignDecision>
      </CaseStudySection>

      <CaseStudySection id="guests" eyebrow="Bringing existing guests" title="Making room for the guests hosts already have.">
        <p>Some hosts already had their own guests before joining StayAfrika. We added CSV bulk upload so they could bring those guest details into the platform together.</p>
        <figure className="stay-csv-figure">
          <div className="stay-csv-scroll"><table><thead><tr><th>first_name</th><th>last_name</th><th>email</th></tr></thead><tbody><tr><td>Amina</td><td>Bello</td><td>amina@example.com</td></tr><tr><td>Tunde</td><td>Ade</td><td>tunde@example.com</td></tr></tbody></table></div>
          <figcaption>First name, last name and email. Illustrative CSV data.</figcaption>
        </figure>
      </CaseStudySection>

      <CaseStudySection id="results" eyebrow="Launch & reflection" title="From product flows to a live platform">
        <p>I designed StayAfrika from initial flows to launch, collaborating with 4 engineers and a product manager. The shipped experience connected business identity, property transactions, guest messaging and listing creation within one platform.</p>
        <p>Within around 2 months of launch, the platform had 36 businesses, including 22 active within the past month. These early adoption figures describe business participation; they do not isolate the impact of any one feature.</p>
      </CaseStudySection>
      <CaseStudySection id="takeaways" eyebrow="Takeaways" title="Designing the connections between the screens">
        <p>Across these features, I focused on what someone carries into the next step: a business’s identity, a property’s progress, the details in a message and a familiar way to create a listing.</p>
        <p>The work connected those moments across the product, from a host setting up their brand to bringing their existing guests onto StayAfrika.</p>
        <a className="stay-live-link" href="https://www.stayafrika.com" target="_blank" rel="noopener noreferrer">Visit StayAfrika ↗</a>
      </CaseStudySection>
    </CaseStudyShell>
  );
}
