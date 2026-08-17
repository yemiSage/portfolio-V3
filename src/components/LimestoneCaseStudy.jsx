import CaseStudyShell, { BulletList, CaseStudySection } from "./CaseStudyShell";

const sections = [
  ["overview", "Overview"], ["role", "My role"], ["problem", "Problem statement"],
  ["goals", "Goals"], ["process", "Process"], ["key-flows", "Key product flows"],
  ["decisions", "Key decisions"], ["results", "Results"], ["takeaways", "Takeaways"],
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
  offline: ["https://res.cloudinary.com/dv7yvatu2/image/upload/q_auto,f_auto/v1770799109/Offline_2_i3jbth.png", "https://res.cloudinary.com/dv7yvatu2/image/upload/q_auto,f_auto/v1770799108/offline_1_w3zblp.png"],
  dashboard: "https://res.cloudinary.com/dv7yvatu2/image/upload/q_auto,f_auto/v1770799108/Image_lhrcrd.png",
};

export default function LimestoneCaseStudy() {
  return (
    <CaseStudyShell sections={sections} projectName="Limestone" date="March 2024" className="limestone-case-study">
      <header className="case-study-intro">
        <h1>Designed a smart community platform for safer, simpler, connected living.</h1>
        <p className="case-study-lede">Lifestyle, real estate and community management in one dependable mobile experience.</p>
        <div className="case-study-meta-grid" aria-label="Project details">
          <div><span>Client</span><strong>Limestone Technologies</strong></div>
          <div><span>Industry</span><strong>Community, Real Estate</strong></div>
          <div><span>Services</span><strong>User research<br />UI design (mobile, web)<br />Design system</strong></div>
          <div><span>Date</span><strong>March 2024</strong></div>
          <div><span>Live site</span><a href="https://play.google.com/store/apps/details?id=com.limestone.community&hl=en-US&pli=1" target="_blank" rel="noreferrer">View on Google Play</a></div>
        </div>
      </header>

      <CaseStudySection id="overview" eyebrow="Overview" title="Empowering safer and more connected residential communities">
        <p>My Limestone is a community management platform designed for residential estates. It helps residents manage visitor access, utility payments, emergency alerts and communication with estate managers from one place.</p>
        <p>Bringing these services into a single mobile experience improves security coordination while making everyday community tasks easier for residents.</p>
        <figure className="case-study-hero-image"><img src={media.hero} alt="My Limestone mobile application shown on a blue background" /></figure>
        <video className="case-study-video" controls muted playsInline preload="metadata" poster={media.hero}><source src={media.video} type="video/mp4" /></video>
      </CaseStudySection>

      <CaseStudySection id="role" eyebrow="My Role" title="Working across the product from research to shipped flows"><BulletList><li>Redesigned key tenant and property-management flows to improve usability.</li><li>Designed and shipped Offline Check-in for communities with unreliable internet.</li><li>Worked with product managers and engineers to refine complex workflows.</li><li>Improved the information architecture and resident onboarding experience.</li></BulletList></CaseStudySection>

      <CaseStudySection id="problem" eyebrow="Problem Statement" title="Managing essential community services with unreliable connectivity"><p>Residential estates increasingly rely on digital systems, but unreliable internet can disrupt the moments where residents and security teams need those systems most.</p><BulletList><li>Guest check-ins could fail at the gate when a connection dropped.</li><li>Emergency alerts were slow or difficult to reach.</li><li>Onboarding depended too heavily on estate managers.</li><li>Important services were scattered across separate workflows.</li></BulletList></CaseStudySection>

      <CaseStudySection id="goals" eyebrow="The Goal" title="Make the essential journeys faster, clearer and more reliable"><BulletList><li>Allow security teams to check in guests even without internet.</li><li>Let residents create accounts and request estate access themselves.</li><li>Make the panic alert immediately accessible and location aware.</li><li>Bring daily community tools into one understandable dashboard.</li></BulletList></CaseStudySection>

      <CaseStudySection id="process" eyebrow="The Process" title="Redesigning the resident workflows that mattered most"><p>I mapped the complete resident journey, reviewed the highest-friction tasks and worked with the product and engineering teams to balance resident clarity with estate-management requirements.</p><div className="case-study-process-line" aria-label="Design process"><span>Audit</span><i aria-hidden="true" /><span>Map flows</span><i aria-hidden="true" /><span>Prototype</span><i aria-hidden="true" /><span>Validate</span><i aria-hidden="true" /><span>Ship</span></div></CaseStudySection>

      <CaseStudySection id="key-flows" eyebrow="Key Product Flows" title="Simplifying onboarding, estate access and emergency response">
        <div className="case-study-flow-copy"><div><h3>Resident onboarding</h3><p>The new flow lets residents sign up, enter an estate code and request access for verification, reducing administrative work.</p></div><div><h3>Panic alert</h3><p>A one-tap emergency action alerts security teams and emergency contacts with the resident’s real-time location.</p></div></div>
        <div className="case-study-phone-grid case-study-phone-grid-four">{media.onboarding.map((image, index) => <img key={image} src={image} alt={`My Limestone onboarding screen ${index + 1}`} loading="lazy" />)}</div>
        <figure className="case-study-wide-media case-study-panic-media"><img src={media.panic} alt="My Limestone panic alert experience" loading="lazy" /></figure>
        <div className="case-study-flow-copy case-study-flow-copy-spaced"><div><h3>Offline check-in</h3><p>Residents generate QR guest passes that security personnel can scan without an active connection. Data synchronises when the device reconnects.</p></div></div>
        <div className="case-study-phone-grid case-study-phone-grid-two">{media.offline.map((image, index) => <img key={image} src={image} alt={`Offline guest check-in screen ${index + 1}`} loading="lazy" />)}</div>
        <figure className="case-study-wide-media"><img src={media.dashboard} alt="My Limestone estate security dashboard" loading="lazy" /></figure>
      </CaseStudySection>

      <CaseStudySection id="decisions" eyebrow="Key Design Decisions" title="Design choices that made the system more resilient"><BulletList><li>Simplified onboarding and tenant workflows around the actions residents understood.</li><li>Used an offline-first access model for a security-critical gate experience.</li><li>Reorganised navigation and content hierarchy around everyday community tasks.</li><li>Reduced property-manager complexity without removing the detail they needed.</li></BulletList></CaseStudySection>
      <CaseStudySection id="results" eyebrow="Impact" title="A more dependable experience for residents and security teams"><BulletList><li>Visitor check-ins continue during connectivity outages.</li><li>Residents can complete onboarding without manager-led account creation.</li><li>Emergency alerts are easier to find and send with location context.</li><li>Community services are organised within one consistent dashboard.</li></BulletList></CaseStudySection>
      <CaseStudySection id="takeaways" eyebrow="Conclusion" title="Takeaways & Next Steps"><p>The most rewarding part of the work was treating unreliable connectivity as a product condition, not an edge case. Offline Check-in and the redesigned Panic Alert made the experience safer and more useful in real community settings.</p><p>Adoption and resident feedback improved after launch. The next step is to keep refining the QR experience and expand the platform’s safety features as more communities come online.</p></CaseStudySection>
    </CaseStudyShell>
  );
}
