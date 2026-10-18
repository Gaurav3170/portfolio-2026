"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters } from "@/data/career";
import { journeyStore } from "@/lib/journeyStore";
import { prefersReducedMotion } from "@/lib/capabilities";
import { lerp, locate } from "@/lib/math";
import { focusStops } from "@/lib/timeline";

/**
 * Scroll offsets at which each chapter's section is centred in the viewport.
 * Measured from the DOM, so the camera arrives at chapter N exactly when its
 * text is centred — whatever the section heights or viewport size.
 */
function measureAnchors(): number[] {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const anchors = chapters.map((chapter, index) => {
    if (index === 0) return 0;
    if (index === chapters.length - 1) return maxScroll;
    const section = document.getElementById(chapter.id);
    if (!section) return (maxScroll * chapter.focus);
    const rect = section.getBoundingClientRect();
    const center = rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2;
    return Math.min(maxScroll, Math.max(0, center));
  });
  // Guarantee strictly increasing anchors so the mapping never divides by zero.
  for (let i = 1; i < anchors.length; i += 1) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
  return anchors;
}

/** Piecewise-linear map from a scroll offset to journey progress (chapter focus space). */
function scrollToProgress(scroll: number, anchors: number[]): number {
  const { index, local } = locate(anchors, scroll);
  return lerp(focusStops[index], focusStops[index + 1], local);
}

/**
 * Connects native page scroll to the journey. Nothing is pinned or hijacked:
 * the document scrolls normally (wheel, touch, keyboard, scrollbar, anchor links)
 * and ScrollTrigger only reads that position.
 */
export function ScrollDriver() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reducedMotion = prefersReducedMotion();
    let anchors = measureAnchors();

    const update = () => {
      journeyStore.progress = scrollToProgress(window.scrollY, anchors);
    };

    const onRefresh = () => {
      anchors = measureAnchors();
      update();
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: update,
      });

      chapters.forEach((chapter, index) => {
        const section = document.getElementById(chapter.id);
        if (!section) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) journeyStore.setActiveIndex(index);
          },
        });

        const items = section.querySelectorAll<HTMLElement>("[data-reveal]");
        if (items.length === 0) return;

        if (reducedMotion) {
          gsap.set(items, { autoAlpha: 1, y: 0 });
          return;
        }

        if (index === 0) {
          // The opening scene plays once on load rather than waiting for scroll.
          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 32 },
            { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.14, delay: 0.2 },
          );
          return;
        }

        // Scrubbed to scroll: deterministic, reverses exactly when scrolling up,
        // and can't be left half-played by fast scrolling.
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
            stagger: 0.12,
            scrollTrigger: { trigger: section, start: "top 80%", end: "top 30%", scrub: 0.6 },
          },
        );
      });
    });

    update();
    // Layout can shift once web fonts arrive; re-measure everything then.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      ctx.revert();
    };
  }, []);

  return null;
}
