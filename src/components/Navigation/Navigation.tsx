"use client";

import Link from "next/link";
import { chapters, profile } from "@/data/career";
import { useActiveChapter } from "@/hooks/useActiveChapter";
import { ResumeLink } from "@/components/Resume/ResumeLink";
import styles from "./Navigation.module.scss";

/**
 * Top-level destinations. Chapter links are anchors on the journey page; `ids` are the
 * chapters that light each one up. Experience covers every role chapter.
 */
const links = [
  { href: "#intro", label: "About", ids: ["intro"] },
  { href: "#staff", label: "Experience", ids: ["staff", "associate", "senior", "infosys"] },
  // TODO(projects): add { href: "#projects", label: "Projects", ids: ["projects"] } when the section ships.
  { href: "/blog", label: "Blog", ids: [] },
  { href: "#contact", label: "Contact", ids: ["contact"] },
];

interface NavigationProps {
  /** "journey" is the dark scroll page; "blog" is the light reading pages under /blog. */
  page?: "journey" | "blog";
}

export function Navigation({ page = "journey" }: NavigationProps) {
  const activeIndex = useActiveChapter();
  const onJourney = page === "journey";
  const activeId = onJourney ? chapters[activeIndex]?.id : undefined;
  // Off the journey page, chapter anchors have to point back at it.
  const resolve = (href: string) => (href.startsWith("#") && !onJourney ? `/${href}` : href);

  return (
    <header className={onJourney ? styles.header : `${styles.header} ${styles.headerLight}`}>
      <a className={styles.skipLink} href={onJourney ? "#journey" : "#main"}>
        Skip to content
      </a>
      <a className={styles.monogram} href={resolve("#intro")} aria-label={`${profile.name}, back to start`}>
        GK
      </a>
      <nav aria-label="Primary">
        <ul className={styles.list}>
          {links.map((link) => {
            const isBlog = link.href === "/blog";
            const current = isBlog ? !onJourney : activeId !== undefined && link.ids.includes(activeId);
            const className = current ? `${styles.link} ${styles.linkActive}` : styles.link;
            return (
              <li key={link.href}>
                {isBlog ? (
                  // Client-side navigation, prefetched while the nav is on screen, so the blog opens instantly.
                  <Link className={className} href="/blog" aria-current={current ? "page" : undefined}>
                    {link.label}
                  </Link>
                ) : (
                  <a className={className} href={resolve(link.href)} aria-current={current ? "location" : undefined}>
                    {link.label}
                  </a>
                )}
              </li>
            );
          })}
          <li>
            <ResumeLink variant="compact" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
