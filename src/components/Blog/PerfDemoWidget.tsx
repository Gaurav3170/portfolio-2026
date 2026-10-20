"use client";

// DEMO ONLY — a deliberate performance regression for testing Perf Budget Guard on a PR.
// Do not merge.
import { useEffect, useState } from "react";
import * as THREE from "three";

/** Pulls the whole three.js namespace into the blog bundle and blocks the main thread on load. */
export function PerfDemoWidget() {
  const [exportCount, setExportCount] = useState(0);

  useEffect(() => {
    // Busy-wait ~400 ms: one long task that shows up as Total Blocking Time.
    const end = performance.now() + 400;
    while (performance.now() < end) {
      // spin
    }
    // Touching every export stops the bundler from tree-shaking three.js away.
    setExportCount(Object.keys(THREE).length);
  }, []);

  return <p aria-hidden="true" style={{ opacity: 0.6, fontSize: "0.75rem" }}>three.js exports: {exportCount}</p>;
}
