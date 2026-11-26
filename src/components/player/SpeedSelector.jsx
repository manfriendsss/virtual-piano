import { SPEED_OPTIONS } from '../../lib/music.js';
import { usePianoController, usePianoState } from '../../hooks/usePiano.js';

export default function SpeedSelector() {
  const ctrl = usePianoController();
  const speed = usePianoState((s) => s.playbackSpeed);

  return (
    <div role="group" aria-label="Playback speed" className="inline-flex select-none items-center rounded-xl border border-line bg-subtle p-0.5">
      {SPEED_OPTIONS.map((spd) => {
        const active = spd === speed;
        return (
          <button
            key={spd}
            type="button"
            aria-pressed={active}
            onClick={(e) => { ctrl.setSpeed(spd); e.currentTarget.blur(); }}
            className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs transition ${
              active ? 'bg-card font-semibold text-ink shadow-[0_1px_3px_rgba(45,43,40,0.12)]' : 'font-medium text-ink-soft hover:text-ink'
            }`}
          >
            {spd}x
          </button>
        );
      })}
    </div>
  );
}
