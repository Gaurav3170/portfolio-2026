/**
 * Shared state between the DOM scroll driver and the WebGL scene.
 *
 * `progress` changes on every scroll event, so it is a plain mutable field that the
 * render loop reads each frame — it never triggers React renders.
 * `activeIndex` changes only when the visitor crosses into another chapter, so UI
 * components subscribe to it through useSyncExternalStore.
 */
type Listener = () => void;

const listeners = new Set<Listener>();

export const journeyStore = {
  /** Normalized journey progress, 0 (present day) → 1 (next chapter). */
  progress: 0,
  activeIndex: 0,

  setActiveIndex(index: number) {
    if (index === journeyStore.activeIndex) return;
    journeyStore.activeIndex = index;
    listeners.forEach((listener) => listener());
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getActiveIndex() {
    return journeyStore.activeIndex;
  },
};
