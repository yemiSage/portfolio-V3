import { ABOUT_JOURNEY } from "../data/about.js";

export const SITE = {
  origin: "https://yemii.vercel.app",
  name: "Opeyemi Adegboye Portfolio",
  language: "en",
  locale: "en_NG",
  author: "Opeyemi Adegboye",
  image: "/og-design-engineer.jpg",
  imageAlt: "Adegboye Opeyemi, Design Engineer, Product and AI",
  email: "adegboyeopeyemi065@gmail.com",
  profiles: [
    "https://www.linkedin.com/in/opeyemiadegboyeazeez/",
    "https://github.com/yemiSage",
    "https://x.com/opeyemiadeazeez",
    "https://www.instagram.com/ope_yemi066/",
    "https://www.upwork.com/freelancers/~01e2c6c8a33a8649c0",
  ],
};

const personId = `${SITE.origin}/#person`;
const websiteId = `${SITE.origin}/#website`;

const breadcrumb = (name, path) => ({
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Portfolio",
      item: `${SITE.origin}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name,
      item: `${SITE.origin}${path}`,
    },
  ],
});

const caseStudySchema = (name, path, description) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CreativeWork",
      "@id": `${SITE.origin}${path}#case-study`,
      name,
      headline: name,
      description,
      url: `${SITE.origin}${path}`,
      image: `${SITE.origin}${SITE.image}`,
      author: { "@id": personId },
      isPartOf: { "@id": websiteId },
    },
    breadcrumb(name, path),
  ],
});

