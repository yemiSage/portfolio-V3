export const YEMI_SYSTEM_INSTRUCTION = `You are "askYemi" (also known as Yemi LLM or YemiAI), an intelligent, articulate, and friendly AI assistant living inside the portfolio of Opeyemi Adegboye (also known as "Yemi" or "yemiSage").

YOUR ROLE & IDENTITY:
- You speak as Yemi's interactive portfolio assistant. You represent Opeyemi Adegboye's professional voice: thoughtful, craft-oriented, pragmatic, and passionate about product design and front-end engineering.
- When answering, be concise, engaging, and well-structured. Use clean formatting, bullet points, and bold text for readability. Avoid bloated rambling.

WHO IS OPEYEMI ADEGBOYE ("YEMI")?
- Title: Digital Product Designer & UI/UX Designer who codes.
- Tagline: "Need a Professional Product Designer Who Codes?" / "I design clear, intentional experiences for complex products, from B2B, B2C and SaaS platforms to marketplaces, AI-integrated systems, and operational products, balancing user needs with business goals."
- Core Philosophy: Designing with real-world engineering constraints in mind. Bridging the gap between Figma design systems and robust production code to create intuitive, conversion-driving, high-usability products.
- Contact Email: adegboyeopeyemi065@gmail.com
- Resume: Available on the portfolio (viewable directly on the site or downloadable as a PDF).

CORE FEATURED PROJECTS:
1. TASAfrica (Case Study available):
   - Scope: Scalable design system and discovery flows connecting African sports talent with international scouts and clubs.
   - Tags: AI, Sport, Social, Analytics.
   - Key Work: Designed talent categories, video highlights with frame-by-frame scout analytics, community feed, and onboarding/verification workflows.
   - Direct link: /projects/tasafrica

2. Limestone App (Case Study available):
   - Scope: High-security community living platform for gated estates and B2B residential complexes.
   - Tags: Community, Security, Real Estate, B2B.
   - Key Work: Solved gate bottlenecks with offline check-ins, instant panic alerts, clear resident-to-security workflows, and admin dashboards.
   - Direct link: /projects/limestone

3. Xeruit Talent:
   - Scope: AI hiring operating system connecting verified tech and creative talent with global recruiters.
   - Tags: AI, Hiring, SaaS, B2B.
   - Key Work: Recruiter discovery pipelines, talent vetting interfaces, automated candidate matching.

NOTABLE CONTRIBUTED PROJECTS:
- Norocio (2026, In development): Cross-border payments platform for global transfers, multi-currency accounts, and stablecoin.
- Stayafrika (2026): Travel marketplace for discovering stays, local experiences, and travel services across Africa.
- Soludesks (2026): B2B SaaS platform for managing team learning, support, attendance, and business operations.
- Feexeet (2026): Service marketplace connecting homeowners and businesses with verified service professionals.
- Flxfleet (2025): Canadian logistics platform for moving, delivery, driver booking, and real-time tracking.
- AfternoonPrep (2025): UK-based education platform for exam preparation, student practice, and analytics.
- The Ark (2025): Faith community app for connection, Bible study, and social sharing (available on Google Play Store).

TOOLBOX & TECHNICAL SKILLS:
- Design: Figma (Design systems, auto-layout, token management, interactive prototypes), Adobe Illustrator, Photoshop, Miro.
- AI & Modern Tools: Google AI Studio, Antigravity, Claude, OpenAI/Codex, Prompt Engineering, UI AI integration.
- Engineering & Web: HTML5, CSS3, JavaScript, React, Tailwind CSS, VS Code, Git, WordPress.
- Collaboration: Notion, Trello, Microsoft Suite, Agile sprints.

HOW TO RESPOND:
- If asked about projects, highlight TASAfrica, Limestone, and Xeruit, and mention what problem each solved. Provide clickable markdown links like [View TASAfrica Case Study](/projects/tasafrica) or [View Limestone Case Study](/projects/limestone) where relevant.
- If asked about hiring or contacting Yemi, provide his direct email (adegboyeopeyemi065@gmail.com) and mention he is available for full-time, contract, or design consulting roles.
- If asked about his design process, highlight: Research & Discovery -> Problem Framing -> Wireframing & Prototyping -> Design Systems & Polish -> Engineering Handoff / Code Collaboration.
- If asked a question unrelated to design, tech, or Yemi, gently bring the conversation back to Yemi's portfolio and capabilities.`;

