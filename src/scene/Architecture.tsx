"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { DoubleSide, InstancedMesh, Matrix4, Object3D } from "three";
import { createRandom } from "@/lib/math";
import { type StructureSpec, zoneZ } from "./config";

interface ArchitectureProps {
  spec: StructureSpec;
  /** Low tier halves the element count. */
  density: number;
}

interface Placement {
  frames: Matrix4[];
  panels: Matrix4[];
}

const dummy = new Object3D();

function snapshot(): Matrix4 {
  dummy.updateMatrix();
  return dummy.matrix.clone();
}

/**
 * Generates one era's architecture: portal arches built from metal beams, and
 * free-standing glass slabs. Everything is instanced so a whole era costs two
 * draw calls, and the seeded PRNG makes the layout identical on every load.
 */
function buildPlacement(spec: StructureSpec, density: number): Placement {
  const random = createRandom(spec.seed);
  const frames: Matrix4[] = [];
  const panels: Matrix4[] = [];
  const centerZ = zoneZ[spec.sceneId];
  const archCount = Math.max(3, Math.round(spec.arches * density));
  const panelCount = Math.round(spec.panels * density);
  const depth = 36;

  for (let i = 0; i < archCount; i += 1) {
    const z = centerZ + depth / 2 - (i / (archCount - 1)) * depth;
    const halfWidth = spec.spread * (0.75 + random() * 0.35);
    const height = 7 + random() * 6;
    const tilt = (random() - 0.5) * 0.05;
    const beam = 0.12 + random() * 0.08;

    // Two pillars and a lintel per arch.
    for (const side of [-1, 1]) {
      dummy.position.set(side * halfWidth, height / 2 - 3, z);
      dummy.rotation.set(0, 0, tilt);
      dummy.scale.set(beam, height, beam);
      frames.push(snapshot());
    }
    dummy.position.set(0, height - 3, z);
    dummy.rotation.set(0, 0, tilt);
    dummy.scale.set(halfWidth * 2 + beam, beam, beam);
    frames.push(snapshot());

    // Occasional floating cross-beams make the newer eras feel engineered.
    if (random() > 0.55) {
      dummy.position.set((random() - 0.5) * halfWidth, height * (0.35 + random() * 0.4) - 3, z - 1.5);
      dummy.rotation.set(0, (random() - 0.5) * 0.6, 0);
      dummy.scale.set(halfWidth * (0.4 + random() * 0.6), beam * 0.6, beam * 0.6);
      frames.push(snapshot());
    }
  }

  for (let i = 0; i < panelCount; i += 1) {
    const side = random() > 0.5 ? 1 : -1;
    const x = side * (spec.spread * (0.35 + random() * 0.75));
    dummy.position.set(x, -1 + random() * 8, centerZ + (random() - 0.5) * depth);
    dummy.rotation.set(0, side * (0.25 + random() * 0.9), (random() - 0.5) * 0.08);
    dummy.scale.set(2 + random() * 4.5, 3 + random() * 5.5, 1);
    panels.push(snapshot());
  }

  return { frames, panels };
}

export function Architecture({ spec, density }: ArchitectureProps) {
  const framesRef = useRef<InstancedMesh>(null);
  const panelsRef = useRef<InstancedMesh>(null);
  const placement = useMemo(() => buildPlacement(spec, density), [spec, density]);

  useLayoutEffect(() => {
    const apply = (mesh: InstancedMesh | null, matrices: Matrix4[]) => {
      if (!mesh) return;
      matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    };
    apply(framesRef.current, placement.frames);
    apply(panelsRef.current, placement.panels);
  }, [placement]);

  return (
    <group>
      <instancedMesh ref={framesRef} args={[undefined, undefined, placement.frames.length]} frustumCulled>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8a93a8" metalness={0.85} roughness={0.32} />
      </instancedMesh>
      {placement.panels.length > 0 && (
        <instancedMesh ref={panelsRef} args={[undefined, undefined, placement.panels.length]} frustumCulled>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#b9cdf2"
            metalness={0.2}
            roughness={0.08}
            transparent
            opacity={spec.glassOpacity}
            side={DoubleSide}
            depthWrite={false}
          />
        </instancedMesh>
      )}
    </group>
  );
}
