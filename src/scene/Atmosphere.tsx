"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, DirectionalLight, Fog, LineBasicMaterial, PointLight } from "three";
import { journeyStore } from "@/lib/journeyStore";
import { createAtmosphereSample, sampleAtmosphere } from "./config";
import { FloorGrid } from "./FloorGrid";

/**
 * Blends background, fog, light colour and blueprint visibility along the journey,
 * from the cold precision of the present to the warm, simple light of the past.
 */
export function Atmosphere() {
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const keyLight = useRef<DirectionalLight>(null);
  const accentLight = useRef<PointLight>(null);
  const sample = useMemo(createAtmosphereSample, []);
  const gridMaterial = useMemo(
    () => new LineBasicMaterial({ color: "#7f9cd6", transparent: true, opacity: 0.18, depthWrite: false }),
    [],
  );
  const background = useMemo(() => new Color(), []);
  const fog = useMemo(() => new Fog("#070b16", 6, 62), []);

  useEffect(() => {
    scene.background = background;
    scene.fog = fog;
    return () => {
      scene.background = null;
      scene.fog = null;
      gridMaterial.dispose();
    };
  }, [scene, background, fog, gridMaterial]);

  useFrame(() => {
    sampleAtmosphere(journeyStore.progress, sample);
    background.copy(sample.background);
    fog.color.copy(sample.fog);
    fog.far = sample.fogFar;
    gridMaterial.color.copy(sample.accent);
    gridMaterial.opacity = sample.blueprint;

    if (keyLight.current) {
      keyLight.current.color.copy(sample.key);
      keyLight.current.intensity = sample.keyIntensity;
    }
    if (accentLight.current) {
      // The accent light travels with the camera like a lantern.
      accentLight.current.position.set(camera.position.x, camera.position.y + 3, camera.position.z - 10);
      accentLight.current.color.copy(sample.accent);
    }
  });

  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight ref={keyLight} position={[6, 14, 8]} intensity={1.5} />
      <pointLight ref={accentLight} intensity={22} distance={36} decay={1.6} />
      <FloorGrid material={gridMaterial} />
    </>
  );
}