export const ROUTES = [
  {
    path: "/",
    indexable: true,
    title: "Adegboye Opeyemi | Design Engineer, Product & AI",
    description:
      "Portfolio of Opeyemi Adegboye, a Design Engineer for Product and AI creating product experiences, design systems and production interfaces across SaaS, marketplaces and emerging technology.",
    type: "profile",
    heading: "Opeyemi Adegboye — Design Engineer, Product & AI",
    summary:
      "I design and build clear digital products, scalable design systems and high-fidelity interfaces across product design and frontend engineering.",
    sections: [
      {
        heading: "Selected case studies",
        body: "Explore product design work spanning community management, sports talent discovery and African travel commerce.",
        links: [
          ["TASAfrica sports talent discovery", "/projects/tasafrica"],
          ["Limestone smart community management", "/projects/limestone"],
          ["StayAfrika travel marketplace", "/projects/stayafrika"],
        ],
      },
      {
        heading: "Capabilities",
        body: "Product strategy, user research, UX and UI design, design systems, prototyping, React interface development and design-to-code collaboration.",
      },
    ],
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": personId,
          name: "Opeyemi Adegboye",
          alternateName: ["Yemi Adegboye", "yemiSage"],
          jobTitle: "Design Engineer, Product & AI",
          description:
            "Design Engineer working across product design, design systems, prototyping and frontend interfaces.",
          image: `${SITE.origin}/portfolio-logo.png`,
          url: `${SITE.origin}/`,
          email: `mailto:${SITE.email}`,
          sameAs: SITE.profiles,
          knowsAbout: [
            "Product Design",
            "User Experience Design",
            "User Interface Design",
            "Design Systems",
            "Prototyping",
            "Frontend Development",
            "React",
          ],
        },
        {
          "@type": "WebSite",
          "@id": websiteId,
          url: `${SITE.origin}/`,
          name: SITE.name,
          description:
            "The official product design and design engineering portfolio of Opeyemi Adegboye.",
          inLanguage: SITE.language,
          author: { "@id": personId },
        },
        {
          "@type": "ItemList",
          name: "Selected product design case studies",
          itemListElement: [
            ["TASAfrica", "/projects/tasafrica"],
            ["Limestone", "/projects/limestone"],
            ["StayAfrika", "/projects/stayafrika"],
          ].map(([name, path], index) => ({
            "@type": "ListItem",
            position: index + 1,
            name,
            url: `${SITE.origin}${path}`,
          })),
        },
      ],
    },
  },
  {
    path: "/projects/tasafrica",
    indexable: true,
    title: "TASAfrica Case Study | Opeyemi Adegboye",
    description:
      "A mobile-first product design case study for TASAfrica, helping African athletes build visibility and connect with scouts, coaches, academies and clubs.",
    type: "article",
    heading: "TASAfrica sports talent discovery case study",
    summary:
      "A mobile-first sports platform that helps African athletes build visibility, share verified profiles and connect with the wider sports ecosystem.",
    sections: [
      {
        heading: "Design challenge",
        body: "The work focused on lightweight onboarding, role-aware profiles, talent discovery, community highlights and a design system that could support continued product growth.",
      },
      {
        heading: "Approach",
        body: "Research and iterative product design shaped a shared system for athletes, scouts, coaches and academies while keeping the experience understandable on mobile devices.",
      },
    ],
    schema: caseStudySchema(
      "TASAfrica sports talent discovery case study",
      "/projects/tasafrica",
      "A mobile-first product design case study for African sports talent discovery.",
    ),
  },
  {
    path: "/projects/limestone",
    indexable: true,
    title: "Limestone Case Study | Opeyemi Adegboye",
    description:
      "A product design case study for My Limestone, improving estate access, offline visitor check-ins, resident onboarding and emergency alerts.",
    type: "article",
    heading: "Limestone smart community management case study",
    summary:
      "A community management experience for residential estates, designed around dependable visitor access, resident services and safety workflows.",
    sections: [
      {
        heading: "Design challenge",
        body: "The project addressed unreliable gate connectivity, manager-led onboarding bottlenecks and the need for faster access to emergency actions.",
      },
      {
        heading: "Approach",
        body: "The redesigned flows centered offline guest check-in, self-service resident onboarding, location-aware panic alerts and a consistent daily dashboard.",
      },
    ],
    schema: caseStudySchema(
      "Limestone smart community management case study",
      "/projects/limestone",
      "A product design case study for estate access, resident services and emergency workflows.",
    ),
  },
  {
    path: "/projects/stayafrika",
    indexable: true,
    title: "StayAfrika Case Study | Opeyemi Adegboye",
    description:
      "A product design case study for StayAfrika covering white-label storefronts, property payments, host messaging and listing creation across travel categories.",
    type: "article",
    heading: "StayAfrika travel marketplace case study",
    summary:
      "An original product design taken from early flows to launch, supporting stays, local experiences and essential travel services across Africa.",
    sections: [
      {
        heading: "Design challenge",
        body: "The platform needed familiar listing flows while supporting different inventory types, branded storefronts, property payments and useful host communication.",
      },
      {
        heading: "Approach",
        body: "The work created shared listing patterns, white-label setup, transaction-aware messaging, scheduled guest templates and structured guest imports.",
      },
    ],
    schema: caseStudySchema(
      "StayAfrika travel marketplace case study",
      "/projects/stayafrika",
      "An original product design case study for a travel marketplace serving African stays, experiences and services.",
    ),
  },
  {
    path: "/about",
    indexable: true,
    title: "About Yemi | Opeyemi Adegboye",
    description: "Meet Opeyemi Adegboye, a Lagos-based design engineer. From electrical engineering to product design, frontend development, teaching and community.",
    type: "profile",
    heading: "I’m Yemi. An engineer’s mind. A designer’s eye. A builder’s hands.",
    summary: "I’m Adegboye Opeyemi. I started in electrical and electronics engineering, found my way into product design, and kept following that curiosity into code.",
    sections: [
      ...ABOUT_JOURNEY.map(item => ({ heading: `${item.year}: ${item.title}`, body: item.body })),
      { heading: "How I think", body: "Purpose before polish. Design and build belong together. Stay a student and share what you learn." },
      { heading: "Off the clock", body: "Tech meetups, FIFA, singing, poetry and good conversations. Coffee, semo and results keep me going.", links: [["Leave a note in my guestbook", "/guestbook"]] },
    ],
    schema: { "@context": "https://schema.org", "@graph": [{ "@type": "AboutPage", "@id": `${SITE.origin}/about#page`, url: `${SITE.origin}/about`, name: "About Opeyemi Adegboye", about: { "@id": personId }, isPartOf: { "@id": websiteId } }, breadcrumb("About Yemi", "/about")] },
  },
  {
    path: "/guestbook",
    indexable: true,
    title: "Guestbook | Opeyemi Adegboye",
    description: "A little corner of Opeyemi Adegboye’s portfolio for visitor notes, kind words and hellos. Leave a short message for Yemi to review before it joins the wall.",
    type: "website",
    heading: "You were here. Leave a little hello.",
    summary: "A thought, a tiny story, a word of encouragement. A few words from you make this place feel a little more human.",
    sections: [{ heading: "Leave a note", body: "Share your name and a short note. Every submission is reviewed by Yemi before publication. Do not include links, ads or private details." }, { heading: "Say hello", body: "Want to talk about a project instead? Start a conversation by email.", links: [["Email Yemi", `mailto:${SITE.email}`], ["Get to know Yemi", "/about"]] }],
    schema: { "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", "@id": `${SITE.origin}/guestbook#page`, url: `${SITE.origin}/guestbook`, name: "Yemi’s guestbook", isPartOf: { "@id": websiteId } }, breadcrumb("Guestbook", "/guestbook")] },
  },
  {
    path: "/resume",
    indexable: false,
    canonicalPath: "/",
    title: "Resume | Opeyemi Adegboye",
    description:
      "Open Opeyemi Adegboye's public design engineering resume from the portfolio.",
    type: "website",
    heading: "Opeyemi Adegboye resume",
    summary:
      "This portfolio route opens the public resume document. Return to the portfolio for case studies and contact information.",
    sections: [
      {
        heading: "Resume document",
        body: "View or download the public resume PDF.",
        links: [["Open the resume PDF", "/resume/opeyemi-adegboye-resume.pdf"]],
      },
    ],
    schema: null,
  },
];

export function normalizePath(pathname = "/") {
  const normalized = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return normalized || "/";
}

export function getRoute(pathname) {
  const path = normalizePath(pathname);
  return ROUTES.find((route) => route.path === path) || null;
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE.origin}/`).toString();
}

export function canonicalUrl(route) {
  return absoluteUrl(route.canonicalPath || route.path);
}
