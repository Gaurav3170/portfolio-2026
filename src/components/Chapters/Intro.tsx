import { profile } from "@/data/career";
import styles from "./Chapters.module.scss";

/** Scene 1 — the opening viewport. Server-rendered, so it paints before any 3D loads. */
export function Intro() {
  return (
    <section id="intro" className={`${styles.chapter} ${styles.intro}`} aria-labelledby="intro-title">
      <div className={styles.introInner}>
        <p className={styles.eyebrow} data-reveal>
          {profile.title} · {profile.yearsOfExperience} years · {profile.location}
        </p>
        <h1 id="intro-title" className={styles.name} data-reveal>
          {profile.name}
        </h1>
        <p className={styles.headline} data-reveal>
          {profile.headline}
        </p>
        <p className={styles.lede} data-reveal>
          {profile.intro}
        </p>
      </div>
      <a className={styles.scrollCue} href="#staff">
        <span>Begin the journey</span>
        <span className={styles.scrollLine} aria-hidden="true" />
      </a>
    </section>
  );
}
