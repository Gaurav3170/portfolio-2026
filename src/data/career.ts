import type { Chapter, Experience, Profile } from "@/types/career";

/**
 * Single source of truth for all career content.
 * Every fact here comes from the resume — edit this file, not the components.
 */
export const profile: Profile = {
  name: "Gaurav Keswani",
  title: "Staff Frontend Engineer",
  headline: "Building experiences that scale.",
  intro:
    "I design frontend architecture for high-traffic commerce platforms — server-rendered React, micro-frontends and the performance engineering that keeps them fast under peak load.",
  location: "Noida, India",
  yearsOfExperience: "7+",
  closingStatement:
    "I'm looking for the next hard frontend problem: platforms where performance, architecture and product quality all matter at once.",
  resume: {
    href: "/Gaurav_Keswani_Resume.pdf",
    fileName: "Gaurav_Keswani_Staff_Frontend_Resume.pdf",
    meta: "PDF · 2 pages",
  },
  contacts: [
    {
      label: "Email",
      href: "mailto:gauravcs0062@gmail.com",
      display: "gauravcs0062@gmail.com",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/learnwithgaurav",
      display: "linkedin.com/in/learnwithgaurav",
    },
  ],
};

/** Ordered from present day back to the beginning — the direction of the journey. */
export const experiences: Experience[] = [
  {
    id: "staff",
    sceneId: "staff",
    company: "Nagarro",
    title: "Staff Engineer",
    location: "Noida, India",
    start: { year: 2025, month: 12 },
    end: null,
    narrative:
      "Owning performance, reliability and security across a large-scale e-commerce platform built from React micro-frontends, a Next.js server-rendering layer and Node.js BFF services.",
    highlights: [
      "Led a platform-wide performance initiative that made the website 3x faster under peak load.",
      "Resolved recurring peak-sale server crashes and a concurrency defect that could expose one user's data to another.",
      "Led security remediation across 11 repositories — secrets moved to a secure parameter store with zero-downtime rotation.",
      "Built and shared AI agent skills that automate repetitive engineering work for the whole team.",
    ],
    stack: ["Next.js", "React", "Node.js", "AWS", "Dynatrace", "Claude Code"],
  },
  {
    id: "associate",
    sceneId: "associate",
    company: "Nagarro",
    title: "Associate Staff Engineer",
    location: "Noida, India",
    start: { year: 2024, month: 3 },
    end: { year: 2025, month: 11 },
    narrative:
      "Modernizing the frontend platform while shipping the product journeys customers use every day.",
    highlights: [
      "Led the build upgrade to Webpack 5 and Next.js 12 across every micro-frontend.",
      "Integrated recurring AutoPay subscription payments end to end.",
      "Delivered omnichannel product labels across 10+ pages and loyalty dashboards for web and app.",
    ],
    stack: ["Webpack 5", "Next.js 12", "Redux", "SCSS", "AWS Lambda"],
  },
  {
    id: "senior",
    sceneId: "senior",
    company: "Nagarro",
    title: "Senior Engineer",
    location: "Noida, India",
    start: { year: 2022, month: 3 },
    end: { year: 2024, month: 3 },
    narrative:
      "Joining a micro-frontend commerce platform and learning to build features that hold up at scale.",
    highlights: [
      "Built customer-facing React features for subscriptions, cart, checkout and rewards from Figma designs.",
      "Fixed site-wide image quality issues and moved to optimized image components.",
      "Contributed to the shared component library used by every micro-frontend.",
    ],
    stack: ["React", "Next.js", "Redux", "SCSS", "Node.js"],
  },
  {
    id: "infosys",
    sceneId: "beginning",
    company: "Infosys",
    title: "Systems Engineer → Senior Systems Engineer",
    location: "India",
    start: { year: 2019, month: 9 },
    end: { year: 2022, month: 3 },
    narrative:
      "Where it started: after a B.Tech in Computer Science, I joined Infosys and began building frontend plugins for an enterprise content management system.",
    highlights: [
      "Built reusable UI components — a custom data grid and notification modules.",
      "Coordinated a 4-developer squad that met 100% of its sprint goals.",
      "Raised unit test coverage on critical modules to 85%.",
    ],
    stack: ["JavaScript", "HTML5", "CSS3", "Java"],
  },
];

/**
 * The scroll timeline. `focus` is where each chapter sits on 0–1 scroll progress;
 * the 3D camera path and environment blending are keyed to these same values.
 * TODO(projects): insert a "projects" chapter before "next" when that section ships.
 */
export const chapters: Chapter[] = [
  { id: "intro", sceneId: "present", label: "About", focus: 0 },
  { id: "staff", sceneId: "staff", label: "Staff", focus: 0.22 },
  { id: "associate", sceneId: "associate", label: "Associate Staff", focus: 0.41 },
  { id: "senior", sceneId: "senior", label: "Senior", focus: 0.58 },
  { id: "infosys", sceneId: "beginning", label: "Beginning", focus: 0.75 },
  { id: "contact", sceneId: "next", label: "Contact", focus: 1 },
];
