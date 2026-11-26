import { useEffect, useState } from 'react';
import { PianoController } from '../engine/PianoController.js';
import { PianoContext } from './usePiano.js';
import { useComputerKeyboard } from './useComputerKeyboard.js';

export function PianoProvider({ children }) {
  const [controller] = useState(() => new PianoController());

  useEffect(() => {
    controller.initAudio();
    // First-gesture Web Audio unlock safety net
    const unlock = () => controller.unlock();
    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [controller]);

  useComputerKeyboard(controller);

  return <PianoContext.Provider value={controller}>{children}</PianoContext.Provider>;
}
