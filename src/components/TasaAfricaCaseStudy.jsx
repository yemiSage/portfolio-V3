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
  ["Profile", "The role-based profile architecture ensured that each persona could showcase relevant information without creating multiple disconnected experiences across the platform."],
  ["Matches", "The matches section allowed users to discover games, tournaments, and opportunities within the network. Athletes could track upcoming matches while scouts and academies could monitor player performance."],
  ["Settings", "Settings allowed users to manage profile information, privacy preferences, and notifications while controlling how their professional profile appeared."],
  ["Messages", "Messaging enabled athletes, scouts, coaches, and academies to discuss opportunities, trials, and collaborations directly within the platform."],
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
        <p>TASAfrica is a digital platform that helps athletes gain visibility, connect with scouts and academies, and discover career opportunities across the sports ecosystem. Similar to LinkedIn for professionals, it brings athletes, coaches, scouts, academies, and clubs into one unified network. When I joined, the product lacked structure and clarity. I redesigned the experience by simplifying core flows and building a scalable design system to support the platform’s growth.</p>
        <figure className="case-study-hero-image tasafrica-hero"><img src={hero} alt="TASAfrica sports talent discovery platform" /></figure>
      </CaseStudySection>

      <CaseStudySection id="role" eyebrow="My Role" title="Built a professional network for sports talent across Africa">
        <BulletList><li>Designed the core user experience, including athlete profiles, discovery flows, and verification features.</li><li>Led the multi-stakeholder experience for athletes, scouts, coaches, and academies.</li><li>Built and documented a scalable design system for consistent UI patterns.</li><li>Collaborated with developers and product stakeholders to translate goals into intuitive user journeys.</li></BulletList>
      </CaseStudySection>

      <CaseStudySection id="problem" eyebrow="Problem Statement" title="Designing one platform for four different user groups">
        <p>TASAfrica serves multiple personas:</p>
        <BulletList><li>Athletes looking for exposure and opportunities</li><li>Scouts searching for emerging talent</li><li>Coaches managing teams and player development</li><li>Academies promoting programs and recruiting players</li></BulletList>
        <p>Initially the platform treated every user the same. Without clear structure, users struggled to understand who the platform was primarily for, how they should interact, and what to do after joining.</p>
      </CaseStudySection>

      <CaseStudySection id="goals" eyebrow="The Goal" title="Create a professional sports network that:">
        <BulletList><li>Helps athletes showcase their talent and achievements</li><li>Enables scouts and academies to discover verified players</li><li>Encourages community interaction and engagement</li><li>Supports multiple user roles without overwhelming the interface</li><li>Builds a scalable V1 design system</li></BulletList>
      </CaseStudySection>

      <CaseStudySection id="process" eyebrow="The Process" title="Conducted 34+ interviews with prospective users">
        <p>Because the platform serves several types of users, understanding their motivations, pain points and needs was critical. Together with the product manager, we interviewed athletes, scouts, coaches, and academies to understand expectations, how talent discovery happens, and what scouts need when evaluating players.</p>
        <p>The research shaped the core product structure and feature priorities.</p>
        <div className="case-study-media-grid case-study-media-grid-two case-study-process-media"><FlowFigure image={initialExplorations} caption="Initial Explorations & Rejected Designs" /><FlowFigure image={revisedWireframes} caption="Revised User Flow Wireframes" /></div>
      </CaseStudySection>

      <CaseStudySection id="key-flows" eyebrow="Key Product Flows" title="Simplifying the Onboarding Experience">
        <p>Sports communities include users with varying technical familiarity and internet access. The lightweight onboarding flow lets users select their role early and complete their profile after entering the app, reducing friction and personalising the experience immediately.</p>
        <div className="case-study-media-grid case-study-media-grid-two"><FlowFigure image={roleSelection} caption="Role Selection Screen" /><FlowFigure image={personalInformation} caption="Personal Information Form" /><FlowFigure image={otpVerification} caption="OTP Authentication Verification" /><FlowFigure image={success} caption="Success Completion Screen" /></div>

        <div className="case-study-subsection"><h3>Homepage Experience</h3><p>Structured around discovery and clarity, the homepage helps users explore athlete videos, discover academies and opportunities, view high-performing talent, and move clearly between their feed, matches, and profile.</p></div>
        <div className="case-study-media-grid case-study-media-grid-two"><FlowFigure image={homepage} caption="The Discovery Homepage" contain /><FlowFigure image={talentCategories} caption="Discover Talent Categories" contain /></div>

        <div className="case-study-subsection"><h3>Community Interaction</h3><p>Beyond discovery, the platform acts as a social community where users share updates, achievements, video highlights, discussions, and direct engagement between talent and scouts.</p></div>
        <div className="case-study-media-grid case-study-media-grid-two"><FlowFigure image={communityFeed} caption="Community Activities Feed" contain /><FlowFigure image={postDetail} caption="User Post Detail View" contain /><FlowFigure image={videoHighlights} caption="Video Highlights Loop" contain /><FlowFigure image={engagementComments} caption="Engagement Discussions & Comments" contain /></div>

        <div className="case-study-subsection case-study-other-screens-section"><h3>Other Screens Designed (690+)</h3><div className="case-study-other-screens">{otherScreens.map(([name, description]) => <article key={name}><div><h4>{name}</h4><p>{description}</p></div><span>View Screens</span></article>)}</div></div>
      </CaseStudySection>

      <CaseStudySection id="decisions" eyebrow="Key Design Decisions" title="Improved clarity and usability across the platform"><BulletList><li>Built a robust design system for consistency and faster iterations.</li><li>Applied a mobile-first approach for regions where mobile is the primary device.</li><li>Designed athlete profiles around performance metrics and achievements.</li><li>Built discovery and filtering for scouts and academies.</li><li>Introduced verification indicators to increase trust and credibility.</li></BulletList></CaseStudySection>

      <CaseStudySection id="results" eyebrow="Impact" title="Improved clarity and usability across the platform"><p>The redesign transformed the platform into a clearer and more structured sports network by:</p><BulletList><li>Defining the platform&apos;s core identity</li><li>Simplifying user journeys</li><li>Improving talent visibility</li><li>Creating a unified experience across multiple personas</li><li>Making it easier for athletes to showcase their abilities and for scouts to discover emerging talent</li></BulletList></CaseStudySection>

      <CaseStudySection id="takeaways" eyebrow="Conclusion" title="Takeaways & Next Steps"><p>Working on TASAfrica was a memorable experience. I helped reshape the website, refine the product flow, and build a design system that made the platform clearer and more welcoming. Trust, authenticity, and simplicity guided the work.</p><p>Although the project was paused after management setbacks affected the cycle, it remains a highlight for me. It strengthened my craft and improved how I collaborate with product managers, testers, stakeholders, and engineers.</p></CaseStudySection>
    </CaseStudyShell>
  );
}
