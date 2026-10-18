import type { ComponentPropsWithoutRef } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import styles from "./Blog.module.scss";

/** An aside for tips and caveats. Usage in MDX: <Callout title="Watch out">…</Callout> */
function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className={styles.callout}>
      {title && <p className={styles.calloutTitle}>{title}</p>}
      {children}
    </aside>
  );
}

/** External links open in a new tab; in-page and same-site links behave normally. */
function Anchor({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const external = /^https?:\/\//.test(href);
  return <a href={href} {...props} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} />;
}

const components = { a: Anchor, Callout };

/**
 * Compiles and renders a post on the server. Syntax highlighting happens at build
 * time, so code blocks ship as plain styled HTML with no client JavaScript.
 */
export function PostBody({ source }: { source: string }) {
  return (
    <div className={styles.prose}>
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: "github-light", keepBackground: false }]],
          },
        }}
      />
    </div>
  );
}
