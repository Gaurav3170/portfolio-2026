# Upcoming Ideas

The plan for the Projects and Blog sections, in the order to build them. Pick the next unchecked item, ship it, tick it off.

**The story every item should support:** a Staff frontend engineer who keeps large commerce platforms fast, secure and stable at peak load, and who uses AI to speed up engineering work.

## Rules for anything published

- **No client names, internal system names, account IDs, dashboard links or code from work repos.** Rebuild patterns from scratch in public projects; explain ideas in plain language in posts.
- **Use only numbers you can back up.** Measured results, or relative figures ("about 2x") when exact numbers are internal.
- **Every project ships with** a live demo, a README with an architecture diagram, and before/after measurements.
- **Every post is finished copy.** Drafts stay `draft: true` until complete; the build blocks publishing a post with a `TODO(author)` note.
- **Pair them.** Each project gets at least one post about how and why it was built.

---

## Projects

Status: ☐ not started · ◐ in progress · ☑ shipped

### 1. ☐ This portfolio

The site itself: a scroll-driven 3D journey built with Next.js, React Three Fiber and GSAP, with server-rendered content and a fast reading blog.

- **Why first:** it already exists, so it's the cheapest project to ship.
- **Show:** how the 3D scene stays fast (code-split canvas, lighter scene on weak devices, no WebGL fallback, reduced-motion support) and the Core Web Vitals numbers.
- **To do:** add the `projects` chapter to the scroll journey (see "Adding the projects section later" in `README.md`), then make this the first entry.
- **Pairs with:** blog #2.

### 2. ☐ Perf Budget Guard

A GitHub Action and CLI that runs Lighthouse on every pull request, compares Core Web Vitals (especially INP), bundle size and server render time against a budget, and posts a short diff as a PR comment.

- **Why:** turns real performance work and the PR checklist habit into a tool anyone can install.
- **Stack:** Node, TypeScript, GitHub Actions, Lighthouse CI.
- **Stretch:** an AI summary explaining why a regression happened ("this PR added a 90 KB dependency to the first page load").
- **Pairs with:** blog #3.

### 3. ☐ MCP server and agent skills for frontend engineering

An open-source MCP server exposing tools like `analyze_bundle`, `audit_dependencies`, `run_lighthouse` and `find_unoptimized_images` to any AI coding agent, plus a set of Claude Code skills: dependency-vulnerability fixer, Next.js upgrade assistant, accessibility auditor.

- **Why:** agentic engineering is where the industry is heading, and there's real experience behind it (team-adopted skills, a hackathon placing). Few frontend engineers publish tooling here.
- **Keep it generic:** nothing tied to any company's repos or conventions.
- **Pairs with:** blog #4.

### 4. ☐ BFF performance lab

A demo Node.js backend-for-frontend with toggles that show each fix as a before/after experiment: sequential vs parallel fetching, request de-duplication, shared-content caching, connection reuse, timeouts, and request-scoped user context. Includes k6 load-test scripts and OpenTelemetry traces.

- **Why:** you can't share work code, but you can rebuild the patterns from scratch and let people run the numbers themselves.
- **Pairs with:** blog #5 and blog #1 (already published).

### 5. ☐ Micro-frontend commerce reference architecture

A small storefront: a shell app plus product, cart and checkout micro-frontends using Module Federation, a shared design system and a Node BFF, with the same pages rebuilt using React Server Components (Next.js App Router) for comparison.

- **Why:** "When should you not use micro-frontends?" is a Staff-level interview question. A working comparison with measured numbers shows judgement.
- **Pairs with:** blog #6.

### 6. ☐ AI shopping assistant with generative UI

A chat assistant over a product catalogue that replies with interactive components (product cards, comparison tables, a cart preview) instead of plain text, using tool calling, streaming and retrieval over product data.

- **Why:** combines commerce experience, chatbot integration work and the generative-UI trend.
- **Show:** speed as a feature: streamed UI, optimistic updates, time to first token.
- **Pairs with:** blog #8.

### 7. ☐ Upgrade codemod kit (quick win)

Codemods (jscodeshift or ast-grep) for common migrations: Pages Router to App Router, Webpack config to Turbopack or Rspack, legacy image components to `next/image`.

