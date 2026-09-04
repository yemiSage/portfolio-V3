export const YEMI_SYSTEM_INSTRUCTION = `You are "askYemi" (also known as Yemi LLM or YemiAI), an intelligent, highly articulate, and deeply authentic AI assistant representing Opeyemi Adegboye ("Yemi" or "yemiSage").

YOUR ROLE & IDENTITY:
- You speak as Yemi's interactive portfolio assistant. Your voice is thoughtful, craft-oriented, pragmatic, warm, empathetic, and deeply human-centered.
- Maintain a tone that is solution-driven, curious, caring, and open, reflecting Yemi's actual personality.
- Always be structured, engaging, and clear. Avoid generic, hype-driven "AI jargon" (don't use words like "supercharge" or "empower"). Speak with professional composure.

WHO IS OPEYEMI ADEGBOYE ("YEMI")?
- Title: Digital Product Designer & UI/UX Designer who codes (with over 4 years of experience).
- Tagline: "I design clear, intentional experiences for complex products, B2B, SaaS, marketplaces, and AI systems, balancing user needs with business goals."
- Core Philosophy: Simplicity, technical feasibility, and inclusivity. Yemi believes good design makes things easier for people to understand. Simple design is often harder because it requires knowing what *not* to include.
- Background: From a creative childhood (writing poetry, singing, rapping, recording songs in Lagos studios, and reading Shakespeare like "Hamlet" and "The Tempest") to desiring Electrical Engineering, Yemi entered design out of financial necessity in his 3rd university year. He learned digital marketing, built landing pages, funnels, and websites, which introduced him to UI/UX.
- Tech Stack: Figma (design systems, auto-layout, interactive prototypes), HTML, CSS, JavaScript, React, Google AI Studio, Antigravity, and Claude.
- Contact Email: adegboyeopeyemi065@gmail.com
- Resume: Interactive portfolio section at /resume.

CORE PROJECTS & PROBLEM-SOLVING CASE STUDIES:

1. Limestone App (Case Study available at /projects/limestone):
   - The Problem: Offline check-in bottlenecks at gated estates. When there was no internet connection, security personnel couldn't retrieve visitor gate pass data, leaving guests waiting.
   - The Research & Solution: Yemi interviewed homeowners, recognized the constraint, and engineered a QR-code offline verification system. He carefully prioritized only the absolute essential visitor data that could fit within a QR code, designed a consent and expectation-setting flow so residents knew they wouldn't get real-time alerts until the estate synced back online, and set up automatic database synchronization.
   - Outcome: Redefined how the team approached constraints, turning technical limits into transparent user design.

2. TASAfrica (Case Study available at /projects/tasafrica):
   - The Problem: Connecting African youth sports talents with international scouts securely and transparently.
   - The Solution: Built a tournament creation, registration, and discovery platform with a comprehensive design system. Included verification workflows to protect young athletes and frame-by-frame scout analytics for tactical video highlights.

3. Xeruit Talent:
   - The Problem: AI-powered recruitment onboarding and CV analysis complexity for both candidates and recruiters.
   - The Solution: Shipped an AI hiring OS with automated candidate matching, recruiter discovery pipelines, CV analysis, and recruiter scorecard reviews.
   - Outcome: Reached approximately 3,000 active users in its first month.

4. Mecar:
   - Yemi's first major design gig! A mobility and automotive app designed to find nearby mechanics when cars break down. Designed alongside a Nigerian developer, an Indian developer, and a product owner. Yemi looks back at this project as proof of how much his visual standards and system standards have matured since he started.

5. Afternoon Prep:
   - A UK-based education technology platform for IELTS, CELPIP, and SSCE exam preparation. Yemi joined midway after the previous designer left. He took ownership of both the public experience and the complex administrative backend systems used for publishing content, boosting his confidence to take over and lead complex systems.

OTHER CONTRIBUTIONS & WORK EXPERIENCE:
- StayAfrika: Travel & hospitality marketplace connecting users to African accommodation and local stays.
- SoluDesks: B2B operations, support, and team learning SaaS platform.
- FlxFleet: Canadian fleet operations, driver booking, logistics, and real-time package tracking.
- Norocio (2026, In development): Cross-border stablecoin & multi-currency payments fintech.
- Feexeet: Local service marketplace connecting people with verified local home service pros.
- Fisíkóló & MedBay: Digital healthcare portals focusing on accessibility and trust.
- The Ark: Faith community platform available on the Google Play Store.

COMMUNITY, EDUCATION, & MENTORSHIP:
- Mentorship is a massive part of Yemi's identity. He enjoys EdTech because he loves teaching.
- Programs Manager & Volunteer UI Designer at ProductHub Africa.
- Facilitated product design cohorts for Women Techsters (facilitated, taught Figma, UX research, and practical workflows for 100+ students).
- Teaching Philosophy: Teach students "how to think", not just how to run Figma. Focus on the *why* behind design principles like Hick's Law and Fitts's Law.

HOW TO RESPOND:
- If asked about projects, talk about TASAfrica, Limestone, Xeruit, Mecar, and Afternoon Prep with specific, high-fidelity context from their stories. Provide markdown links like [View TASAfrica Case Study](/projects/tasafrica) or [View Limestone Case Study](/projects/limestone).
- If asked about childhood, tell them about his passion for music (singing/rapping/studio recordings), literature (Shakespeare), and how he wanted to be an Electrical Engineer before university third-year freelancing led him to UI/UX.
- If asked about his design process, highlight the 5-step problem solving framework: Understand -> Define -> Research & Explore -> Prototype -> Test & Iterate.
- Keep responses engaging, and maintain Yemi's solution-driven, empathetic voice. Avoid long walls of text; use bullets and paragraphs.`;

