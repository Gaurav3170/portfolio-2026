"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { journeyStore } from "@/lib/journeyStore";
import { cameraCurve, progressToCurveT } from "./config";

interface CameraRigProps {
  /** Damping toward the scroll target. 1 snaps instantly (reduced motion). */
  smoothing: number;
  pointerParallax: boolean;
}

/** How far ahead along the path the camera looks, in world units. */
const LOOK_DISTANCE = 12;

/**
 * Moves the camera along the journey curve. The target comes only from scroll
 * progress, so the motion is deterministic and reverses exactly when scrolling up;
 * the per-frame damping only smooths how fast the camera catches up.
 */
export function CameraRig({ smoothing, pointerParallax }: CameraRigProps) {
  const camera = useThree((state) => state.camera);
  const curveT = useRef(progressToCurveT(journeyStore.progress));
  const position = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());
  const tangent = useRef(new Vector3());
  const parallax = useRef(new Vector3());

  useFrame((state, delta) => {
    const target = progressToCurveT(journeyStore.progress);
    // Frame-rate independent exponential damping; delta is capped so a tab
    // returning from the background doesn't fling the camera.
    const k = smoothing >= 1 ? 1 : 1 - Math.exp(-smoothing * Math.min(delta, 0.1) * 60);
    curveT.current += (target - curveT.current) * k;

    cameraCurve.getPointAt(curveT.current, position.current);
    // Look along the curve's tangent rather than at a clamped point ahead: near the
    // end of the curve that point collapses onto the camera and lookAt tips the view
    // straight down at the floor.
    cameraCurve.getTangentAt(Math.min(curveT.current, 0.999), tangent.current);
    lookTarget.current.copy(position.current).addScaledVector(tangent.current, LOOK_DISTANCE);

    if (pointerParallax) {
      parallax.current.x += (state.pointer.x * 0.6 - parallax.current.x) * 0.05;
      parallax.current.y += (state.pointer.y * 0.35 - parallax.current.y) * 0.05;
      position.current.add(parallax.current);
    }

    camera.position.copy(position.current);
    // Look slightly below the path so the floor grid frames the view.
    lookTarget.current.y -= 1.2;
    camera.lookAt(lookTarget.current);
  });

  return null;
}
