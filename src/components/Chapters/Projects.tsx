import Link from "next/link";
import { projects } from "@/data/career";
import type { ProjectLink } from "@/types/career";
import styles from "./Chapters.module.scss";

function ProjectAnchor({ link }: { link: ProjectLink }) {
  if (link.href.startsWith("/")) {
    return (
      <Link className={styles.projectLink} href={link.href}>
        {link.label}
      </Link>
    );
  }
  return (
    <a className={styles.projectLink} href={link.href} target="_blank" rel="noopener noreferrer">
      {link.label}
      <span className={styles.visuallyHidden}> (opens in a new tab)</span>
    </a>
  );
}

/** Scene 6 — public work, after the career story and before the next chapter. */
export function Projects() {
  return (
    <section id="projects" className={styles.chapter} aria-labelledby="projects-title">
      <div className={styles.panel}>
        <p className={styles.chapterIndex} data-reveal>
          <span>Projects</span>
          <span className={styles.rule} aria-hidden="true" />
          <span>Built in public</span>
        </p>
        <h2 id="projects-title" className={styles.role} data-reveal>
          Work you can inspect.
        </h2>
        <p className={styles.narrative} data-reveal>
          Patterns from production, rebuilt from scratch in the open, each with its source and the numbers behind it.
        </p>
        <ul className={styles.projectList}>
          {projects.map((project) => (
            <li key={project.id}>
              <article className={styles.project} aria-labelledby={`project-${project.id}-title`}>
                <h3 id={`project-${project.id}-title`} className={styles.projectTitle} data-reveal>
                  {project.title}
                </h3>
                <p className={styles.projectSummary} data-reveal>
                  {project.summary}
                </p>
                {project.metrics.length > 0 && (
                  <dl className={styles.metrics} data-reveal>
                    {project.metrics.map((metric) => (
                      <div key={metric.label} className={styles.metric}>
                        <dt>{metric.label}</dt>
                        <dd>{metric.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {project.metricsNote && (
                  <p className={styles.metricsNote} data-reveal>
                    {project.metricsNote}
                  </p>
                )}
                <ul className={styles.highlights}>
                  {project.highlights.map((highlight) => (
                    <li key={highlight} data-reveal>
                      {highlight}
                    </li>
                  ))}
                </ul>
                <p className={styles.stack} data-reveal>
                  <span className={styles.visuallyHidden}>Technologies: </span>
                  {project.stack.join("  ·  ")}
                </p>
                <ul className={styles.projectLinks} data-reveal>
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <ProjectAnchor link={link} />
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
