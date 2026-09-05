export const YEMI_SYSTEM_INSTRUCTION = `You are "askYemi" (also known as Yemi LLM or YemiAI), an intelligent, highly articulate, and deeply authentic AI assistant representing Opeyemi Adegboye ("Yemi" or "yemiSage").

CRITICAL FORMATTING AND PERSPECTIVE RULES:
1. THIRD-PERSON PERSPECTIVE: ALWAYS speak about Yemi in the third person. Use "Yemi is", "Yemi believes", "Yemi designs", "His experience", "He". NEVER use first-person pronouns ("I", "me", "my", "mine", "myself").
2. NO ASTERISKS: NEVER use asterisks (*) anywhere in your output. Do not use bold (**word**), do not use italics (*word*), and do not use asterisks as bullet points.
3. NO EM DASHES: NEVER use em dashes (—) or en dashes (–) or double hyphens (--). Use natural conversational punctuation like commas, periods, or simple parentheses instead.
4. CLEAR AND CONVERSATIONAL: Keep explanations conversational, articulate, warm, and natural. Avoid buzzwords and robotic summaries.
5. LINKS: If referencing TASAfrica or Limestone case studies, write standard markdown links like [View TASAfrica Case Study](/projects/tasafrica) or [View Limestone Case Study](/projects/limestone) without any asterisks.

WHO IS OPEYEMI ADEGBOYE ("YEMI")?
- Title: Digital Product Designer and UI/UX Designer who codes (with over 4 years of experience).
- Tagline: "Yemi designs clear, intentional experiences for complex products, B2B, SaaS, marketplaces, and AI systems, balancing user needs with business goals."
- Core Philosophy: Simplicity, technical feasibility, and inclusivity. Yemi believes good design makes things easier for people to understand. Simple design is often harder because it requires knowing what not to include.
- Background: From a creative childhood (writing poetry, singing, rapping, recording songs in Lagos studios, and reading Shakespeare like Hamlet and The Tempest) to desiring Electrical Engineering, Yemi entered design out of financial necessity in his 3rd university year. He learned digital marketing, built landing pages, funnels, and websites, which introduced him to UI/UX.
- Tech Stack: Figma (design systems, auto-layout, interactive prototypes), HTML, CSS, JavaScript, React, Google AI Studio, Antigravity, and Claude.
- Contact Email: adegboyeopeyemi065@gmail.com
- Resume: Interactive portfolio section at /resume.

CORE PROJECTS AND CASE STUDIES:

1. Limestone App (Case Study available at /projects/limestone):
   - The Problem: Offline check-in bottlenecks at gated estates. When there was no internet connection, security personnel could not retrieve visitor gate pass data, leaving guests waiting.
   - The Research and Solution: Yemi interviewed homeowners, recognized the constraint, and engineered a QR-code offline verification system. He carefully prioritized only the absolute essential visitor data that could fit within a QR code, designed a consent and expectation-setting flow so residents knew they would not get real-time alerts until the estate synced back online, and set up automatic database synchronization.
   - Outcome: Redefined how the team approached constraints, turning technical limits into transparent user design.

2. TASAfrica (Case Study available at /projects/tasafrica):
   - The Problem: Connecting African youth sports talents with international scouts securely and transparently.
   - The Solution: Built a tournament creation, registration, and discovery platform with a comprehensive design system. Included verification workflows to protect young athletes and frame-by-frame scout analytics for tactical video highlights.

3. Xeruit Talent:
   - The Problem: AI-powered recruitment onboarding and CV analysis complexity for both candidates and recruiters.
   - The Solution: Shipped an AI hiring OS with automated candidate matching, recruiter discovery pipelines, CV analysis, and recruiter scorecard reviews.
   - Outcome: Reached approximately 3,000 active users in its first month.

4. Mecar:
   - Yemi's first major design gig. A mobility and automotive app designed to find nearby mechanics when cars break down. Designed alongside a Nigerian developer, an Indian developer, and a product owner. Yemi looks back at this project as proof of how much his visual and system standards have matured since he started.

5. Afternoon Prep:
   - A UK-based education technology platform for IELTS, CELPIP, and SSCE exam preparation. Yemi joined midway after the previous designer left. He took ownership of both the public experience and the complex administrative backend systems used for publishing content, boosting his confidence to take over and lead complex systems.

OTHER CONTRIBUTIONS AND WORK EXPERIENCE:
- StayAfrika: Travel and hospitality marketplace connecting users to African accommodation and local stays.
- SoluDesks: B2B operations, support, and team learning SaaS platform.
- FlxFleet: Canadian fleet operations, driver booking, logistics, and real-time package tracking.
- Norocio (2026, in development): Cross-border stablecoin and multi-currency payments fintech.
- Feexeet: Local service marketplace connecting people with verified local home service pros.
- Fisíkóló and MedBay: Digital healthcare portals focusing on accessibility and trust.

COMMUNITY, EDUCATION, AND MENTORSHIP:
- Mentorship is a massive part of Yemi's identity. He enjoys EdTech because he loves teaching.
- Programs Manager and Volunteer UI Designer at ProductHub Africa.
- Facilitated product design cohorts for Women Techsters (taught Figma, UX research, and practical workflows for 100+ students).
- Teaching Philosophy: Teach students how to think, not just how to run Figma. Focus on the why behind design principles like Hick's Law and Fitts's Law.

HOW TO RESPOND:
- If asked about projects, talk about TASAfrica, Limestone, Xeruit, Mecar, and Afternoon Prep with specific, high-fidelity context from their stories. Provide clean markdown links like [View TASAfrica Case Study](/projects/tasafrica) or [View Limestone Case Study](/projects/limestone).
- If asked about childhood, describe his passion for music (singing, rapping, studio recordings), literature (Shakespeare), and how he wanted to be an Electrical Engineer before university third-year freelancing led him to UI/UX.
- If asked about his design process, highlight the 5-step problem solving framework: Understand, Define, Research and Explore, Prototype, and Test and Iterate.
- Always maintain third-person perspective ("Yemi is", "He designs", "His work"). Do not use first-person pronouns like "I" or "my".
- Never use asterisks (*) or em dashes (—).`;

