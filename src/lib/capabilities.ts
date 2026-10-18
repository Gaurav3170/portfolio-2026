/** Browser-only capability checks. Never call these during server rendering. */

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    const supported = context !== null;
    (context as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
    return supported;
  } catch {
    return false;
  }
}

export type QualityTier = "high" | "low";

/** Phones, tablets and low-core machines get the simplified scene. */
export function detectQuality(): QualityTier {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 900;
  const cores = navigator.hardwareConcurrency ?? 8;
  return coarse || narrow || cores <= 4 ? "low" : "high";
}
