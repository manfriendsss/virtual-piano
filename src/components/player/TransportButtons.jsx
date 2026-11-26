import { usePianoController, usePianoState } from '../../hooks/usePiano.js';
import { PauseIcon, PlayIcon, StopIcon } from '../icons.jsx';

export default function TransportButtons() {
  const ctrl = usePianoController();
  const isPlaying = usePianoState((s) => s.isPlaying);
  const preparing = usePianoState((s) => s.preparing);
  const hasSong = usePianoState((s) => Boolean(s.selectedSongId));
  const atStart = usePianoState((s) => s.songPosBeats <= 0);

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={(e) => { ctrl.togglePlay(); e.currentTarget.blur(); }}
        className="inline-flex cursor-pointer select-none items-center gap-2 rounded-xl bg-ocean px-4 py-2 text-sm font-medium text-paper shadow-[0_4px_14px_-4px_rgba(78,148,190,0.6)] transition hover:bg-ocean-deep active:scale-[0.97]"
      >
        {isPlaying || preparing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
        {preparing ? 'Đang tải…' : isPlaying ? 'Pause' : 'Play'}
      </button>
      <button
        type="button"
        aria-label="Stop playback"
        title="Stop"
        disabled={!hasSong || (!isPlaying && atStart)}
        onClick={(e) => { ctrl.stop(); e.currentTarget.blur(); }}
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-subtle text-ink transition hover:bg-subtle-hover active:scale-95 disabled:pointer-events-none disabled:opacity-40"
      >
        <StopIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
