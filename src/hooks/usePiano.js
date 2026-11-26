import { createContext, useContext, useSyncExternalStore } from 'react';

export const PianoContext = createContext(null);

/** The piano controller instance (actions). */
export function usePianoController() {
  const ctrl = useContext(PianoContext);
  if (!ctrl) throw new Error('usePianoController must be used inside <PianoProvider>');
  return ctrl;
}

const identity = (s) => s;

/**
 * Live piano state. Pass a selector returning a primitive or a stable
 * reference so the component only re-renders when that slice changes
 * (playback emits a snapshot every animation frame).
 */
export function usePianoState(selector = identity) {
  const ctrl = usePianoController();
  return useSyncExternalStore(ctrl.subscribe, () => selector(ctrl.getSnapshot()));
}
