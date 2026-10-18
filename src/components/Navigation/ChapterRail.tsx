"use client";

import { chapters, experiences } from "@/data/career";
import { useActiveChapter } from "@/hooks/useActiveChapter";
import styles from "./ChapterRail.module.scss";

const yearFor = (id: string): string => {
  if (id === "intro") return "Now";
  if (id === "contact") return "Next";
  const experience = experiences.find((item) => item.id === id);
  return experience ? String(experience.start.year) : "";
};

/** A vertical timeline of the journey. Every marker is a real anchor link. */
export function ChapterRail() {
  const activeIndex = useActiveChapter();

  return (
    <nav className={styles.rail} aria-label="Career timeline">
      <ol className={styles.list}>
        {chapters.map((chapter, index) => {
          const active = index === activeIndex;
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                className={active ? `${styles.marker} ${styles.markerActive}` : styles.marker}
                aria-current={active ? "step" : undefined}
              >
                <span className={styles.year}>{yearFor(chapter.id)}</span>
                <span className={styles.label}>{chapter.label}</span>
                <span className={styles.tick} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
