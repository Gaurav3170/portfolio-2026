import type { Metadata } from "next";
import { profile } from "@/data/career";
import { getAllPosts } from "@/lib/blog";
import { PostList } from "@/components/Blog/PostList";
import { PerfDemoWidget } from "@/components/Blog/PerfDemoWidget";
import styles from "@/components/Blog/Blog.module.scss";

const description =
  "Notes on frontend architecture, web performance, production reliability and AI-assisted engineering.";

export const metadata: Metadata = {
  title: `Blog — ${profile.name}`,
  description,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
  openGraph: { title: `Blog — ${profile.name}`, description, type: "website", url: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Writing</p>
          <h1 className={styles.title}>Field notes from production.</h1>
          <p className={styles.heroLede}>{description}</p>
          <PerfDemoWidget />
        </div>
      </header>
      <div className={styles.listLayout}>
        <PostList posts={getAllPosts()} />
      </div>
    </>
  );
}
