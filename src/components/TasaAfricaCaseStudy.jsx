import CaseStudyShell, { BulletList, CaseStudySection } from "./CaseStudyShell";
import hero from "../../assets/case-studies/tasafrica/hero.png";
import initialExplorations from "../../assets/case-studies/tasafrica/initial-explorations.png";
import revisedWireframes from "../../assets/case-studies/tasafrica/revised-wireframes.png";
import roleSelection from "../../assets/case-studies/tasafrica/role-selection.png";
import personalInformation from "../../assets/case-studies/tasafrica/personal-information.png";
import otpVerification from "../../assets/case-studies/tasafrica/otp-verification.png";
import success from "../../assets/case-studies/tasafrica/success.png";
import homepage from "../../assets/case-studies/tasafrica/homepage.png";
import talentCategories from "../../assets/case-studies/tasafrica/talent-categories.png";
import communityFeed from "../../assets/case-studies/tasafrica/community-feed.png";
import postDetail from "../../assets/case-studies/tasafrica/post-detail.png";
import videoHighlights from "../../assets/case-studies/tasafrica/video-highlights.png";
import engagementComments from "../../assets/case-studies/tasafrica/engagement-comments.png";

const sections = [
  ["overview", "Overview"], ["role", "My role"], ["problem", "Problem statement"],
  ["goals", "Goals"], ["process", "Process"], ["key-flows", "Key product flows"],
  ["decisions", "Key decisions"], ["results", "Results"], ["takeaways", "Takeaways"],
];

function FlowFigure({ image, caption, contain = false }) {
  return <figure className={`case-study-flow-figure${contain ? " is-contained" : ""}`}><div><img src={image} alt={caption} loading="lazy" /></div><figcaption>{caption}</figcaption></figure>;
}

const otherScreens = [
  ["Profile", "Different users, one flexible profile system", "An athlete’s profile should not look exactly like a scout’s or academy’s profile. I designed a role-based profile structure that changed the information shown depending on the user, while keeping the overall experience familiar. For athletes, that meant putting more focus on performance, achievements, videos, experience, and verification."],
  ["Matches", "Bring games and talent discovery closer together", "Matches gave users another way to discover what was happening across the network. Athletes could follow upcoming games and tournaments, while scouts, coaches, and academies could use match activity to keep track of players and teams."],
  ["Messages", "Move conversations from discovery to opportunity", "Once someone found the right athlete, scout, coach, or academy, they needed a simple way to continue the conversation. Messaging supported direct conversations around trials, recruitment, games, and other opportunities without leaving the platform."],
  ["Settings", "Give users control over their presence", "Settings covered the quieter parts of the product that still mattered. Users could manage profile details, notifications, privacy, and how their professional information appeared across the platform."],
];

