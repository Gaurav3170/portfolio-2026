import type { Experience } from "@/types/career";
import { formatDate, toDateTime } from "@/lib/format";
import styles from "./Chapters.module.scss";

interface ExperienceChapterProps {
  experience: Experience;
  /** Position in the journey, e.g. "01". */
  index: string;
  /** The earliest chapter gets the softer, warmer treatment. */
  variant?: "default" | "beginning";
}

/** One career milestone. Content is semantic HTML; the 3D scene only sits behind it. */
export function ExperienceChapter({ experience, index, variant = "default" }: ExperienceChapterProps) {
  const titleId = `${experience.id}-title`;
  const { start, end } = experience;

  return (
    <section
      id={experience.id}
      className={variant === "beginning" ? `${styles.chapter} ${styles.beginning}` : styles.chapter}
      aria-labelledby={titleId}
    >
      <article className={styles.panel}>
        <p className={styles.chapterIndex} data-reveal>
          <span>{index}</span>
          <span className={styles.rule} aria-hidden="true" />
          <span>
            <time dateTime={toDateTime(start)}>{formatDate(start)}</time>
            {" – "}
            {end ? <time dateTime={toDateTime(end)}>{formatDate(end)}</time> : "Present"}
          </span>
        </p>
        <h2 id={titleId} className={styles.role} data-reveal>
          {experience.title}
        </h2>
        <p className={styles.company} data-reveal>
          {experience.company} · {experience.location}
        </p>
        <p className={styles.narrative} data-reveal>
          {experience.narrative}
        </p>
        <ul className={styles.highlights}>
          {experience.highlights.map((highlight) => (
            <li key={highlight} data-reveal>
              {highlight}
            </li>
          ))}
        </ul>
        <p className={styles.stack} data-reveal>
          <span className={styles.visuallyHidden}>Technologies: </span>
          {experience.stack.join("  ·  ")}
        </p>
      </article>
    </section>
  );
}
