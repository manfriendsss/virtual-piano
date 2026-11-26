import { useEffect, useMemo, useRef, useState } from 'react';
import { BLACK_OFFSET_BY_PC, OFFSET_TO_LABEL, isBlackMidi, midiToNote } from '../../lib/music.js';
import { usePianoController, usePianoState } from '../../hooks/usePiano.js';
import PianoKey from './PianoKey.jsx';

/** Builds proportional white & black key geometry for a MIDI span. */
function useKeyLayout(min, max, anchor) {
  return useMemo(() => {
    const whiteIdx = new Map();
    let whiteCount = 0;
    for (let m = min; m <= max; m += 1) {
      if (!isBlackMidi(m)) whiteIdx.set(m, whiteCount++);
    }
    const whiteW = 100 / whiteCount;
    const blackW = whiteW * 0.62;
    const keys = [];
    for (let m = min; m <= max; m += 1) {
      const off = m - anchor;
      const key = {
        midi: m,
        name: midiToNote(m),
        black: isBlackMidi(m),
        shortcut: off >= 0 && off <= 23 ? OFFSET_TO_LABEL.get(off) : '',
      };
      if (key.black) {
        const pc = ((m % 12) + 12) % 12;
        const pos = whiteIdx.get(m - 1) + 1 + (BLACK_OFFSET_BY_PC[pc] || 0);
        key.left = pos * whiteW - blackW / 2;
        key.width = blackW;
      }
      keys.push(key);
    }
    return { keys, whiteCount, dense: whiteCount > 18 };
  }, [min, max, anchor]);
}

const midiFromElement = (el, bed) => {
  const btn = el?.closest?.('[data-midi]');
  return btn && bed.contains(btn) ? Number(btn.dataset.midi) : null;
};

export default function Keyboard() {
  const ctrl = usePianoController();
  const min = usePianoState((s) => s.visibleMinMidi);
  const max = usePianoState((s) => s.visibleMaxMidi);
  const anchor = usePianoState((s) => s.anchorMidi);
  const keyClasses = usePianoState((s) => s.keyClasses);
  const showLabels = usePianoState((s) => s.showLabels);
  const songId = usePianoState((s) => s.selectedSongId);

  const { keys, whiteCount, dense } = useKeyLayout(min, max, anchor);
  const scrollRef = useRef(null);
  const bedRef = useRef(null);
  const pointers = useRef(new Map()); // pointerId -> midi
  const [overflows, setOverflows] = useState(false);

  // Track overflow for the swipe hint; center the keyboard on narrow screens when a song is picked
  useEffect(() => {
    const el = scrollRef.current;
    const check = () => setOverflows(el.scrollWidth > el.clientWidth + 6);
    check();
    if (songId) {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) el.scrollLeft = Math.round(maxScroll * 0.45);
    }
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [whiteCount, songId]);

  // Release pointers that end anywhere in the window
  useEffect(() => {
    const end = (e) => {
      if (!pointers.current.has(e.pointerId)) return;
      ctrl.release(`ptr:${e.pointerId}`);
      pointers.current.delete(e.pointerId);
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return () => {
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  }, [ctrl]);

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const midi = midiFromElement(e.target, bedRef.current);
    if (midi === null) return;
    e.preventDefault();
    ctrl.unlock();
    pointers.current.set(e.pointerId, midi);
    ctrl.press(`ptr:${e.pointerId}`, midi);
  };

  // Glissando & multi-touch slide tracking
  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    const next = midiFromElement(document.elementFromPoint(e.clientX, e.clientY), bedRef.current);
    if (next === pointers.current.get(e.pointerId)) return;
    const id = `ptr:${e.pointerId}`;
    if (next === null) {
      ctrl.release(id);
      pointers.current.delete(e.pointerId);
    } else {
      pointers.current.set(e.pointerId, next);
      ctrl.press(id, next);
    }
  };

  const onPointerLeave = (e) => {
    if (e.pointerType !== 'mouse' || !pointers.current.has(e.pointerId)) return;
    ctrl.release(`ptr:${e.pointerId}`);
    pointers.current.delete(e.pointerId);
  };

  return (
    <div className="rounded-2xl border border-[#DCD5C8] bg-gradient-to-b from-[#E9E3D8] to-[#DED6C8] p-1.5 shadow-inner sm:p-2">
      <div ref={scrollRef} className="piano-scroll w-full overflow-x-auto rounded-xl">
        <div style={{ minWidth: whiteCount > 14 ? `${whiteCount * 36}px` : '100%' }}>
          {/* Felt strip */}
          <div className="mb-px h-1.5 w-full rounded-t-lg bg-gradient-to-b from-[#7A1F2B] to-[#5A1520] sm:h-2" aria-hidden="true" />
          <div
            ref={bedRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            className={`piano-bed relative h-48 w-full overflow-hidden rounded-b-xl bg-[#D6CEBF] sm:h-60 md:h-64 ${showLabels ? '' : 'labels-hidden'}`}
          >
            <div className="flex h-full w-full">
              {keys.filter((k) => !k.black).map((k) => (
                <PianoKey key={k.midi} k={k} dense={dense} state={keyClasses[k.midi]} />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0">
              {keys.filter((k) => k.black).map((k) => (
                <PianoKey key={k.midi} k={k} dense={dense} state={keyClasses[k.midi]} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className={`px-1 pt-1.5 text-[11px] text-ink-soft transition-opacity lg:hidden ${overflows ? 'opacity-100' : 'opacity-0'}`}>
        Swipe sideways to see the full range
      </p>
    </div>
  );
}
