import { profile } from "@/data/career";
import { ResumeLink } from "@/components/Resume/ResumeLink";
import styles from "./Chapters.module.scss";

/** Scene 5 — the next chapter. */
export function Contact() {
  return (
    <section id="contact" className={`${styles.chapter} ${styles.contact}`} aria-labelledby="contact-title">
      <div className={styles.contactInner}>
        <p className={styles.eyebrow} data-reveal>
          The next chapter
        </p>
        <h2 id="contact-title" className={styles.contactTitle} data-reveal>
          Let&rsquo;s build what comes next.
        </h2>
        <p className={styles.lede} data-reveal>
          {profile.closingStatement}
        </p>
        <div className={styles.resumeAction} data-reveal>
          <ResumeLink />
        </div>
        <ul className={styles.contactList}>
          {profile.contacts.map((contact) => (
            <li key={contact.label} data-reveal>
              <a
                className={styles.contactLink}
                href={contact.href}
                {...(contact.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className={styles.contactLabel}>{contact.label}</span>
                <span>{contact.display}</span>
              </a>
            </li>
          ))}
        </ul>
        {/* Reserved: the projects chapter will be inserted before this section. */}
        <p className={styles.reserved} data-reveal>
          Selected projects — coming soon.
        </p>
      </div>
      <footer className={styles.footer}>
        <p>
          © 2025 {profile.name}
        </p>
      </footer>
    </section>
  );
}
