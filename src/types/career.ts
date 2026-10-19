/** Identifies which 3D environment renders behind a chapter. */
export type SceneId = "present" | "staff" | "associate" | "senior" | "beginning" | "projects" | "writing" | "next";

/** A month/year pair. `null` as an end date means "present". */
export interface CareerDate {
  year: number;
  /** 1–12 */
  month: number;
}

export interface Experience {
  id: string;
  sceneId: SceneId;
  company: string;
  title: string;
  location: string;
  start: CareerDate;
  end: CareerDate | null;
  /** One or two sentences that set the scene for the chapter. */
  narrative: string;
  highlights: string[];
  stack: string[];
}

/** A measured result shown on a project, e.g. { value: "147 kB", label: "First Load JS" }. */
export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectLink {
  label: string;
  /** Absolute URL for external links, a path for pages on this site. */
  href: string;
}

export interface Project {
  id: string;
  title: string;
  /** One or two sentences: what it is. */
  summary: string;
  /** How it was built, one decision per line. */
  highlights: string[];
  metrics: ProjectMetric[];
  /** Where the metrics come from, so every number can be checked. */
  metricsNote: string;
  stack: string[];
  links: ProjectLink[];
}

export interface ContactLink {
  label: string;
  href: string;
  /** Short visible text, e.g. the address itself. */
  display: string;
}

export interface ResumeFile {
  /** Path under /public. */
  href: string;
  /** File name the browser saves the download as. */
  fileName: string;
  /** Shown next to the link so visitors know what they're downloading. */
  meta: string;
}

export interface Profile {
  resume: ResumeFile;
  name: string;
  title: string;
  headline: string;
  intro: string;
  location: string;
  yearsOfExperience: string;
  closingStatement: string;
  contacts: ContactLink[];
}

/** A chapter on the scroll timeline, from start (0) to end (1) of the journey. */
export interface Chapter {
  id: string;
  sceneId: SceneId;
  label: string;
  /** Normalized scroll progress where the chapter is centered. */
  focus: number;
}
