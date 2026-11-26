import { useEffect } from 'react';
import { CODE_TO_OFFSET } from '../lib/music.js';

/** Plays the 2-octave computer-keyboard layout (Z–M / Q–U rows). */
export function useComputerKeyboard(controller) {
  useEffect(() => {
    const onDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (e.target?.tagName === 'INPUT') return;
      const offset = CODE_TO_OFFSET.get(e.code);
      if (offset === undefined) return;
      e.preventDefault();
      controller.unlock();
      controller.pressOffset(`kbd:${e.code}`, offset);
    };
    const onUp = (e) => {
      if (CODE_TO_OFFSET.has(e.code)) controller.release(`kbd:${e.code}`);
    };
    const onBlur = () => controller.releaseAll();

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [controller]);
}
