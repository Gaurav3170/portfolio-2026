"use client";

import { zoneZ } from "./config";

/**
 * The closing scene: one calm, unfinished monolith. Its open top marks the space
 * reserved for the future projects chapter.
 */
export function Monolith() {
  // Set well back and off-axis so it frames the closing text instead of cutting through it.
  const z = zoneZ.next - 22;
  return (
    <group position={[16, 0, z]} rotation={[0, -0.45, 0]}>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[3.2, 11, 0.6]} />
        <meshStandardMaterial color="#1a1d24" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 8.6, 0]}>
        <boxGeometry args={[3.2, 0.06, 0.62]} />
        <meshBasicMaterial color="#e8e2d6" />
      </mesh>
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4, 4.05, 96]} />
        <meshBasicMaterial color="#e8e2d6" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