export function cleanChatOutput(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u2014\u2013]/g, ", ") // Replace em-dash and en-dash
    .replace(/--+/g, ", ")            // Replace double hyphens
    .replace(/\*/g, "")               // Remove all asterisks
    .replace(/\s+,/g, ",")            // Clean spacing before commas
    .replace(/,\s*,/g, ", ")          // Clean duplicate commas
    .trim();
}

export function getSmartPortfolioReply(query: string = ""): string {
  const q = query.toLowerCase().trim();

  // Inspiration & motivation
  if (
    q.includes("inspire") ||
    q.includes("motivation") ||
    q.includes("driven") ||
    q.includes("why do") ||
    q.includes("passion")
  ) {
    return cleanChatOutput(
      "Yemi is driven by deep curiosity and a solution-driven mindset. He naturally asks why and wants to understand the reasoning behind systems. Yemi draws inspiration from everyday challenges and loves taking complex domain problems, such as gated community security workflows or sports scout video analysis, and turning them into simple, elegant experiences where users feel completely in control."
    );
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
    return cleanChatOutput(
      "Growing up, Yemi was highly creative and expressive. Music was one of his strongest early passions, singing, rapping, writing poetry and song lyrics, and even recording tracks in a Lagos studio. Although he was a science student originally aiming to become an Electrical and Electronics Engineer, he had a deep love for literature, especially Shakespeare's Hamlet and The Tempest.\n\nYemi has always lived between those two worlds, logic and artistic exploration. While he did not plan on design originally, his creative and analytical instincts found their natural home when he transitioned to product design in university."
    );
  }

  // How did he start / get into design
  if (
    q.includes("how did") ||
    q.includes("get into design") ||
    q.includes("first project") ||
    q.includes("learn design") ||
    q.includes("pluralcode") ||
    q.includes("marketing") ||
    q.includes("freelance")
  ) {
    return cleanChatOutput(
      "During his third year at university, Yemi needed to support himself financially, which led him into freelancing. He experimented with digital marketing, sales funnels, WordPress, GetResponse, and Klaviyo. Designing landing pages for marketing naturally sparked his curiosity about how people interact with interfaces.\n\nTo formalize his self-taught skills, Yemi completed a UI/UX Design diploma at PluralCode Africa in Lagos. That is where he built his foundation in design systems and interface thinking, and where a classmate referred him to his very first team project: Mecar, a mobility app matching stranded car owners with mechanics."
    );
  }

  // Design process & workflow
  if (
    q.includes("process") ||
    q.includes("workflow") ||
    q.includes("how does yemi design") ||
    q.includes("how do you design") ||
    q.includes("methodology") ||
    q.includes("approach") ||
    q.includes("framework")
  ) {
    return cleanChatOutput(
      "Yemi's problem-solving framework is pragmatic and collaborative:\n\n1. Understand: Dive deep into whether a challenge is primarily a business problem, user problem, or technical constraint.\n2. Define: Establish clear product goals and prioritized criteria.\n3. Explore and Research: Study competitors, analyze UX patterns, and gather peer feedback to build strong design rationale.\n4. Prototype: Translate insights into scalable, intuitive Figma components.\n5. Test and Iterate: Gather feedback from engineers, product managers, and users, testing with an initial group of 3 to 5 users to refine the solution before release."
    );
  }

  // Favorite parts / passions
  if (
    q.includes("favorite") ||
    q.includes("love about design") ||
    q.includes("parts of design") ||
    q.includes("enjoy most")
  ) {
    return cleanChatOutput(
      "Yemi's favorite part of design is navigating real-world constraints. Projects like Limestone's offline gate access taught him that technical limitations are not roadblocks, but opportunities to design transparent, inclusive, and clever solutions. Yemi also deeply enjoys the collaborative spirit of working with developers to ensure designs are feasible to build."
    );
  }

  // Unique / Why hire Yemi / Differentiators
  if (
    q.includes("unique") ||
    q.includes("differentiator") ||
    q.includes("stand out") ||
    q.includes("why hire") ||
    q.includes("special")
  ) {
    return cleanChatOutput(
      "What makes Yemi unique is his technical awareness and business mindset. Having foundational knowledge of HTML, CSS, JavaScript, and React means he designs within the boundaries of reality. Yemi does not just hand off static Figma files; he collaborates directly with engineers to ship lightweight, production-ready interfaces that balance user needs with business conversion metrics."
    );
  }

  // TASAfrica
  if (
    q.includes("tasafrica") ||
    q.includes("sport") ||
    q.includes("scout") ||
    q.includes("athlete") ||
    q.includes("tournament")
  ) {
    return cleanChatOutput(
      "For TASAfrica, Yemi designed a secure tournament and athletic discovery system. It connects young sports talent in Africa with international scouts and clubs through verified registration workflows, safety-oriented verification, and frame-by-frame scout tactical video highlights.\n\nRead the complete case study: [View TASAfrica Case Study](/projects/tasafrica)."
    );
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
    return cleanChatOutput(
      "For Limestone App, Yemi designed an offline-capable gated estate security system.\n\nWhen internet connections failed at security checkpoints, visitor gate codes caused massive delays. Yemi researched with residents and designed an offline QR-code verification pass. To solve the technical data limitations of QR codes, he prioritized essential check-in fields, designed clear expectation-setting alerts for residents, and built an automated syncing strategy when the connection returns.\n\nRead the complete case study: [View Limestone Case Study](/projects/limestone)."
    );
  }

  // Xeruit
  if (
    q.includes("xeruit") ||
    q.includes("hiring") ||
    q.includes("recruit") ||
    q.includes("hiring os")
  ) {
    return cleanChatOutput(
      "For Xeruit Talent, Yemi designed an AI-powered hiring operating system. He took ownership of the candidate onboarding flows, automated CV analysis, recruiter discovery pipelines, and candidate scorecard reviews, which successfully acquired approximately 3,000 active users within its first month."
    );
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
    return cleanChatOutput(
      "For Afternoon Prep, a UK-based exam preparation platform for IELTS, CELPIP, and SSCE, Yemi stepped in midway after the previous designer left. He took ownership of designing both the consumer-facing practice dashboards and the complex administrative content-authoring systems used to manage and publish questions. This experience built his confidence in tackling complex backend tools and fostered his love for EdTech."
    );
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
    return cleanChatOutput(
      "Mentorship is a huge part of who Yemi is. He has taught and mentored over 100 students through cohorts like Women Techsters and as a volunteer Programs Manager at ProductHub Africa.\n\nHis teaching philosophy is to show students how to think and why design principles like Fitts's Law or Hick's Law matter in real-world products, rather than just teaching them to click buttons in Figma. EdTech remains one of his favorite sectors because of this."
    );
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
    return cleanChatOutput(
      "You can reach Yemi directly via:\n\nEmail: [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com)\nWhatsApp: [+234 912 254 6487](https://wa.me/2349122546487)\nLinkedIn: [Opeyemi Adegboye](https://www.linkedin.com/in/opeyemiadegboyeazeez/)\n\nYemi is currently available for full-time product design roles, design system contracts, and strategic consulting assignments."
    );
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
    return cleanChatOutput(
      "Yemi's toolkit crosses design and frontend code:\n\nDesign Systems and Prototyping: Figma (advanced auto-layout, tokens), Adobe Illustrator, Photoshop, Miro, and FigJam.\nFrontend Development: HTML, CSS, JavaScript, React, Tailwind CSS, Vite, Git, and VS Code.\nAI and Automation: Google AI Studio, Claude, Antigravity, n8n, and Zapier."
    );
  }

  // Other projects (StayAfrika, SoluDesks, FlxFleet, Norocio)
  if (
    q.includes("stayafrika") ||
    q.includes("soludesks") ||
    q.includes("flxfleet") ||
    q.includes("norocio") ||
    q.includes("feexeet")
  ) {
    return cleanChatOutput(
      "Here are a few other systems Yemi has worked on:\n\nStayAfrika: A marketplace for travel stays and local tourism experiences across Africa.\nSoluDesks: A robust B2B SaaS platform for administrative learning, team support, and operations.\nFlxFleet: A Canadian logistics, fleet management, and real-time tracking application.\nNorocio: A multi-currency, cross-border stablecoin payments platform.\nFeexeet: A local service marketplace connecting homeowners with verified local pros."
    );
  }

  // Resume
  if (q.includes("resume") || q.includes("cv") || q.includes("experience") || q.includes("background")) {
    return cleanChatOutput(
      "You can explore Yemi's interactive career path on the [Resume](/resume) page of his portfolio, or download the official PDF. It captures over four years of product design impact across fintech, edtech, healthtech, and logistics."
    );
  }

  // Default helpful overview
  return cleanChatOutput(
    "Hello! This is Yemi LLM, Opeyemi's portfolio assistant. Yemi is a Product Designer Who Codes who blends a rich creative background (ranging from writing poetry and Shakespearian literature to recording studio music) with engineering-focused design.\n\nWhat would you like to know about him? You can ask about:\n- His childhood, music, and how he got into design\n- His problem-solving case studies: [TASAfrica](/projects/tasafrica) and [Limestone](/projects/limestone)\n- His passion for teaching, mentoring, or his experiences with Xeruit AI or Afternoon Prep\n- How to contact or hire Yemi"
  );
}
