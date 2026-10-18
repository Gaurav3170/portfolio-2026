import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { profile } from "@/data/career";
import { getAllPosts, getPost, isScheduled } from "@/lib/blog";
import { formatPostDate } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import { PostBody } from "@/components/Blog/PostBody";
import { TagList } from "@/components/Blog/PostList";
import styles from "@/components/Blog/Blog.module.scss";

interface PostPageProps {
  params: { slug: string };
}

// Every post is pre-rendered; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PostPageProps): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: `${post.title} — ${profile.name}`,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    robots: post.draft || isScheduled(post) ? { index: false } : undefined,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [profile.name],
      tags: post.tags,
    },
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const linkedIn = profile.contacts.find((contact) => contact.label === "LinkedIn");

  // Structured data so search engines can show the post as an article.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    keywords: post.tags.join(", "),
    url: `${siteUrl}/blog/${post.slug}`,
    author: { "@type": "Person", name: profile.name, jobTitle: profile.title },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Full-width title band. */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href="/blog" className={styles.back}>
            <span aria-hidden="true">←</span> All posts
          </Link>
          <p className={styles.meta}>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
            {post.updated && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Updated <time dateTime={post.updated}>{formatPostDate(post.updated)}</time>
                </span>
              </>
            )}
            {post.draft && <span className={styles.draftBadge}>Draft — hidden in production</span>}
            {!post.draft && isScheduled(post) && (
              <span className={styles.draftBadge}>Scheduled — goes live {formatPostDate(post.date)}</span>
            )}
          </p>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <p className={styles.heroLede}>{post.description}</p>
          {post.tags.length > 0 && <TagList tags={post.tags} />}
        </div>
      </header>

      {/* Body and an "On this page" sidebar share the full width on large screens. */}
      <div className={styles.articleLayout}>
        <div className={styles.articleMain}>
          <PostBody source={post.body} />
          <footer className={styles.articleFooter}>
            <p>
              Written by {profile.name}, {profile.title}.
              {linkedIn && (
                <>
                  {" "}
                  Questions or a different take?{" "}
                  <a href={linkedIn.href} target="_blank" rel="noopener noreferrer">
                    Tell me on LinkedIn
                  </a>
                  .
                </>
              )}
            </p>
          </footer>
        </div>

        {post.headings.length > 1 && (
          <aside className={styles.toc}>
            <nav aria-label="On this page">
              <p className={styles.tocTitle}>On this page</p>
              <ol className={styles.tocList}>
                {post.headings.map((heading) => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`}>{heading.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
      </div>
    </article>
  );
}