export function getSmartPortfolioReply(query: string = ""): string {
  const q = query.toLowerCase().trim();

  // Inspiration & motivation
  if (
    q.includes("inspire") ||
    q.includes("inspiration") ||
    q.includes("motivated") ||
    q.includes("drive you")
  ) {
    return "I find inspiration in ambitious people who are highly intentional about what they do. Surrounding myself with that kind of energy really pushes me to do better work. I also draw inspiration from everyday challenges I see around me and the desire to create meaningful experiences through design and technology.";
  }

  // Design process & workflow
  if (
    q.includes("process") ||
    q.includes("workflow") ||
    q.includes("how do you design") ||
    q.includes("methodology") ||
    q.includes("approach")
  ) {
    return "My design process is structured around five practical phases:\n\n1. **Research & Discovery**: Deep dive into user friction points, market context, and business goals.\n2. **Problem Framing**: Defining explicit problem statements and scope before pushing pixels.\n3. **Rapid Prototyping**: Exploring wireframes and interactive flows early in Figma.\n4. **Design Systems & Polish**: Building modular component tokens with auto-layout and high visual craft.\n5. **Engineering Collaboration**: Writing front-end code (React/Tailwind) to ensure 1:1 production fidelity and zero handoff surprises.";
  }

  // Favorite parts / passions
  if (
    q.includes("favorite") ||
    q.includes("love about design") ||
    q.includes("parts of design") ||
    q.includes("enjoy most")
  ) {
    return "My favorite part of design is taking messy, intricate domain complexities—like gated community security handoffs or sports scout video analysis—and turning them into simple, elegant workflows where users feel completely in control.";
  }

  // Unique / Why hire Yemi / Differentiators
  if (
    q.includes("unique") ||
    q.includes("differentiator") ||
    q.includes("stand out") ||
    q.includes("why hire") ||
    q.includes("special")
  ) {
    return "What makes my approach unique is **bridging the gap between product design and engineering**. As a designer who codes, I design with technical feasibility, component modularity, performance, and operational constraints in mind from day one—cutting down engineering iterations and design debt.";
  }

  // TASAfrica
  if (
    q.includes("tasafrica") ||
    q.includes("sport") ||
    q.includes("scout") ||
    q.includes("athlete")
  ) {
    return "For **TASAfrica**, Yemi designed a scalable design system and discovery platform connecting African sports talent with international scouts and clubs.\n\n*   **Talent Discovery**: Tailored athlete profiles categorized by sport and discipline.\n*   **Scout Analytics**: Video highlights with frame-by-frame tactical evaluations.\n*   **Community & Verification**: Onboarding verification to protect young athletes.\n\nRead the complete case study: **[View TASAfrica Case Study](/projects/tasafrica)**.";
  }

  // Limestone
  if (
    q.includes("limestone") ||
    q.includes("estate") ||
    q.includes("security") ||
    q.includes("gate") ||
    q.includes("community app")
  ) {
    return "For **Limestone App**, Yemi designed a comprehensive community living platform for gated estates and residential complexes.\n\n*   **Access Control**: Solved gate bottlenecks with rapid offline check-in codes.\n*   **Safety**: Instant panic alerts directly routing to security desks.\n*   **Operations**: Streamlined resident-to-admin communications and utility management.\n\nRead the complete case study: **[View Limestone Case Study](/projects/limestone)**.";
  }

  // Xeruit
  if (
    q.includes("xeruit") ||
    q.includes("hiring") ||
    q.includes("recruit")
  ) {
    return "For **Xeruit Talent**, Yemi designed an AI-powered operating system connecting verified tech and creative talent with global recruiters. Key elements include recruiter discovery pipelines, talent vetting interfaces, automated candidate matching, and candidate scorecards.";
  }

  // Contact / Hire / Email
  if (
    q.includes("contact") ||
    q.includes("email") ||
    q.includes("hire") ||
    q.includes("reach") ||
    q.includes("touch") ||
    q.includes("available") ||
    q.includes("call")
  ) {
    return "You can reach Yemi directly via:\n\n*   **Email**: [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com)\n*   **WhatsApp**: [+234 912 254 6487](https://wa.me/2349122546487)\n*   **LinkedIn**: [Opeyemi Adegboye](https://www.linkedin.com/in/opeyemiadegboyeazeez/)\n\nYemi is open to full-time product design roles, design system contracts, and consulting engagements!";
  }

  // Tools & Tech Stack
  if (
    q.includes("tool") ||
    q.includes("stack") ||
    q.includes("software") ||
    q.includes("figma") ||
    q.includes("tech") ||
    q.includes("code") ||
    q.includes("languages")
  ) {
    return "Yemi's toolkit spans both design and modern front-end code:\n\n*   **Design & Systems**: Figma (advanced auto-layout, token management, interactive prototypes), Adobe Illustrator, Photoshop, Miro.\n*   **Front-End Engineering**: HTML5, CSS3, JavaScript, React, Tailwind CSS, Vite, Git, VS Code.\n*   **AI Tooling**: Google AI Studio, Claude, Antigravity, Prompt Engineering.\n*   **Collaboration**: Notion, Trello, Agile sprint workflows.";
  }

  // Resume
  if (q.includes("resume") || q.includes("cv") || q.includes("experience") || q.includes("background")) {
    return "You can view Yemi's interactive credentials directly on the portfolio by opening the **[Resume](/resume)** section, or download his official PDF resume. It details his product design impact across SaaS, FinTech, and B2B platforms.";
  }

  // Projects overview
  if (
    q.includes("project") ||
    q.includes("work") ||
    q.includes("portfolio") ||
    q.includes("case stud")
  ) {
    return "Yemi's portfolio features several notable platforms:\n\n*   **[TASAfrica Case Study](/projects/tasafrica)** — Sports discovery & scouting platform\n*   **[Limestone App Case Study](/projects/limestone)** — High-security estate & residential living software\n*   **Xeruit Talent** — AI tech & creative hiring OS\n*   **Norocio** — Cross-border multi-currency fintech platform\n*   **Stayafrika** — Pan-African travel and experience marketplace\n*   **Soludesks** — B2B operations and learning management system\n\nAsk about any of these for specific design details!";
  }

  // Default helpful overview
  return "I'm **Yemi LLM**, Opeyemi's portfolio assistant! Yemi is a **Product Designer Who Codes**, creating clear, intentional digital experiences for complex B2B, B2C, SaaS, and AI products.\n\nFeel free to ask about his design process, tools, or explore his featured case studies:\n*   **[TASAfrica](/projects/tasafrica)** (sports scouting)\n*   **[Limestone App](/projects/limestone)** (estate security)\n*   Or reach him directly at [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com)!";
}
