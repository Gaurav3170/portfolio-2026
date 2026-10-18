"use client";

import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
import { createRandom } from "@/lib/math";
import { zoneZ } from "./config";

/**
 * The beginning of the career: no glass and no metal, just the outlines of the
 * structures that came later, drawn as a single line-segments geometry.
 */
function buildBlueprint(): BufferGeometry {
  const random = createRandom(97);
  const points: number[] = [];
  const centerZ = zoneZ.beginning;
  const segment = (ax: number, ay: number, az: number, bx: number, by: number, bz: number) => {
    points.push(ax, ay, az, bx, by, bz);
  };

  // Wireframe arches — the same silhouettes the later eras build for real.
  for (let i = 0; i < 6; i += 1) {
    const z = centerZ + 15 - i * 6;
    const half = 7 + random() * 3;
    const height = 6 + random() * 4;
    segment(-half, -3, z, -half, height - 3, z);
    segment(half, -3, z, half, height - 3, z);
    segment(-half, height - 3, z, half, height - 3, z);
  }

  // Outlined slabs, as if sketched before they were cut from glass.
  for (let i = 0; i < 10; i += 1) {
    const side = random() > 0.5 ? 1 : -1;
    const x = side * (4 + random() * 6);
    const y = -1 + random() * 6;
    const z = centerZ + (random() - 0.5) * 30;
    const w = 1 + random() * 2;
    const h = 1.5 + random() * 2.5;
    segment(x - w, y - h, z, x + w, y - h, z);
    segment(x + w, y - h, z, x + w, y + h, z);
    segment(x + w, y + h, z, x - w, y + h, z);
    segment(x - w, y + h, z, x - w, y - h, z);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
  return geometry;
}

export function Blueprint() {
  const geometry = useMemo(buildBlueprint, []);
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#f0b36a" transparent opacity={0.55} />
    </lineSegments>
  );
}
