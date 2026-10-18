"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Points } from "three";
import { createRandom } from "@/lib/math";
import { JOURNEY_END_Z, JOURNEY_START_Z } from "./config";

interface ParticlesProps {
  count: number;
  animate: boolean;
}

/** Dust suspended in the light along the whole corridor. */
export function Particles({ count, animate }: ParticlesProps) {
  const pointsRef = useRef<Points>(null);

  const geometry = useMemo(() => {
    const random = createRandom(7);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (random() - 0.5) * 34;
      positions[i * 3 + 1] = -3 + random() * 16;
      positions[i * 3 + 2] = JOURNEY_START_Z + random() * (JOURNEY_END_Z - JOURNEY_START_Z);
    }
    const buffer = new BufferGeometry();
    buffer.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return buffer;
  }, [count]);

  useFrame((state) => {
    if (!animate || !pointsRef.current) return;
    // A slow vertical drift; amplitude is tiny so it never competes with reading.
    pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.35;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#c9d8f5"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
