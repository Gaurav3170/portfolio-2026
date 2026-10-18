export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const smoothstep = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

/** Deterministic PRNG so the generated architecture is identical on every load. */
export function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Finds the segment of a sorted keyframe list that contains `t` and returns its
 * index plus the local 0–1 position within that segment.
 */
export function locate(stops: readonly number[], t: number): { index: number; local: number } {
  if (t <= stops[0]) return { index: 0, local: 0 };
  const last = stops.length - 1;
  if (t >= stops[last]) return { index: last - 1, local: 1 };
  let index = 0;
  while (index < last - 1 && t > stops[index + 1]) index += 1;
  const span = stops[index + 1] - stops[index];
  return { index, local: span === 0 ? 0 : (t - stops[index]) / span };
}
