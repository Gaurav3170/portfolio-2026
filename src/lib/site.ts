/**
 * Public origin of the deployed site, used for canonical URLs, link previews and the RSS feed.
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment (e.g. https://gauravkeswani.dev).
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
