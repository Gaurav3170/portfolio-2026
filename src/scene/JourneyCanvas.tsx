"use client";

import { useCallback, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import type { QualityTier } from "@/lib/capabilities";
import { Architecture } from "./Architecture";
import { Atmosphere } from "./Atmosphere";
import { Blueprint } from "./Blueprint";
import { CameraRig } from "./CameraRig";
import { structureSpecs } from "./config";
import { Monolith } from "./Monolith";
import { Particles } from "./Particles";

export interface JourneyCanvasProps {
  quality: QualityTier;
  reducedMotion: boolean;
  onReady?: () => void;
}

const DPR: Record<QualityTier, [number, number]> = {
  high: [1, 1.75],
  low: [0.75, 1.25],
};

/**
 * Drops the render resolution when frames run long and recovers it when they
 * are fast again, so slower GPUs stay smooth instead of stuttering.
 */
function AdaptiveResolution({ range }: { range: [number, number] }) {
  const setDpr = useThree((state) => state.setDpr);
  const [min, max] = range;
  const state = useState(() => ({ dpr: Math.min(max, window.devicePixelRatio), elapsed: 0, frames: 0 }))[0];

  useFrame((_, delta) => {
    state.elapsed += delta;
    state.frames += 1;
    if (state.elapsed < 1) return;
    const fps = state.frames / state.elapsed;
    state.elapsed = 0;
    state.frames = 0;
    const next = fps < 48 ? Math.max(min, state.dpr - 0.25) : fps > 58 ? Math.min(max, state.dpr + 0.1) : state.dpr;
    if (next !== state.dpr) {
      state.dpr = next;
      setDpr(next);
    }
  });
  return null;
}

/**
 * Compiles every shader before the first frame. A plain first render compiles them
 * synchronously and blocks the main thread while the GPU driver links each program;
 * compileAsync lets the driver work in parallel (KHR_parallel_shader_compile) while
 * the page stays responsive. Rendered last, so its effect runs after the atmosphere
 * has set the fog the shaders depend on.
 */
function ShaderWarmup({ onCompiled }: { onCompiled: () => void }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) onCompiled();
    };
    // If warm-up fails, the first frame simply compiles synchronously as before.
    gl.compileAsync(scene, camera).then(done, done);
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera, onCompiled]);
  return null;
}

/** Fires once after the first frame is drawn, so the canvas can fade in. */
function FirstFrame({ onReady }: { onReady?: () => void }) {
  const [done, setDone] = useState(false);
  useFrame(() => {
    if (!done) {
      setDone(true);
      onReady?.();
    }
  });
  return null;
}

export default function JourneyCanvas({ quality, reducedMotion, onReady }: JourneyCanvasProps) {
  const [visible, setVisible] = useState(true);
  const [compiled, setCompiled] = useState(false);
  const onCompiled = useCallback(() => setCompiled(true), []);
  const density = quality === "high" ? 1 : 0.55;

  // Stop rendering entirely while the tab is hidden.
  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <Canvas
      dpr={DPR[quality]}
      frameloop={visible && compiled ? "always" : "never"}
      camera={{ fov: 50, near: 0.1, far: 140, position: [0, 0.4, 14] }}
      gl={{
        antialias: quality === "high",
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
      aria-hidden
    >
      <AdaptiveResolution range={DPR[quality]} />
      <FirstFrame onReady={onReady} />
      <CameraRig smoothing={reducedMotion ? 1 : 0.075} pointerParallax={!reducedMotion && quality === "high"} />
      <Atmosphere />
      <Particles count={quality === "high" ? 1800 : 600} animate={!reducedMotion} />
      {structureSpecs.map((spec) => (
        <Architecture key={spec.sceneId} spec={spec} density={density} />
      ))}
      <Blueprint />
      <Monolith />
      <ShaderWarmup onCompiled={onCompiled} />
    </Canvas>
  );
}
