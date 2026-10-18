"use client";

import { useSyncExternalStore } from "react";
import { journeyStore } from "@/lib/journeyStore";

/** Index of the chapter currently in view. Re-renders only when it changes. */
export function useActiveChapter(): number {
  return useSyncExternalStore(journeyStore.subscribe, journeyStore.getActiveIndex, () => 0);
}