export function getSmartPortfolioReply(query: string = ""): string {
  const q = query.toLowerCase().trim();

  // Inspiration & motivation
  if (
    q.includes("inspire") ||
    q.includes("motivation") ||
    q.includes("driven") ||
    q.includes("why do you") ||
    q.includes("passion")
  ) {
    return "I am driven by deep curiosity and a solution-driven mindset. I naturally ask 'why' and want to understand the reasoning behind systems. I draw inspiration from everyday challenges and love taking messy, intricate domain complexities—like gated community security handoffs or sports scout video analysis—and turning them into simple, elegant workflows where users feel completely in control.";
  }

  // Personal childhood / Background story
  if (
    q.includes("childhood") ||
    q.includes("grow up") ||
    q.includes("personal background") ||
    q.includes("music") ||
    q.includes("sing") ||
    q.includes("rap") ||
    q.includes("literature") ||
    q.includes("shakespeare") ||
    q.includes("engineer")
  ) {
    return "Growing up, I was highly creative and expressive! Music was one of my strongest early passions—I sang, rapped, wrote poetry and song lyrics, and even recorded tracks in a Lagos studio. Although I was a science student aiming to become an **Electrical & Electronics Engineer**, I had a strong love for literature (especially Shakespeare's *Hamlet* and *The Tempest*). \n\nI’ve always existed between those two worlds: logic and artistic exploration. While I didn't plan on design originally, my creative and analytical instincts found their perfect home when I transitioned to product design in university.";
  }

  // How did he start / get into design
  if (
    q.includes("how did you start") ||
    q.includes("get into design") ||
    q.includes("first project") ||
    q.includes("learn design") ||
    q.includes("pluralcode") ||
    q.includes("marketing") ||
    q.includes("freelance")
  ) {
    return "During my third year at university, I needed to support myself financially, which led me into freelancing. I experimented with digital marketing, sales funnels, WordPress, GetResponse, and Klaviyo. Designing pages for marketing naturally sparked my curiosity about how users interact with pages.\n\nTo formalize my self-taught skills, I completed a UI/UX Design diploma at **PluralCode Africa** in Lagos. That's where I built my foundation in design systems and interface thinking, and where a classmate referred me to my very first team project: **Mecar** (a mobility app matching stranded car owners with mechanics).";
  }

  // Design process & workflow
  if (
    q.includes("process") ||
    q.includes("workflow") ||
    q.includes("how do you design") ||
    q.includes("methodology") ||
    q.includes("approach") ||
    q.includes("framework")
  ) {
    return "My problem-solving framework is highly pragmatic and collaborative:\n\n1. **Understand**: Dive deep into whether a problem is primarily a business problem, user problem, or technical constraint.\n2. **Define**: Establish clear product goals and prioritized criteria.\n3. **Explore & Research**: Study competitors, analyze UX patterns, and gather peer feedback to build design rationale.\n4. **Prototype**: Translate insights into scalable, beautiful Figma components.\n5. **Test & Iterate**: Gather feedback from engineers, product managers, and users (testing with a focus group of 3-5 users) to refine the solution before release.";
  }

  // Favorite parts / passions
  if (
    q.includes("favorite") ||
    q.includes("love about design") ||
    q.includes("parts of design") ||
    q.includes("enjoy most")
  ) {
    return "My favorite part of design is **navigating real-world constraints**. Projects like Limestone's offline gate access taught me that technical limitations aren't roadblocks—they are opportunities to design transparent, inclusive, and clever solutions. I also deeply enjoy the collaborative spirit of working with developers to ensure designs are perfectly feasible.";
  }

  // Unique / Why hire Yemi / Differentiators
  if (
    q.includes("unique") ||
    q.includes("differentiator") ||
    q.includes("stand out") ||
    q.includes("why hire") ||
    q.includes("special")
  ) {
    return "What makes me unique is my **technical awareness and business mindset**. Having foundational knowledge of HTML, CSS, JS, and React means I design within the boundaries of reality. I don't just hand off pretty Figma files; I collaborate directly with engineers to ship lightweight, production-ready interfaces that balance user needs with business conversion metrics.";
  }

  // TASAfrica
  if (
    q.includes("tasafrica") ||
    q.includes("sport") ||
    q.includes("scout") ||
    q.includes("athlete") ||
    q.includes("tournament")
  ) {
    return "For **TASAfrica**, I designed a secure tournament and athletic discovery system. It connects young sports talent in Africa with international scouts and clubs through verified registration workflows, safety-oriented verification, and frame-by-frame scout tactical video highlights.\n\nRead the complete case study: **[View TASAfrica Case Study](/projects/tasafrica)**.";
  }

  // Limestone
  if (
    q.includes("limestone") ||
    q.includes("estate") ||
    q.includes("security") ||
    q.includes("gate") ||
    q.includes("offline") ||
    q.includes("qr code")
  ) {
    return "For **Limestone App**, I designed an offline-capable gated estate security system. \n\nWhen internet connections failed at security checkpoints, visitor gate codes caused massive delays. I researched with residents and designed an offline QR-code verification pass. To solve the technical data limitations of QR codes, I prioritized essential check-in fields, designed clear expectation-setting alerts for residents, and built an automated syncing strategy when connection returns.\n\nRead the complete case study: **[View Limestone Case Study](/projects/limestone)**.";
  }

  // Xeruit
  if (
    q.includes("xeruit") ||
    q.includes("hiring") ||
    q.includes("recruit") ||
    q.includes("hiring os")
  ) {
    return "For **Xeruit Talent**, I designed an AI-powered hiring operating system. I took ownership of the candidate onboarding flows, automated CV analysis, recruiter discovery pipelines, and candidate scorecard reviews, which successfully acquired approximately **3,000 active users** within its first month.";
  }

  // Afternoon Prep
  if (
    q.includes("afternoonprep") ||
    q.includes("afternoon prep") ||
    q.includes("ielts") ||
    q.includes("exam") ||
    q.includes("education") ||
    q.includes("edtech")
  ) {
    return "For **Afternoon Prep** (a UK-based exam preparation platform for IELTS/CELPIP/SSCE), I stepped in midway after the previous designer left. I took ownership of designing both the consumer-facing practice dashboards and the complex administrative content-authoring systems used to manage and publish questions. This experience built my confidence in tackling complex backend tools and fostered my love for EdTech!";
  }

  // Teaching / Mentoring
  if (
    q.includes("teach") ||
    q.includes("mentor") ||
    q.includes("student") ||
    q.includes("women techsters") ||
    q.includes("producthub") ||
    q.includes("community")
  ) {
    return "Mentorship is a huge part of who I am! I’ve taught and mentored **over 100 students** through cohorts like **Women Techsters** and as a volunteer Programs Manager at **ProductHub Africa**. \n\nMy teaching philosophy is to show students *how to think* and why design principles like Fitts's Law or Hick's Law matter in real-world products, rather than just teaching them to click buttons in Figma. EdTech remains one of my absolute favorite sectors because of this!";
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
    return "I would love to connect with you! You can reach me directly via:\n\n*   **Email**: [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com)\n*   **WhatsApp**: [+234 912 254 6487](https://wa.me/2349122546487)\n*   **LinkedIn**: [Opeyemi Adegboye](https://www.linkedin.com/in/opeyemiadegboyeazeez/)\n\nI am currently available for full-time product design roles, design system contracts, and strategic consulting assignments.";
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
    return "My toolkit crosses design and frontend code:\n\n*   **Design Systems & Prototyping**: Figma (advanced auto-layout, tokens), Adobe Illustrator, Photoshop, Miro, FigJam.\n*   **Frontend Development**: HTML, CSS, JavaScript, React, Tailwind CSS, Vite, Git, VS Code.\n*   **AI & Automation**: Google AI Studio, Claude, Antigravity, n8n, Zapier.";
  }

  // Other projects (StayAfrika, SoluDesks, FlxFleet, Norocio)
  if (
    q.includes("stayafrika") ||
    q.includes("soludesks") ||
    q.includes("flxfleet") ||
    q.includes("norocio") ||
    q.includes("feexeet")
  ) {
    return "Here are a few other systems I have worked on:\n\n*   **StayAfrika**: A marketplace for travel stays and local tourism experiences across Africa.\n*   **SoluDesks**: A robust B2B SaaS platform for administrative learning, team support, and operations.\n*   **FlxFleet**: A Canadian logistics, fleet management, and real-time tracking application.\n*   **Norocio**: A multi-currency, cross-border stablecoin payments platform (currently in development).\n*   **Feexeet**: A local service marketplace connecting homeowners with verified local pros.";
  }

  // Resume
  if (q.includes("resume") || q.includes("cv") || q.includes("experience") || q.includes("background")) {
    return "You can explore my interactive career path on the **[Resume](/resume)** page of my portfolio, or download the official PDF. It captures over four years of product design impact across fintech, edtech, healthtech, and logistics.";
  }

  // Default helpful overview
  return "Hi! I'm **Yemi LLM**, Opeyemi's portfolio assistant. Yemi is a **Product Designer Who Codes** who blends a rich creative background (ranging from writing poetry and Shakespearian literature to recording studio music) with engineering-focused design.\n\nWhat can I tell you about him? Ask me about:\n*   His **childhood, music, and how he got into design**.\n*   His problem-solving case studies: **[TASAfrica](/projects/tasafrica)** and **[Limestone](/projects/limestone)**.\n*   His passion for **teaching, mentoring**, or his experiences with **Xeruit AI** or **Afternoon Prep**.\n*   Or find out how to **hire him**!";
}
