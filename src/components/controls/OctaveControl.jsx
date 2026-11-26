import { DEFAULT_BASE_OCTAVE, MAX_OCTAVE_SHIFT, MIN_OCTAVE_SHIFT } from '../../lib/music.js';
import { usePianoController, usePianoState } from '../../hooks/usePiano.js';
import { MinusIcon, PlusIcon } from '../icons.jsx';

const stepBtn =
  'flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-line bg-card text-ink transition hover:bg-line-soft active:scale-95 disabled:pointer-events-none disabled:opacity-40';

/** Shifts the 2-octave playable range (C2–B3 … C6–B7). */
export default function OctaveControl() {
  const ctrl = usePianoController();
  const shift = usePianoState((s) => s.octaveShift);
  const oct = DEFAULT_BASE_OCTAVE + shift;

  return (
    <div className="flex items-center gap-2.5">
      <span className="select-none text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Octave</span>
      <div className="inline-flex items-center gap-1 rounded-xl border border-line bg-subtle p-1" title="Shift keyboard octave">
        <button type="button" aria-label="Shift octave down" disabled={shift <= MIN_OCTAVE_SHIFT} onClick={(e) => { ctrl.shiftOctave(-1); e.currentTarget.blur(); }} className={stepBtn}>
          <MinusIcon className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-[66px] select-none px-2 text-center text-sm font-semibold tracking-tight text-ink">
          C{oct} – B{oct + 1}
        </span>
        <button type="button" aria-label="Shift octave up" disabled={shift >= MAX_OCTAVE_SHIFT} onClick={(e) => { ctrl.shiftOctave(1); e.currentTarget.blur(); }} className={stepBtn}>
          <PlusIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
