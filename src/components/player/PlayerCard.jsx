import { usePianoController, usePianoState } from '../../hooks/usePiano.js';
import Card from '../layout/Card.jsx';
import TransportButtons from './TransportButtons.jsx';
import SpeedSelector from './SpeedSelector.jsx';
import ProgressBar from './ProgressBar.jsx';
import HandLegend from './HandLegend.jsx';
import { getInstrument } from '../../engine/instruments.js';

/** Now-playing panel: song info, transport, speed and seekable progress. */
export default function PlayerCard() {
  const ctrl = usePianoController();
  const song = usePianoState((s) => s.song);
  const isPlaying = usePianoState((s) => s.isPlaying);
  const ensembleLabel = usePianoState((s) => {
    if (s.playMode === 'solo') return `Độc tấu ${getInstrument(s.soloInstrument).name}`;
    const n = new Set(s.tracks.filter((t) => t.instrument && !t.muted).map((t) => t.instrument)).size;
    return `Hoà tấu ${n} nhạc cụ`;
  });

  return (
    <Card className="relative overflow-hidden p-4 sm:p-5">
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-20 blur-3xl transition-colors duration-500"
        style={{ background: song?.accent || '#4E94BE' }}
        aria-hidden="true"
      />
      <div className="relative flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="select-none text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            {song ? (isPlaying ? 'Now playing' : 'Selected') : 'Free play'}
          </p>
          <h2 className="mt-1 truncate font-display text-2xl text-ink sm:text-3xl">
            {song ? song.title : 'Pick a song or play freely'}
          </h2>
          <p className="mt-0.5 text-sm text-ink-soft">
            {song
              ? `${song.composer} · ${song.key} · ${song.bpm} BPM · ${ensembleLabel}`
              : 'Use the keyboard below with mouse, touch or the Z–M / Q–U keys'}
          </p>
        </div>
        <HandLegend />
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-3">
        <TransportButtons />
        <SpeedSelector />
        {song && (
          <button
            type="button"
            onClick={(e) => { ctrl.freePlay(); e.currentTarget.blur(); }}
            className="cursor-pointer select-none rounded-lg border border-line bg-card px-2.5 py-1.5 text-xs font-medium text-ink transition hover:bg-subtle active:scale-95"
          >
            Back to free play
          </button>
        )}
      </div>

      <div className="relative mt-3">
        <ProgressBar />
      </div>
    </Card>
  );
}
