import { useRef } from 'react';
import { formatTime } from '../../lib/music.js';
import { usePianoController, usePianoState } from '../../hooks/usePiano.js';

/** Click / drag to seek; arrow keys step 5 %. */
export default function ProgressBar() {
  const ctrl = usePianoController();
  const song = usePianoState((s) => s.song);
  const pos = usePianoState((s) => s.songPosBeats);
  const speed = usePianoState((s) => s.playbackSpeed);
  const trackRef = useRef(null);
  const seeking = useRef(false);

  const ratio = song ? Math.max(0, Math.min(1, pos / song.totalBeats)) : 0;
  const pct = ratio * 100;
  const bps = song ? (song.bpm / 60) * speed : 1;
  const elapsed = song ? pos / bps : 0;
  const total = song ? song.totalBeats / bps : 0;

  const ratioAt = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    return rect.width > 0 ? Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) : 0;
  };

  const onPointerDown = (e) => {
    if (!song) return;
    e.preventDefault();
    ctrl.unlock();
    seeking.current = true;
    trackRef.current.setPointerCapture(e.pointerId);
    ctrl.seek(ratioAt(e.clientX));
  };
  const onPointerMove = (e) => {
    if (seeking.current) ctrl.seek(ratioAt(e.clientX));
  };
  const endSeek = (e) => {
    seeking.current = false;
    if (trackRef.current?.hasPointerCapture(e.pointerId)) trackRef.current.releasePointerCapture(e.pointerId);
  };
  const onKeyDown = (e) => {
    if (!song) return;
    if (e.key === 'ArrowRight') ctrl.seek(ratio + 0.05);
    else if (e.key === 'ArrowLeft') ctrl.seek(ratio - 0.05);
    else return;
    e.preventDefault();
  };

  return (
    <div className="flex items-center gap-3">
      <span className="w-10 select-none text-right text-xs font-medium tabular-nums text-ink-soft">{formatTime(elapsed)}</span>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Song progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endSeek}
        onPointerCancel={endSeek}
        onKeyDown={onKeyDown}
        className={`group relative flex h-6 flex-1 select-none items-center outline-none ${song ? 'cursor-pointer' : 'cursor-default opacity-60'}`}
      >
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#E6E0D5]">
          <div className="h-full rounded-full bg-gradient-to-r from-ocean to-ocean-deep" style={{ width: `${pct}%` }} />
        </div>
        <div
          className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 scale-90 rounded-full border-2 border-card bg-ocean shadow-[0_1px_4px_rgba(45,43,40,0.28)] transition-transform group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-ocean/40"
          style={{ left: `${pct}%` }}
        />
      </div>
      <span className="w-10 select-none text-xs font-medium tabular-nums text-ink-soft">{formatTime(total)}</span>
    </div>
  );
}
