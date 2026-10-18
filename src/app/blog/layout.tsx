import { Source_Serif_4 } from "next/font/google";
import { profile } from "@/data/career";
import { Navigation } from "@/components/Navigation/Navigation";
import styles from "@/components/Blog/Blog.module.scss";

// Long-form body text, loaded only on /blog so the journey page doesn't pay for it.
const reading = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-reading",
  display: "swap",
});

/** Shared frame for /blog: light, full-width reading pages with no 3D scene. */
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${styles.shell} ${reading.variable}`} data-surface="paper">
      <Navigation page="blog" />
      <main id="main" className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <p>
          © 2025 {profile.name} · <a href="/blog/rss.xml">RSS feed</a>
        </p>
      </footer>
    </div>
  );
}