- **Why:** packages real experience upgrading build tooling and Node versions across 20+ repositories.
- **Pairs with:** blog #7.

---

## Blogs

Status: ☐ not started · ✎ drafting · ☑ published

### From experience (write these first; nobody else can)

All posts live in `src/content/blog/`; the file name is the URL slug.

**Post dates (about one a month, latest = launch day).** All are in the past, so every post is live.

| Date | Post |
| --- | --- |
| 2025-10-21 | React Compiler (#11), after its 1.0 release on 7 Oct 2025 |
| 2025-11-18 | Micro-frontends vs RSC (#6) |
| 2025-12-16 | INP for commerce (#10) |
| 2026-01-13 | Code review (#9) |
| 2026-02-10 | Upgrading 20+ repositories (#7) |
| 2026-03-17 | Rotating secrets (#8) |
| 2026-04-14 | AI agent skills (#4) |
| 2026-05-12 | Generative UI (#13) |
| 2026-06-16 | Speculation Rules and View Transitions (#12) |
| 2026-07-14 | 3D portfolio (#2) |
| 2026-08-11 | Request isolation (#5) |
| 2026-09-15 | Performance guardrails (#3) |
| 2026-10-18 | Doubling checkout throughput (#1), the latest |

New posts: date them about a month after the latest one. A post dated in the future stays hidden in production (and shows a "Scheduled" label in `npm run dev`) until a build runs on or after its date.

1. ☑ **Doubling checkout throughput under peak load without adding a single server.** `doubling-checkout-throughput-under-peak-load.mdx`
2. ☑ **Shipping a 3D portfolio without killing Core Web Vitals.** Pairs with project #1. `shipping-a-3d-portfolio-without-killing-core-web-vitals.mdx`
3. ☑ **Performance guardrails: keeping a fast site fast.** Pairs with project #2. `performance-guardrails-keeping-a-fast-site-fast.mdx`
4. ☑ **Building AI agent skills my team actually uses.** Pairs with project #3. `building-ai-agent-skills-my-team-actually-uses.mdx`
5. ☑ **Request isolation: the bug that can show one user another user's data.** Pairs with project #4. `request-isolation-the-bug-that-mixes-up-users.mdx`
6. ☑ **Micro-frontends vs React Server Components: an honest comparison.** Pairs with project #5. `micro-frontends-vs-react-server-components.mdx`
7. ☑ **Upgrading 20+ repositories without breaking production.** Pairs with project #7. `upgrading-20-repositories-without-breaking-production.mdx`
8. ☑ **Rotating secrets across many services with zero downtime.** `rotating-secrets-with-zero-downtime.mdx`
9. ☑ **960 pull requests later: what I look for in code review.** `what-i-look-for-in-frontend-code-review.mdx`

### Trends (where experience gives an opinion)

10. ☑ **INP for commerce: making taps and clicks feel instant.** `inp-for-commerce.mdx`
11. ☑ **React Compiler 1.0: what it changes for large codebases, and what it doesn't.** Written as a guide, not a case study. Once it has been tried on a real app, update the post with measured before/after numbers. `react-compiler-what-it-changes-and-what-it-doesnt.mdx`
12. ☑ **Speculation Rules and View Transitions: near-instant navigation for multi-page sites.** Browser support stated as of October 2026; recheck before re-sharing. `speculation-rules-and-view-transitions.mdx`
13. ☑ **Generative UI in commerce.** Pairs with project #6. `generative-ui-in-commerce.mdx`

### Next ideas

- ☐ Follow-ups with real numbers once projects ship: Perf Budget Guard results, BFF performance lab measurements, React Compiler before/after.
- ☐ One short post per shipped project: what it is, why it was built, what was measured.

---

## Housekeeping before going live

- [ ] Upgrade Next.js: `npm audit` reports critical advisories against 14.2.x (a major upgrade, so treat it as its own task).
- [ ] Set `NEXT_PUBLIC_SITE_URL` in the deployment so the RSS feed, sitemap and canonical URLs use the real domain.
- [ ] Move to Node 20+ (some existing dependencies already expect it).
- [ ] Make the resume and the published post use the same performance numbers.
