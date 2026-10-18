import { chapters } from "@/data/career";

/**
 * Chapter focus values on the 0–1 journey timeline.
 * Kept free of Three.js imports so DOM-side code can use it without pulling the
 * 3D bundle into the initial page load.
 */
export const focusStops: readonly number[] = chapters.map((chapter) => chapter.focus);
