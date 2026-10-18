# Gaurav Keswani — Portfolio
https://gauravkeswani.vercel.app

A scroll-driven 3D journey through my engineering career, from the present day back to where it started.

**Concept — "From Blueprint to Structure":** the camera travels down one architectural corridor. The present is
dense glass and metal under cold, precise light; each earlier role has less structure, until 2019 is only warm
blueprint lines. The environment itself tells the story of growth.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint
npm run typecheck
```

Requires Node 18.17+. The project `.npmrc` pins the public npm registry.

## Editing content

All career content lives in **`src/data/career.ts`** — name, intro, every role, highlights, stack, projects and
contact links. Components never hard-code career text.

### Adding a project

Add an entry to `projects` in `src/data/career.ts`. Every project needs its source link, at least one post about
how it was built, and metrics with a `metricsNote` saying how they were measured.

### Updating the resume download

The resume is served from **`public/Gaurav_Keswani_Resume.pdf`** and linked from two places: the "Resume" button
in the top navigation and the "Download resume" button in the Contact scene. To update it, replace that file and
keep the same name. Visitors' browsers save it as the `fileName` set under `profile.resume` in
`src/data/career.ts`.

## Writing a blog post

Posts live in **`src/content/blog/`** as `.mdx` files; the file name is the URL (`/blog/<file-name>`).

```mdx
---
title: "Post title"
description: "One or two sentences for the index, search results and link previews."
date: "2026-09-15"        # quoted YYYY-MM-DD; a future date stays hidden until a build on or after it
updated: "2026-10-18"     # optional
tags: ["Performance", "Next.js"]
draft: true               # drafts show in `npm run dev` only
---
```

- Code blocks are highlighted at build time. Add a title and highlight lines with ` ```ts title="file.ts" {2-4} `.
- `<Callout title="…">…</Callout>` renders an aside.
- Any `TODO(author)` note in a post with `draft: false` fails the build, so unfinished posts can't ship.
- Set `NEXT_PUBLIC_SITE_URL` in the deployment environment so canonical URLs, the RSS feed (`/blog/rss.xml`) and
  `sitemap.xml` use the real domain.

## Architecture

```
            Server (static HTML)                         Browser
 ┌──────────────────────────────────┐   ┌───────────────────────────────────────────┐
 │ data/career.ts ──► Chapters/*    │   │ ScrollDriver (GSAP ScrollTrigger)         │
 │   every heading, link and line   │──►│   native scroll ──► journeyStore.progress │
 │   of content, rendered at build  │   │                          │ read per frame │
 └──────────────────────────────────┘   │ JourneyBackdrop          ▼                │
                                        │   idle ──► import("scene/JourneyCanvas")  │
                                        │            compileAsync ──► first frame   │
                                        │            ──► fade in over the gradient  │
                                        └───────────────────────────────────────────┘
```

```
src/
  app/                 layout (fonts, metadata) and the server-rendered page
    blog/              /blog index, /blog/[slug] posts and /blog/rss.xml (all static)
  content/blog/        blog posts as MDX
  data/career.ts       single source of truth for content + the chapter timeline
  types/career.ts      typed content model
  components/
    Chapters/          semantic HTML for every chapter (server components)
    Journey/           JourneyBackdrop (client island) + ScrollDriver
    Navigation/        top nav + chapter rail
  scene/               everything Three.js — loaded only in the browser
    config.ts          camera curve, zone layout, per-chapter atmosphere
    CameraRig.tsx      moves the camera along the curve from scroll progress
    Atmosphere.tsx     blends fog, light and blueprint grid along the journey
    Architecture.tsx   instanced glass + metal per era (2 draw calls each)
    Blueprint.tsx      wireframe of the 2019 era
  lib/
    journeyStore.ts    scroll progress shared with the render loop, without React renders
    timeline.ts        chapter focus values (deliberately free of Three.js)
```

### How scroll drives the scene

1. The page scrolls natively — no pinning, no scroll-jacking. Wheel, touch, keyboard, scrollbar and anchor links
   all work.
2. `ScrollDriver` measures where each chapter's section is centred, and maps scroll position to journey progress
   piecewise, so the camera arrives at a chapter exactly when its text is centred — at any viewport size.
3. The progress value goes into a plain mutable store. The render loop reads it every frame; React never
   re-renders on scroll.
4. `CameraRig` derives its target purely from progress (deterministic and exactly reversible) and damps toward
   it, so fast scrolling can never leave the scene in a broken state.

### Performance and accessibility

- Every heading, link and line of content is server-rendered HTML; the canvas is decoration (`aria-hidden`).
- Three.js is code-split and mounts when the browser is idle after the content paints. First Load JS for `/` is
  147 kB; the scene adds ~211 kB (gzipped) afterwards.
- Shaders compile with `compileAsync` (parallel, off the main thread) before the render loop starts, instead of
  blocking the first frame.
- Instanced geometry, no textures or model files, capped DPR, adaptive resolution when frame rate drops, and
  rendering pauses while the tab is hidden.
- Phones and low-core devices get a lighter scene (fewer instances and particles, no antialiasing or parallax).
- `prefers-reduced-motion`: the camera snaps instead of gliding, reveals are instant, particles stop drifting.
- No WebGL: a static gradient backdrop with all the same content.

## Measurements

Lighthouse 12.8.2 against `npm run build && npm run start`, Chrome 155 headless on a Windows laptop with integrated
Intel graphics (real GPU, not software WebGL). Median of five runs per form factor, October 2026.

| Home page                          | Before   | After shader warm-up |
| ---------------------------------- | -------- | -------------------- |
| Desktop Performance                | 74       | **98**               |
| Desktop Total Blocking Time        | 647 ms   | **115 ms**           |
| Mobile Performance                 | 55       | **68**               |
| Mobile Total Blocking Time         | 2,968 ms | **1,233 ms**         |
| Mobile LCP                         | 3.9 s    | **3.0 s**            |
| Accessibility / Best Practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 |

**What changed:** a CPU profile showed 517 ms of main-thread time inside Three.js's shader link check, because the
first frame waited for the GPU driver to compile every shader. Compiling with `compileAsync` before the render loop
starts cut that to 7 ms; mounting the scene on `requestIdleCallback` keeps it clear of hydration.

**What's left:** on mobile (simulated 4× CPU slowdown) the remaining blocking time is React hydration and GSAP
ScrollTrigger setup, not the 3D scene.

To reproduce, serve the production build and run
`npx lighthouse http://localhost:3000/ --preset=desktop` (and again without `--preset` for mobile).
