"use client";

import { useEffect, useRef, useState } from "react";
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
  { href: "#projects", label: "Projects", ids: ["projects"] },
  { href: "/blog", label: "Blog", ids: ["writing"] },
  { href: "#contact", label: "Contact", ids: ["contact"] },
];

/** Must match the breakpoint in Navigation.module.scss where the links fold into the menu. */
const MENU_QUERY = "(max-width: 720px)";

interface NavigationProps {
  /** "journey" is the dark scroll page; "blog" is the light reading pages under /blog. */
  page?: "journey" | "blog";
}

export function Navigation({ page = "journey" }: NavigationProps) {
  const activeIndex = useActiveChapter();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const onJourney = page === "journey";
  const activeId = onJourney ? chapters[activeIndex]?.id : undefined;
  // Off the journey page, chapter anchors have to point back at it.
  const resolve = (href: string) => (href.startsWith("#") && !onJourney ? `/${href}` : href);
  const closeMenu = () => setMenuOpen(false);

  // While the menu is open: freeze the page behind it, close on Escape, and close if
  // the viewport grows past the breakpoint (the menu doesn't exist there).
  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    const query = window.matchMedia(MENU_QUERY);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    const onQuery = () => {
      if (!query.matches) setMenuOpen(false);
    };
    root.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    query.addEventListener("change", onQuery);
    return () => {
      root.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      query.removeEventListener("change", onQuery);
    };
  }, [menuOpen]);

  return (
    <header className={onJourney ? styles.header : `${styles.header} ${styles.headerLight}`}>
      <a className={styles.skipLink} href={onJourney ? "#journey" : "#main"}>
        Skip to content
      </a>
      <a className={styles.monogram} href={resolve("#intro")} aria-label={`${profile.name}, back to start`}>
        GK
      </a>
      {/* Phones keep the resume one tap away in the bar; wider screens show it at the end of the links. */}
      <div className={styles.barResume}>
        <ResumeLink variant="compact" />
      </div>
      <nav aria-label="Primary">
        <button
          ref={toggleRef}
          type="button"
          className={menuOpen ? `${styles.toggle} ${styles.toggleOpen}` : styles.toggle}
          aria-expanded={menuOpen}
          aria-controls="primary-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.visuallyHidden}>Menu</span>
          <span className={styles.toggleBars} aria-hidden="true" />
        </button>
        <ul
          id="primary-menu"
          className={menuOpen ? `${styles.list} ${styles.listOpen}` : styles.list}
          // A tap on the empty backdrop around the links closes the menu.
          onClick={(event) => event.target === event.currentTarget && closeMenu()}
        >
          {links.map((link) => {
            const isBlog = link.href === "/blog";
            const inView = activeId !== undefined && link.ids.includes(activeId);
            const current = isBlog ? !onJourney : inView;
            // Blog also lights up while its teaser chapter is in view on the journey page.
            const className = current || inView ? `${styles.link} ${styles.linkActive}` : styles.link;
            return (
              <li key={link.href}>
                {isBlog ? (
                  // Client-side navigation, prefetched while the nav is on screen, so the blog opens instantly.
                  <Link className={className} href="/blog" aria-current={current ? "page" : undefined} onClick={closeMenu}>
                    {link.label}
                  </Link>
                ) : (
                  <a
                    className={className}
                    href={resolve(link.href)}
                    aria-current={current ? "location" : undefined}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            );
          })}
          <li className={styles.listResume}>
            <ResumeLink variant="compact" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
