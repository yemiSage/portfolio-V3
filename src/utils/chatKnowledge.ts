export function getYemiAge(): number {
  const birthDate = new Date(1997, 6, 21); // July 21, 1997 (month is 0-indexed)
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const YEMI_SYSTEM_INSTRUCTION = `You are "askYemi" (also known as Yemi LLM or YemiAI), an intelligent, highly articulate, and deeply authentic AI assistant representing Opeyemi Adegboye ("Yemi" or "yemiSage").

CRITICAL FORMATTING AND PERSPECTIVE RULES:
1. THIRD-PERSON PERSPECTIVE: ALWAYS speak about Yemi in the third person. Yemi is a male / guy, so use "Yemi is", "He", "His work", "Him". NEVER use first-person pronouns ("I", "me", "my", "mine", "myself").
2. DYNAMIC AND VARIED RESPONSES: Keep your responses dynamic, fresh, and engaging! Do NOT repeat identical words, opening lines, or robotic boilerplate phrases across answers. Vary your sentence structures and vocabulary so every conversation feels organic and lively.
3. NO ASTERISKS: NEVER use asterisks (*) anywhere in your output. Do not use bold (**word**), do not use italics (*word*), and do not use asterisks as bullet points.
4. NO EM DASHES: NEVER use em dashes (—) or en dashes (–) or double hyphens (--). Use natural conversational punctuation like commas, periods, or simple parentheses instead.
5. CLEAR AND CONVERSATIONAL: Keep explanations articulate, warm, and natural. Avoid hollow buzzwords and generic filler.
6. LINKS: When mentioning links, format them as clean standard markdown without asterisks:
   - LinkedIn: [linkedin.com/in/opeyemiadegboyeazeez](https://www.linkedin.com/in/opeyemiadegboyeazeez)
   - WhatsApp: [+234 912 254 6487](https://wa.me/2349122546487)
   - Email: [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com)
   - Instagram: [instagram.com/ope_yemi066](https://www.instagram.com/ope_yemi066/)
   - Case Studies: [View TASAfrica Case Study](/projects/tasafrica) or [View Limestone Case Study](/projects/limestone)
   - Resume: [View Resume](/resume)

WHO IS OPEYEMI ADEGBOYE ("YEMI")?
- Full Name: Opeyemi Adegboye Azeez (commonly known as "Yemi" or "yemiSage").
- Gender: Male (guy). Pronouns: He / Him / His.
- Date of Birth & Age: Born July 21, 1997. As of today, calculating from July 21, 1997 to today, he is ${getYemiAge()} years old. His birthday is on July 21.
- Education: Studied Electrical and Electronics Engineering in school, specifically the Power and Machine option.
- Career Path & Current Focus: While he began in electrical engineering, his curiosity for technology, systems, and user behavior led him to pursue Digital Product Design (UI/UX). He is also a passionate AI enthusiast who actively explores and integrates generative AI, prompt architecture, and agentic workflows (Google AI Studio, Claude, Antigravity) into modern product design.
- Experience & Title: Digital Product Designer and UI/UX Designer who codes, with over 4 years of hands-on experience designing B2B, B2C, SaaS, fintech, marketplaces, and AI-integrated platforms.
- Tagline: "Yemi designs clear, intentional experiences for complex products, balancing user needs with business goals."
- Core Philosophy: Simplicity, technical feasibility, and inclusivity. Good design clarifies complex systems.
- Childhood & Creativity: A deeply creative childhood writing poetry, singing, rapping, recording songs in Lagos studios, and reading Shakespeare like Hamlet and The Tempest. In his third university year, financial necessity prompted him to freelance in digital marketing, landing pages, and web funnels, which introduced him to UI/UX.

ALL CONTACT AND SOCIAL DETAILS:
- Phone / Mobile: 09122546487 (International: +234 912 254 6487)
- WhatsApp: [+234 912 254 6487](https://wa.me/2349122546487) (direct chat)
- LinkedIn Profile: [linkedin.com/in/opeyemiadegboyeazeez](https://www.linkedin.com/in/opeyemiadegboyeazeez)
- Upwork: Available on Upwork for freelance UI/UX and product design contracts and international projects.
- Email: [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com)
- Instagram: [instagram.com/ope_yemi066](https://www.instagram.com/ope_yemi066/)
- Interactive Resume: [View Resume](/resume)

CORE PROJECTS AND CASE STUDIES:
1. Limestone App (Case Study at /projects/limestone):
   Offline gate security access system for gated estates. Engineered an offline QR-code verification pass when connectivity fails, prioritizing vital fields and setting clear expectations.
2. TASAfrica (Case Study at /projects/tasafrica):
   Youth athletic discovery and tournament platform connecting African sports talents with scouts securely, featuring tactical video highlights and verified workflows.
3. Xeruit Talent:
   AI hiring operating system with automated CV analysis, candidate matching, and recruiter pipelines, reaching ~3,000 active users in its first month.
4. Mecar:
   Mobility app connecting stranded car owners with nearby mechanics, his first major cross-functional team project.
5. Afternoon Prep:
   UK-based education exam prep platform for IELTS, CELPIP, and SSCE, designing both student practice modules and admin authoring tools.

OTHER NOTABLE PLATFORMS:
- StayAfrika: African accommodation and travel experiences marketplace.
- SoluDesks: B2B team training and administrative SaaS.
- FlxFleet: Canadian logistics, fleet management, and real-time tracking system.
- Norocio: Multi-currency, cross-border stablecoin payments platform.
- Feexeet: On-demand local service marketplace connecting homeowners with verified pros.

COMMUNITY & MENTORSHIP:
- Mentored over 100 students through Women Techsters and volunteer Programs Manager at ProductHub Africa. Teaches conceptual problem-solving and cognitive laws (Fitts's Law, Hick's Law) beyond just tool manipulation.

HOW TO WORK WITH YEMI:
- Yemi collaborates with founders, product teams, and startups in multiple ways:
  1. Full-Time or Long-Term Contract: Leading end-to-end product design, designing cross-platform experiences, building design systems, and partnering directly with developers.
  2. Freelance & Sprints: Available on Upwork and directly for focused UI/UX audits, rapid prototyping, and MVP launches.
  3. AI & Systems Strategy: Crafting AI-native user interfaces, conversational agents, and workflows that connect LLMs to human-centered UI.
  Reach him directly on WhatsApp ([+234 912 254 6487](https://wa.me/2349122546487)), email ([adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com)), or LinkedIn ([linkedin.com/in/opeyemiadegboyeazeez](https://www.linkedin.com/in/opeyemiadegboyeazeez)).

TYPES OF PROJECTS YEMI WORKS ON:
- Complex B2B & SaaS: Multi-role admin consoles, learning platforms (SoluDesks), and recruitment OS (Xeruit Talent).
- Consumer & Marketplace Products: Athletic scouting discovery (TASAfrica), local tourism platforms (StayAfrika), and service marketplaces (Feexeet).
- Offline-First & Constraint-Heavy Systems: Offline QR security checkpoint validation for residential estates (Limestone App).
- EdTech & Exam Prep: Student test-taking engines and backend curriculum authoring suites (Afternoon Prep).
- Logistics & Fintech: Real-time fleet management (FlxFleet) and multi-currency cross-border payment platforms (Norocio).

HOW TO RESPOND:
- Provide accurate contact information (LinkedIn, WhatsApp, Phone 09122546487, Upwork, Email) whenever requested.
- When asked about his background, education, age, or gender, state the facts clearly: male, age ${getYemiAge()} (calculated from his birth date of July 21, 1997 till now), studied Electrical Electronics Engineering (Power and Machine option), and currently pursuing product design as an AI enthusiast.
- Stay dynamic, conversational, articulate, and completely free of asterisks or em dashes.`;

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

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function getSmartPortfolioReply(query: string = ""): string {
  const q = query.toLowerCase().trim();

  // 1. How to work with Yemi / Collaboration
  if (
    q.includes("work with") ||
    q.includes("work together") ||
    q.includes("collaborat") ||
    q.includes("hire yemi") ||
    q.includes("hiring yemi") ||
    q.includes("engagement")
  ) {
    const workVariations = [
      "You can work with Yemi across three primary models:\n\n1. Full-Time or Long-Term Contract: Leading end-to-end product design, designing cross-platform experiences, building scalable design systems, and partnering directly with engineering teams to ship production-ready features.\n2. Freelance & Product Sprints: Available on Upwork and directly for focused UI/UX audits, rapid high-fidelity prototyping, and MVP launches.\n3. AI & Systems Strategy: Helping founders and teams design intuitive AI-native interfaces, conversational experiences, and complex workflows.\n\nTo start a conversation, feel free to reach out via WhatsApp at [+234 912 254 6487](https://wa.me/2349122546487), email [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com), or connect on [LinkedIn](https://www.linkedin.com/in/opeyemiadegboyeazeez).",
      "Collaborating with Yemi is easy and flexible. Depending on your team's needs, he works as:\n\n- Full-Time Product Designer: Owning discovery, user research, wireframing, component design systems, and developer handoff.\n- Contract Consultant: Tackling specific design bottlenecks, optimizing conversion funnels, or building zero-to-one MVPs.\n- Upwork Freelancer: Taking on scoped UI/UX and product design contracts with international clients.\n\nSend him a direct WhatsApp message at [+234 912 254 6487](https://wa.me/2349122546487) or an email at [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com) to share your project scope!",
      "Yemi is available for both full-time roles and freelance or contract collaborations. He brings a unique combination of engineering logic (Electrical Electronics Engineering background) and human-centered design craft.\n\nWhether you need an MVP designed from scratch, an existing system revamped, or an AI-powered interface brought to life, you can reach him via WhatsApp ([+234 912 254 6487](https://wa.me/2349122546487)), LinkedIn, Upwork, or email ([adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com))."
    ];
    return cleanChatOutput(pickRandom(workVariations));
  }

  // 2. What kind of projects does Yemi work on?
  if (
    q.includes("kind of project") ||
    q.includes("types of project") ||
    q.includes("what projects") ||
    q.includes("projects does") ||
    q.includes("projects he work") ||
    q.includes("what kind") ||
    q.includes("work on")
  ) {
    const projectTypeVariations = [
      "Yemi works on complex, user-critical digital products across B2B SaaS, marketplaces, consumer platforms, and AI tools. Key areas include:\n\n- Sports & Discovery Platforms: Designed [TASAfrica](/projects/tasafrica), connecting young African sports talent with international scouts via verified registration and tactical video analytics.\n- Offline & Constraint-Heavy Systems: Designed [Limestone App](/projects/limestone), solving gated estate visitor bottlenecks with offline QR verification passes.\n- AI & Recruitment OS: Designed Xeruit Talent, an AI-powered hiring platform with automated CV parsing, candidate matching, and scorecard reviews (3,000+ active users in month one).\n- EdTech & Testing Systems: Designed student practice dashboards and complex admin question-authoring tools for Afternoon Prep (IELTS, CELPIP, SSCE).\n- Mobility, Logistics & Fintech: Built Mecar (mechanic dispatch), FlxFleet (Canadian fleet management), StayAfrika (African travel stays), and Norocio (cross-border stablecoin payments).",
      "Yemi specializes in products with intricate workflows and technical constraints, spanning:\n\n1. AI-Native Software (Xeruit Talent recruitment OS, prompt workflows)\n2. Offline-First Utilities ([Limestone App](/projects/limestone) estate access control)\n3. Sports & Talent Discovery ([TASAfrica](/projects/tasafrica) athlete verification and highlight reviews)\n4. EdTech Platforms (Afternoon Prep exam practice and admin authoring)\n5. Logistics, B2B SaaS & Marketplaces (FlxFleet, SoluDesks, StayAfrika, Feexeet)\n\nHe excels at transforming complex systems into intuitive interfaces that developers can build cleanly."
    ];
    return cleanChatOutput(pickRandom(projectTypeVariations));
  }

  // 3. Contact info, phone, WhatsApp, LinkedIn, email, Upwork, call
  if (
    q.includes("phone") ||
    q.includes("number") ||
    q.includes("whatsapp") ||
    q.includes("linkedin") ||
    q.includes("upwork") ||
    q.includes("contact") ||
    q.includes("email") ||
    q.includes("hire") ||
    q.includes("reach") ||
    q.includes("call") ||
    q.includes("touch")
  ) {
    const contactVariations = [
      "Here is how you can connect with Yemi directly:\n\nPhone: 09122546487 (International: +234 912 254 6487)\nWhatsApp: [+234 912 254 6487](https://wa.me/2349122546487)\nLinkedIn: [linkedin.com/in/opeyemiadegboyeazeez](https://www.linkedin.com/in/opeyemiadegboyeazeez)\nEmail: [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com)\nInstagram: [instagram.com/ope_yemi066](https://www.instagram.com/ope_yemi066/)\n\nHe is also active on Upwork for freelance UI/UX and product design contracts. Feel free to send him a note!",
      "Yemi is easy to reach across several channels:\n\nMobile / Phone: 09122546487\nDirect WhatsApp: [+234 912 254 6487](https://wa.me/2349122546487)\nProfessional LinkedIn: [linkedin.com/in/opeyemiadegboyeazeez](https://www.linkedin.com/in/opeyemiadegboyeazeez)\nOfficial Email: [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com)\n\nWhether you need a full-time product designer, contract consultant, or want to collaborate via Upwork, he is available to talk.",
      "You can get in touch with Yemi right away:\n\nWhatsApp or Call: [+234 912 254 6487](https://wa.me/2349122546487) (Local: 09122546487)\nLinkedIn: [Opeyemi Adegboye](https://www.linkedin.com/in/opeyemiadegboyeazeez)\nEmail: [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com)\nInstagram: [ope_yemi066](https://www.instagram.com/ope_yemi066/)\n\nHe is open to new opportunities and freelance engagements on Upwork as well."
    ];
    return cleanChatOutput(pickRandom(contactVariations));
  }

  // Age / Date of birth / Birthday
  if (
    q.includes("age") ||
    q.includes("old is") ||
    q.includes("birth") ||
    q.includes("born") ||
    q.includes("birthday") ||
    q.includes("dob")
  ) {
    const age = getYemiAge();
    const ageVariations = [
      `Yemi is ${age} years old as of today. He was born on July 21, 1997, and celebrates his birthday on the 21st of July.`,
      `Yemi was born on July 21, 1997. Calculating from his birth date to today, he is currently ${age} years of age.`,
      `His date of birth is July 21, 1997, making him ${age} years old as of today.`
    ];
    return cleanChatOutput(pickRandom(ageVariations));
  }

  // Gender / Male / Guy
  if (
    q.includes("gender") ||
    q.includes("male") ||
    q.includes("female") ||
    q.includes("guy") ||
    q.includes("pronoun")
  ) {
    return cleanChatOutput(
      "Yemi is a guy (male). His pronouns are he, him, and his."
    );
  }

  // Education / Degree / Electrical Engineering / Power and Machine / School / University
  if (
    q.includes("education") ||
    q.includes("study") ||
    q.includes("studied") ||
    q.includes("degree") ||
    q.includes("school") ||
    q.includes("university") ||
    q.includes("college") ||
    q.includes("engineering") ||
    q.includes("electrical") ||
    q.includes("power and machine")
  ) {
    const educationVariations = [
      "Yemi studied Electrical and Electronics Engineering in school, specializing in the Power and Machine option. That rigorous engineering background provided him with strong analytical and systems-thinking skills. While in university, his curiosity for digital experiences led him to transition into Product Design, where he blends engineering logic with human-centered interfaces.",
      "In university, Yemi read Electrical and Electronics Engineering with a focus on Power and Machine. Although trained in engineering, his passion for technology and user interaction inspired him to pursue digital product design. Today, that technical foundation allows him to collaborate seamlessly with software engineers and architect feasible, production-ready systems.",
      "Yemi has an academic background in Electrical and Electronics Engineering (Power and Machine option). During his third year in school, he began designing digital interfaces and marketing funnels, eventually transitioning fully into Product Design and becoming a passionate AI enthusiast."
    ];
    return cleanChatOutput(pickRandom(educationVariations));
  }

  // AI Enthusiast / AI tools / Machine learning / Google AI Studio / Claude / Antigravity
  if (
    q.includes("ai") ||
    q.includes("artificial intelligence") ||
    q.includes("machine learning") ||
    q.includes("llm") ||
    q.includes("enthusiast")
  ) {
    const aiVariations = [
      "Yemi is a committed AI enthusiast who actively integrates modern generative AI workflows into his design practice. He works with tools like Google AI Studio, Claude, and Antigravity to prototype ideas rapidly, design AI-native interfaces like Xeruit Talent, and build intelligent features that feel effortless for users.",
      "Beyond traditional UI and UX, Yemi is deeply fascinated by artificial intelligence. He experiments with large language models, prompt workflows, and agentic systems, believing that the future of design lies in creating intuitive human interactions with intelligent software.",
      "As an AI enthusiast, Yemi combines his background in engineering with modern AI tooling. Whether he is architecting automated candidate matching flows for Xeruit or building conversational portfolio agents like Yemi LLM, he treats AI as a creative partner that elevates usability."
    ];
    return cleanChatOutput(pickRandom(aiVariations));
  }

  // Inspiration & motivation
  if (
    q.includes("inspire") ||
    q.includes("motivation") ||
    q.includes("driven") ||
    q.includes("why do") ||
    q.includes("passion")
  ) {
    const inspireVariations = [
      "Yemi is driven by curiosity and purposeful problem solving. He constantly asks why and examines the root logic behind systems. He draws inspiration from real-world bottlenecks, taking complex domains like offline estate access or sports analytics and transforming them into clear, enjoyable user experiences.",
      "What drives Yemi is the craft of making complex things simple. He loves working with constraints because they spark creative solutions, and he is inspired by ambitious people who build intentional products.",
      "Yemi finds inspiration in the intersection between technical feasibility and everyday user pain points. Designing products where users feel empowered and in control is his primary motivation."
    ];
    return cleanChatOutput(pickRandom(inspireVariations));
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
    q.includes("shakespeare")
  ) {
    const storyVariations = [
      "Growing up, Yemi was full of creative energy. He loved music, singing, rapping, writing song lyrics, and recording in Lagos studios. Alongside music, he read literature like Shakespeare's Hamlet and The Tempest. While he initially pursued Electrical Engineering in school, his creative and analytical sides found their ultimate balance when he stepped into UI/UX design.",
      "Yemi grew up balancing two worlds: artistic expression and analytical science. He spent his early years recording songs, singing, rapping, and writing poetry in Lagos, while enjoying classic Shakespearian literature. Later, while reading Electrical Electronics Engineering at university, he discovered digital product design and realized it was the ideal harmony of logic and creativity.",
      "Yemi's early years were filled with music and storytelling, from recording hip-hop and vocal tracks in local studios to immersing himself in literature. That creative instinct, paired with studying engineering, shaped his unique perspective as a designer who understands both emotion and structure."
    ];
    return cleanChatOutput(pickRandom(storyVariations));
  }

  // How did he start / get into design / PluralCode
  if (
    q.includes("how did") ||
    q.includes("get into design") ||
    q.includes("first project") ||
    q.includes("learn design") ||
    q.includes("pluralcode") ||
    q.includes("marketing") ||
    q.includes("freelance")
  ) {
    const startVariations = [
      "During his third university year, Yemi needed financial independence, so he started freelancing in digital marketing, building sales funnels and landing pages. That work sparked his curiosity about user behavior, leading him to earn a UI/UX diploma at PluralCode Africa in Lagos. Soon after, a classmate referred him to his first major team gig: Mecar, a mobility app for stranded car owners.",
      "Yemi entered product design out of necessity and curiosity. While studying engineering, he took on freelance marketing projects, designing conversion funnels and websites. Wanting to master the craft formally, he enrolled at PluralCode Africa in Lagos to study UI/UX design systems, which quickly launched his product design career.",
      "His journey started in university when he experimented with digital marketing and web design to support himself. Realizing he was fascinated by how people navigate interfaces, he formalized his knowledge at PluralCode Africa in Lagos and never looked back."
    ];
    return cleanChatOutput(pickRandom(startVariations));
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
      "Yemi's problem-solving framework follows 5 intentional steps:\n\n1. Understand: Pinpoint whether the challenge is a business, user, or technical problem.\n2. Define: Establish clear product goals and measurable criteria.\n3. Explore and Research: Analyze competitor UX patterns and gather feedback to build solid design rationale.\n4. Prototype: Translate ideas into scalable, interactive Figma components and testable flows.\n5. Test and Iterate: Test with 3 to 5 users, incorporate engineering constraints, and refine before launch."
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
      "Yemi's favorite aspect of design is turning technical limitations into user-friendly features. Projects like Limestone's offline gate access demonstrated that constraints are creative catalysts, not obstacles. He also loves collaborating with engineers to make sure every design is feasible to build."
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
      "What sets Yemi apart is his dual engineering and design mindset. Because he codes and understands technical feasibility, he does not create fantasy designs that developers struggle to build. He speaks the language of engineers and product managers, ensuring products ship efficiently while delivering business value."
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
      "For TASAfrica, Yemi designed a youth sports discovery and tournament platform. It bridges young African talents with international scouts through verified registration, safety protocols, and tactical video analytics highlights.\n\nExplore the full case study: [View TASAfrica Case Study](/projects/tasafrica)."
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
      "For Limestone App, Yemi engineered an offline-capable security verification system for gated estates. When poor cellular networks caused guest bottlenecks, he designed an offline QR-code pass that prioritized critical visitor data and provided clear expectations for residents.\n\nExplore the full case study: [View Limestone Case Study](/projects/limestone)."
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
      "For Xeruit Talent, Yemi designed an AI-powered recruitment OS with automated CV parsing, candidate matching, and recruiter scorecard reviews, scaling to roughly 3,000 active users in month one."
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
      "For Afternoon Prep (a UK-based IELTS, CELPIP, and SSCE prep platform), Yemi took over product design to build both student practice modules and complex administrative content management tools, sparking his deep love for EdTech."
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
      "Mentorship is central to Yemi's journey. Having mentored more than 100 designers through Women Techsters and as Programs Manager at ProductHub Africa, he emphasizes teaching students how to think critically and apply UX laws (like Fitts's and Hick's Law) rather than just pushing pixels."
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
      "Yemi's toolkit spans design, code, and artificial intelligence:\n\nDesign: Figma, Adobe Illustrator, Photoshop, Miro, FigJam\nFrontend Code: HTML, CSS, JavaScript, React, Tailwind CSS, Vite\nAI Tooling: Google AI Studio, Claude, Antigravity, prompt engineering workflows"
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
      "Yemi has contributed to several other noteworthy systems:\n\nStayAfrika: African travel stays and local experiences marketplace\nSoluDesks: B2B team training and administrative SaaS\nFlxFleet: Canadian fleet operations and real-time tracking application\nNorocio: Cross-border multi-currency stablecoin fintech\nFeexeet: Local home services marketplace"
    );
  }

  // Resume
  if (q.includes("resume") || q.includes("cv") || q.includes("experience") || q.includes("background")) {
    return cleanChatOutput(
      "You can inspect Yemi's interactive career timeline on the [Resume](/resume) section of the portfolio or download the official PDF. It summarizes over four years of design leadership across fintech, edtech, healthtech, and logistics."
    );
  }

  // Default helpful overview with dynamic greetings
  const defaultOverviews = [
    "Hello! This is Yemi LLM, Opeyemi's portfolio assistant. Yemi is a male Product Designer Who Codes with an engineering background (Electrical and Electronics Engineering, Power and Machine option) who is now pursuing digital product design and active in AI.\n\nWhat would you like to explore? Feel free to ask about:\n- His background, education, and childhood in music\n- His contact details: Phone 09122546487, WhatsApp, LinkedIn, or Upwork\n- Case studies: [TASAfrica](/projects/tasafrica) and [Limestone](/projects/limestone)\n- His AI enthusiasm, design methodology, or work on Xeruit and Afternoon Prep",
    "Welcome to Yemi LLM! I am here to share insights about Opeyemi Adegboye: his design approach, engineering background, case studies, and current work as an AI enthusiast.\n\nYou can ask about:\n- Contact information (Phone 09122546487, WhatsApp, LinkedIn, Email)\n- His education in Electrical Engineering (Power and Machine)\n- Case studies like [TASAfrica](/projects/tasafrica) and [Limestone](/projects/limestone)\n- Mentorship, design tools, or freelance inquiries via Upwork",
    "Hi there! Yemi LLM here, representing product designer Opeyemi Adegboye. Yemi pairs an Electrical Electronics Engineering education with human-centered product craft and passion for artificial intelligence.\n\nFeel free to ask about his background, case studies ([TASAfrica](/projects/tasafrica), [Limestone](/projects/limestone)), his design process, or how to reach him via Phone, WhatsApp, LinkedIn, or Upwork!"
  ];
  return cleanChatOutput(pickRandom(defaultOverviews));
}
