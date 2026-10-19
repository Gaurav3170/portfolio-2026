import { CatmullRomCurve3, Color, Vector3 } from "three";
import { chapters } from "@/data/career";
import type { SceneId } from "@/types/career";
import { lerp, locate, smoothstep } from "@/lib/math";
import { focusStops } from "@/lib/timeline";

/**
 * The journey is one corridor running down the -Z axis. Each career chapter owns a
 * zone along it, and the camera visits the zones in timeline order.
 */
export const ZONE_SPACING = 45;
const CAMERA_STANDOFF = 14;

export const zoneZ: Record<SceneId, number> = {
  present: 0,
  staff: -ZONE_SPACING,
  associate: -ZONE_SPACING * 2,
  senior: -ZONE_SPACING * 3,
  beginning: -ZONE_SPACING * 4,
  projects: -ZONE_SPACING * 5,
  writing: -ZONE_SPACING * 6,
  next: -ZONE_SPACING * 7,
};

/** Lateral sway per chapter, so the camera drifts through space instead of on rails. */
const sway: Record<SceneId, [number, number]> = {
  present: [0, 0.4],
  staff: [1.6, 0.2],
  associate: [-1.8, 0.9],
  senior: [1.4, 0.3],
  beginning: [-1.0, 1.3],
  projects: [1.2, 0.6],
  writing: [-1.4, 0.5],
  next: [0, 0.7],
};

export { focusStops };

const cameraPoints = chapters.map((chapter) => {
  const [x, y] = sway[chapter.sceneId];
  return new Vector3(x, y, zoneZ[chapter.sceneId] + CAMERA_STANDOFF);
});

export const cameraCurve = new CatmullRomCurve3(cameraPoints, false, "centripetal");

/**
 * Converts journey progress (0–1) into a parameter on the camera curve so the camera
 * reaches chapter N exactly at chapter N's focus value. Easing within each segment
 * makes the camera ease into every chapter, giving the visitor time to read.
 */
export function progressToCurveT(progress: number): number {
  const { index, local } = locate(focusStops, progress);
  const eased = lerp(local, smoothstep(local), 0.65);
  return (index + eased) / (focusStops.length - 1);
}

interface AtmosphereKey {
  background: string;
  fog: string;
  fogFar: number;
  key: string;
  keyIntensity: number;
  accent: string;
  /** How strongly the blueprint floor grid shows (the past is all blueprint). */
  blueprint: number;
}

/**
 * Lighting and mood for each chapter, from cold and precise to warm and simple. After the
 * beginning, the projects zone turns cool again: work built today, from those first blueprints.
 * Writing softens toward the closing scene's neutral light.
 */
const atmosphereKeys: Record<SceneId, AtmosphereKey> = {
  present: { background: "#04060c", fog: "#070b16", fogFar: 62, key: "#d4e2ff", keyIntensity: 1.5, accent: "#9fc2ff", blueprint: 0.18 },
  staff: { background: "#03050b", fog: "#060a14", fogFar: 56, key: "#dbe7ff", keyIntensity: 1.7, accent: "#a9c8ff", blueprint: 0.16 },
  associate: { background: "#050710", fog: "#080c18", fogFar: 62, key: "#c9d6f0", keyIntensity: 1.3, accent: "#93b3e6", blueprint: 0.24 },
  senior: { background: "#070810", fog: "#0b0d17", fogFar: 70, key: "#d4cfe4", keyIntensity: 1.05, accent: "#b8b2d8", blueprint: 0.34 },
  beginning: { background: "#0a090b", fog: "#110e0c", fogFar: 78, key: "#ffd9aa", keyIntensity: 0.7, accent: "#f0b36a", blueprint: 0.75 },
  projects: { background: "#05070d", fog: "#090c15", fogFar: 74, key: "#dfe6f5", keyIntensity: 1.25, accent: "#a9c8ff", blueprint: 0.45 },
  writing: { background: "#06070c", fog: "#0b0d14", fogFar: 82, key: "#e9ebf0", keyIntensity: 1.1, accent: "#cdd6e8", blueprint: 0.36 },
  next: { background: "#07080b", fog: "#0d0f14", fogFar: 92, key: "#f2eee8", keyIntensity: 0.95, accent: "#e8e2d6", blueprint: 0.3 },
};

export interface AtmosphereSample {
  background: Color;
  fog: Color;
  fogFar: number;
  key: Color;
  keyIntensity: number;
  accent: Color;
  blueprint: number;
}

const toColors = (key: AtmosphereKey) => ({
  ...key,
  background: new Color(key.background),
  fog: new Color(key.fog),
  key: new Color(key.key),
  accent: new Color(key.accent),
});

const atmosphereStops = chapters.map((chapter) => toColors(atmosphereKeys[chapter.sceneId]));

export function createAtmosphereSample(): AtmosphereSample {
  const first = atmosphereStops[0];
  return {
    background: first.background.clone(),
    fog: first.fog.clone(),
    fogFar: first.fogFar,
    key: first.key.clone(),
    keyIntensity: first.keyIntensity,
    accent: first.accent.clone(),
    blueprint: first.blueprint,
  };
}

/** Blends the two neighbouring chapter atmospheres into `out` without allocating. */
export function sampleAtmosphere(progress: number, out: AtmosphereSample): AtmosphereSample {
  const { index, local } = locate(focusStops, progress);
  const a = atmosphereStops[index];
  const b = atmosphereStops[index + 1];
  const t = smoothstep(local);
  out.background.lerpColors(a.background, b.background, t);
  out.fog.lerpColors(a.fog, b.fog, t);
  out.key.lerpColors(a.key, b.key, t);
  out.accent.lerpColors(a.accent, b.accent, t);
  out.fogFar = lerp(a.fogFar, b.fogFar, t);
  out.keyIntensity = lerp(a.keyIntensity, b.keyIntensity, t);
  out.blueprint = lerp(a.blueprint, b.blueprint, t);
  return out;
}

/** How dense and finished each era's architecture is. */
export interface StructureSpec {
  sceneId: SceneId;
  seed: number;
  arches: number;
  panels: number;
  glassOpacity: number;
  spread: number;
}

export const structureSpecs: StructureSpec[] = [
  { sceneId: "present", seed: 11, arches: 9, panels: 14, glassOpacity: 0.16, spread: 9 },
  { sceneId: "staff", seed: 23, arches: 12, panels: 26, glassOpacity: 0.2, spread: 10 },
  { sceneId: "associate", seed: 37, arches: 9, panels: 16, glassOpacity: 0.15, spread: 11 },
  { sceneId: "senior", seed: 53, arches: 7, panels: 4, glassOpacity: 0.08, spread: 11 },
  { sceneId: "projects", seed: 71, arches: 5, panels: 10, glassOpacity: 0.14, spread: 10 },
  // Few arches and many loose glass sheets, like pages.
  { sceneId: "writing", seed: 89, arches: 4, panels: 18, glassOpacity: 0.11, spread: 10 },
];

/** Corridor extent used by the floor grid and particles. */
export const JOURNEY_START_Z = 24;
export const JOURNEY_END_Z = zoneZ.next - 30;
