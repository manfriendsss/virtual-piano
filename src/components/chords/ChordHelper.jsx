import { CHORDS } from '../../lib/music.js';
import { usePianoController, usePianoState } from '../../hooks/usePiano.js';
import Card, { CardLabel } from '../layout/Card.jsx';
import { PlayIcon } from '../icons.jsx';

/** Highlights a basic chord on the keyboard and plays it as a short roll. */
export default function ChordHelper() {
  const ctrl = usePianoController();
  const selected = usePianoState((s) => s.selectedChordId);
  const notes = usePianoState((s) => s.chordNotes.join(' · '));

  return (
    <Card aria-label="Chord helper" className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-3 sm:px-5">
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <CardLabel className="mr-1">Chords</CardLabel>
        <div role="group" aria-label="Basic chords" className="flex flex-wrap items-center gap-1.5">
          {CHORDS.map((chord) => {
            const active = chord.id === selected;
            return (
              <button
                key={chord.id}
                type="button"
                aria-pressed={active}
                onClick={(e) => { ctrl.selectChord(chord.id); e.currentTarget.blur(); }}
                className={`cursor-pointer select-none rounded-xl border px-2.5 py-1.5 text-xs transition active:scale-95 sm:px-3 sm:text-sm ${
                  active
                    ? 'border-amber-deep bg-amber font-semibold text-paper shadow-[0_2px_8px_rgba(226,140,77,0.28)]'
                    : 'border-line bg-subtle font-medium text-ink hover:bg-subtle-hover'
                }`}
              >
                {chord.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span
          aria-live="polite"
          className={`hidden select-none items-center rounded-lg bg-[#F7E1CE]/75 px-2.5 py-1 text-xs font-medium tracking-wide text-[#8F4918] transition-opacity duration-150 sm:inline-flex ${
            notes ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {notes || '—'}
        </span>
        <button
          type="button"
          disabled={!selected}
          onClick={(e) => { ctrl.clearChord(); e.currentTarget.blur(); }}
          className="cursor-pointer select-none rounded-xl border border-line bg-subtle px-2.5 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-subtle-hover hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          Clear
        </button>
        <button
          type="button"
          disabled={!selected}
          onClick={(e) => { ctrl.playChordSample(); e.currentTarget.blur(); }}
          className="inline-flex cursor-pointer select-none items-center gap-1.5 rounded-xl bg-amber px-3 py-1.5 text-xs font-medium text-paper shadow-[0_2px_8px_rgba(226,140,77,0.26)] transition hover:bg-amber-deep active:scale-[0.98] disabled:pointer-events-none disabled:bg-[#D8D1C4] disabled:text-[#8E887E] disabled:shadow-none sm:text-sm"
        >
          <PlayIcon className="h-3.5 w-3.5" />
          Play
        </button>
      </div>
    </Card>
  );
}
