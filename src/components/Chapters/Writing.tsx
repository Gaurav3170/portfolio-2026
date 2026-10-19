import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import styles from "./Chapters.module.scss";

/** Scene 7 — the blog, between the work and the closing scene. */
export function Writing() {
  const count = getAllPosts().length;

  return (
    <section id="writing" className={styles.chapter} aria-labelledby="writing-title">
      <div className={styles.panel}>
        <p className={styles.chapterIndex} data-reveal>
          <span>Blog</span>
          <span className={styles.rule} aria-hidden="true" />
          <span>Field notes</span>
        </p>
        <h2 id="writing-title" className={styles.role} data-reveal>
          Notes from production.
        </h2>
        <p className={styles.narrative} data-reveal>
          The decisions behind the work: frontend architecture, web performance, production reliability and
          AI-assisted engineering, written up once the numbers were in.
        </p>
        <p className={styles.writingHint} data-reveal>
          {count > 0
            ? `${count} ${count === 1 ? "post" : "posts"} so far. Open the blog to browse them all.`
            : "The first posts are being written. Check back soon."}
        </p>
        <div className={styles.writingAction} data-reveal>
          <Link className={styles.writingButton} href="/blog">
            Read the blog
            <span className={styles.writingArrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
