"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { detectQuality, prefersReducedMotion, supportsWebGL, type QualityTier } from "@/lib/capabilities";
import styles from "./JourneyBackdrop.module.scss";

// Three.js only runs in the browser, and the career content must never wait for it.
const JourneyCanvas = dynamic(() => import("@/scene/JourneyCanvas"), { ssr: false });

type Mode = { kind: "pending" } | { kind: "fallback" } | { kind: "webgl"; quality: QualityTier; reducedMotion: boolean };

/**
 * Fixed layer behind the page. Decides on the client whether to mount the 3D
 * scene or keep the static gradient fallback, which is also the server output.
 */
export function JourneyBackdrop() {
  const [mode, setMode] = useState<Mode>({ kind: "pending" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supportsWebGL()) {
      setMode({ kind: "fallback" });
      return;
    }
    setMode({ kind: "webgl", quality: detectQuality(), reducedMotion: prefersReducedMotion() });
  }, []);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.fallback} />
      {mode.kind === "webgl" && (
        <div className={ready ? `${styles.canvas} ${styles.canvasReady}` : styles.canvas}>
          <JourneyCanvas quality={mode.quality} reducedMotion={mode.reducedMotion} onReady={() => setReady(true)} />
        </div>
      )}
      <div className={styles.vignette} />
    </div>
  );
}