export default function TasaAfricaCaseStudy() {
  return (
    <CaseStudyShell sections={sections} projectName="TASAfrica" date="March 2024" className="tasafrica-case-study">
      <header className="case-study-intro">
        <h1>Designed a mobile-first sports platform that helps athletes build visibility, connect with people in the sports ecosystem, and find better opportunities.</h1>
        <p className="case-study-lede">Designing a mobile-first sports platform that helps African athletes build visibility, connect with people in the sports ecosystem, and find better opportunities.</p>
        <div className="case-study-meta-grid" aria-label="Project details">
          <div><span>Client</span><strong>TASAfrica Sports</strong></div>
          <div><span>Industry</span><strong>Sports, Social Networking</strong></div>
          <div><span>Services</span><strong>User Research<br />UI Design (mobile, web)<br />Design System</strong></div>
          <div><span>Date</span><strong>March 2024</strong></div>
          <div><span>Live site</span><a href="https://app.tasafrica.com" target="_blank" rel="noreferrer">app.tasafrica.com</a></div>
        </div>
      </header>

      <CaseStudySection id="overview" eyebrow="Overview" title="Built a professional network for sports talent across Africa">
        <p>TASAfrica was built to help African athletes get seen, build credible profiles, and connect with scouts, coaches, clubs, and academies.</p>
        <p>Think of it as a professional network built around sports talent.</p>
        <p>When I joined, the idea was strong, but the product felt scattered. Different users had different needs, yet the experience treated everyone almost the same.</p>
        <p>I worked with the team to give the product more structure, simplify key flows, and create a design system that could grow with it.</p>
        <figure className="case-study-hero-image tasafrica-hero"><img src={hero} alt="TASAfrica sports talent discovery platform" /></figure>
      </CaseStudySection>

      <CaseStudySection id="role" eyebrow="My role" title="Helped shape the product from structure to final screens">
        <p>I led the UX across major parts of the platform and worked closely with the product manager, engineers, and other stakeholders.</p>
        <p>My work included:</p>
        <BulletList><li>Designing athlete profiles, discovery, matches, messaging, and verification flows</li><li>Shaping experiences for athletes, scouts, coaches, clubs, and academies</li><li>Creating and documenting the design system</li><li>Turning product ideas into clear user flows and interfaces</li><li>Working with engineers through handoff and implementation</li></BulletList>
        <p>By the end of the project, I had worked across <strong>690+ screens</strong> covering the main product experience.</p>
      </CaseStudySection>

      <CaseStudySection id="problem" eyebrow="Problem statement" title="One platform, several very different users">
        <p>TASAfrica had to work for people with very different goals.</p>
        <BulletList><li><strong>Athletes</strong> wanted exposure and career opportunities</li><li><strong>Scouts</strong> wanted an easier way to find and assess talent</li><li><strong>Coaches</strong> needed to manage players and follow development</li><li><strong>Academies and clubs</strong> wanted to promote programs and find players</li></BulletList>
        <p>The early product gave these users almost the same experience.</p>
        <p>That made the platform harder to understand. Users could join, but the next step wasn&apos;t always clear. Profiles also needed to show different information depending on who was using them.</p>
        <p>The challenge was building one connected product without making it feel crowded.</p>
      </CaseStudySection>

      <CaseStudySection id="goals" eyebrow="Goals" title="Make the platform easier to understand and use">
        <p>We wanted to create a sports network where users could quickly understand what they could do and where they should go next.</p>
        <p>The product needed to:</p>
        <BulletList><li>Help athletes show their skills, history, and achievements</li><li>Help scouts find and assess talent</li><li>Support different user roles within one product</li><li>Make discovery and interaction easier</li><li>Build trust through verified profiles</li><li>Create a design system the team could keep building on</li></BulletList>
      </CaseStudySection>

      <CaseStudySection id="process" eyebrow="Process" title="Spoke with 34+ prospective users">
        <p>Before pushing pixels, we needed to understand how people already discovered and assessed sports talent.</p>
        <p>Together with the product manager, we spoke with <strong>34+ athletes, scouts, coaches, and academy representatives</strong>.</p>
        <p>We asked about how athletes find opportunities, what scouts look for before contacting a player, what information builds trust, and where the current process tends to break down.</p>
        <p>Those conversations helped us decide what belonged in V1 and how the main parts of the product should connect.</p>
        <div className="case-study-subsection"><h3>Finding the right structure</h3><p>The first ideas went through several rounds.</p><p>Some flows asked for too much information too early. Others made the product feel like separate tools stitched together for different users.</p><p>We stripped those ideas back and focused on one shared system with role-based experiences where they mattered.</p></div>
        <div className="case-study-media-grid case-study-media-grid-two case-study-process-media"><FlowFigure image={initialExplorations} caption="Initial Explorations & Rejected Designs" /><FlowFigure image={revisedWireframes} caption="Revised User Flow Wireframes" /></div>
      </CaseStudySection>

      <CaseStudySection id="key-flows" eyebrow="Key product flows" title="Get users inside first, complete the profile later">
        <p>Sports communities include people with different levels of digital experience, devices, and internet access.</p>
        <p>So I kept onboarding light.</p>
        <p>Users selected their role early, entered the basic details needed to create an account, verified their identity, and could complete the rest of their profile once inside.</p>
        <p>This reduced the amount of work required before users could start exploring the product.</p>
        <div className="case-study-media-grid case-study-media-grid-two"><FlowFigure image={roleSelection} caption="Role Selection" /><FlowFigure image={personalInformation} caption="Personal Information" /><FlowFigure image={otpVerification} caption="OTP Verification" /><FlowFigure image={success} caption="Account Created" /></div>

        <div className="case-study-subsection"><h3>Make discovery the first thing users see</h3><p>The homepage became the centre of the experience. Users could discover athletes, watch highlights, find academies, see opportunities, and move into their feed, matches, or profile without digging through the interface.</p><p>The structure gave the product a clearer starting point and made important content easier to find.</p></div>
        <div className="case-study-media-grid case-study-media-grid-two"><FlowFigure image={homepage} caption="Discovery Homepage" contain /><FlowFigure image={talentCategories} caption="Talent Categories" contain /></div>

        <div className="case-study-subsection"><h3>Give athletes more ways to be seen</h3><p>A profile alone wasn&apos;t enough.</p><p>Athletes needed a place to share wins, match clips, updates, and progress over time. Scouts and other users also needed a way to react, comment, and start conversations.</p><p>So the product included a community feed built around sports content and interaction.</p></div>
        <div className="case-study-media-grid case-study-media-grid-two"><FlowFigure image={communityFeed} caption="Community Feed" contain /><FlowFigure image={postDetail} caption="Post Detail" contain /><FlowFigure image={videoHighlights} caption="Video Highlights" contain /><FlowFigure image={engagementComments} caption="Comments & Discussions" contain /></div>

        <div className="case-study-subsection case-study-other-screens-section"><h3>Other Screens Designed (690+)</h3><div className="case-study-other-screens">{otherScreens.map(([name, heading, description]) => <article key={name}><div><h4>{name}</h4><p><strong>{heading},</strong> {description}</p></div><span>View Screens</span></article>)}</div></div>
      </CaseStudySection>

      <CaseStudySection id="decisions" eyebrow="Key decisions" title="Decisions that shaped the final experience"><BulletList><li><strong>Mobile first:</strong> A large part of the target audience would access the platform from mobile devices, so the experience was designed around smaller screens first.</li><li><strong>Role-based profiles:</strong> Profiles changed based on who the user was, while still following the same visual and interaction system.</li><li><strong>Talent-focused discovery:</strong> Search and filtering helped scouts, coaches, clubs, and academies narrow down players instead of scrolling through a generic feed.</li><li><strong>Verification:</strong> Verification cues helped users understand which profiles had gone through the platform&apos;s checks.</li><li><strong>One design system:</strong> I built reusable components and patterns that gave the team a shared foundation for new screens and features.</li></BulletList></CaseStudySection>

      <CaseStudySection id="results" eyebrow="Results" title="Turned a scattered product into a clearer sports network"><p>The redesign gave TASAfrica a stronger structure across its main experiences.</p><p>We:</p><BulletList><li>Simplified how users joined and moved through the product</li><li>Made athlete profiles easier to understand</li><li>Gave scouts clearer ways to discover talent</li><li>Connected several user types within one experience</li><li>Created reusable patterns for future features</li><li>Built a mobile-first product that could work across different African user contexts</li></BulletList><p>The product eventually went live and supported athletes, coaches, clubs, and other users across the network.</p></CaseStudySection>

      <CaseStudySection id="takeaways" eyebrow="Takeaways" title="What the project taught me"><p>TASAfrica pushed me beyond designing individual screens.</p><p>I had to think about how several user types, features, and journeys could live inside one product without losing clarity.</p><p>I also worked closely with the PM, engineers, testers, and stakeholders through several rounds of decisions and iterations. That improved how I communicate design choices, defend what matters, and adjust when the product needs something different.</p><p>The project was later paused due to an internal management challenge, but the work remains one of the projects that shaped how I approach complex product design today.</p></CaseStudySection>
    </CaseStudyShell>
  );
}
