import { profile } from "@/data/career";
import styles from "./ResumeLink.module.scss";

interface ResumeLinkProps {
  /** "primary" is the Contact-scene call to action; "compact" sits in the top navigation. */
  variant?: "primary" | "compact";
}

/** A plain download link — works without JavaScript and is announced as a download. */
export function ResumeLink({ variant = "primary" }: ResumeLinkProps) {
  const { href, fileName, meta } = profile.resume;

  if (variant === "compact") {
    return (
      <a className={styles.compact} href={href} download={fileName}>
        Resume
        <span className={styles.visuallyHidden}> (download {meta})</span>
      </a>
    );
  }

  return (
    <a className={styles.primary} href={href} download={fileName}>
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M8 2v8.5M4.5 7 8 10.5 11.5 7M3 13.5h10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={styles.text}>
        <span className={styles.label}>Download resume</span>
        <span className={styles.meta}>{meta}</span>
      </span>
    </a>
  );
}
