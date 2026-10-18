# Gaurav Keswani — Portfolio
https://www.gauravkeswani.vercel.app

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

All career content lives in **`src/data/career.ts`** — name, intro, every role, highlights, stack and contact
links. Components never hard-code career text.

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
date: "2026-10-18"        # quoted YYYY-MM-DD
updated: "2026-11-02"     # optional
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
- Three.js is code-split and loads after the content paints. First Load JS for `/` is ~138 kB.
- Instanced geometry, no textures or model files, capped DPR, adaptive resolution when frame rate drops, and
  rendering pauses while the tab is hidden.
- Phones and low-core devices get a lighter scene (fewer instances and particles, no antialiasing or parallax).
- `prefers-reduced-motion`: the camera snaps instead of gliding, reveals are instant, particles stop drifting.
- No WebGL: a static gradient backdrop with all the same content.

## Adding the projects section later

1. Add a `projects` chapter to `chapters` in `src/data/career.ts`, before `contact`.
2. Add a `projects` scene id and zone in `src/scene/config.ts`.
3. Render a `<Projects />` section in `src/app/page.tsx` where the `TODO(projects)` comment is.
4. Uncomment the Projects link in `src/components/Navigation/Navigation.tsx`.

The camera path, atmosphere and chapter rail are all generated from `chapters`, so nothing else needs to change.
