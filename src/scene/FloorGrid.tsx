"use client";

import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial } from "three";
import { JOURNEY_END_Z, JOURNEY_START_Z } from "./config";

interface FloorGridProps {
  /** Material is owned by the atmosphere controller so its opacity can follow the timeline. */
  material: LineBasicMaterial;
}

/** A blueprint grid underfoot, faint in the present and dominant at the beginning. */
export function FloorGrid({ material }: FloorGridProps) {
  const geometry = useMemo(() => {
    const points: number[] = [];
    const halfWidth = 24;
    const step = 3;
    for (let x = -halfWidth; x <= halfWidth; x += step) {
      points.push(x, -3, JOURNEY_START_Z, x, -3, JOURNEY_END_Z);
    }
    for (let z = JOURNEY_START_Z; z >= JOURNEY_END_Z; z -= step) {
      points.push(-halfWidth, -3, z, halfWidth, -3, z);
    }
    const buffer = new BufferGeometry();
    buffer.setAttribute("position", new Float32BufferAttribute(points, 3));
    return buffer;
  }, []);

  return <lineSegments geometry={geometry} material={material} />;
}
