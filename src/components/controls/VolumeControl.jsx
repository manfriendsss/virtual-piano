import { usePianoController, usePianoState } from '../../hooks/usePiano.js';
import { VolumeIcon } from '../icons.jsx';

export default function VolumeControl() {
  const ctrl = usePianoController();
  const volume = usePianoState((s) => (s.isMuted ? 0 : s.volumePercent));

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-line bg-subtle px-2.5 py-1.5">
      <button
        type="button"
        aria-label="Toggle mute"
        title="Mute / Unmute"
        onClick={(e) => { ctrl.toggleMute(); e.currentTarget.blur(); }}
        className={`cursor-pointer rounded p-0.5 transition hover:text-ink ${volume === 0 ? 'text-amber' : 'text-ink-soft'}`}
      >
        <VolumeIcon level={volume} className="h-4 w-4" />
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        aria-label="Master volume"
        onChange={(e) => ctrl.setVolume(Number(e.target.value))}
        className="warm-slider w-20 sm:w-24"
        style={{ '--fill': `${volume}%` }}
      />
      <span className="w-8 select-none text-right text-xs font-medium tabular-nums text-ink-soft">{volume}%</span>
    </div>
  );
}
