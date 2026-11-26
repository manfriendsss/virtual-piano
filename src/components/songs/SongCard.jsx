import { memo } from 'react';
import { formatTime } from '../../lib/music.js';
import { CloseIcon, PauseIcon, PlayIcon } from '../icons.jsx';

function Equalizer({ color }) {
  return (
    <span className="flex h-3.5 items-end gap-[2px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className="eq-bar h-full w-[3px] rounded-full" style={{ background: color }} />
      ))}
    </span>
  );
}

/** One song row: number/equalizer, title, composer · key, duration. */
function SongCard({ song, index, selected, playing, onSelect, onRemove }) {
  return (
    <div className="group relative flex items-center">
      <button
        type="button"
        onClick={(e) => { onSelect(); e.currentTarget.blur(); }}
        aria-pressed={selected}
        className={`flex w-full cursor-pointer select-none items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition active:scale-[0.99] ${
          onRemove ? 'pr-8' : ''
        } ${
          selected
            ? 'border-ocean/40 bg-ocean/10 shadow-[0_4px_14px_-6px_rgba(78,148,190,0.45)]'
            : 'border-transparent bg-subtle/70 hover:border-line hover:bg-subtle'
        }`}
      >
        <span
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-paper shadow-sm"
          style={{ background: song.accent }}
        >
          {playing ? (
            <Equalizer color="#F8F6F2" />
          ) : (
            <>
              <span className="transition group-hover:opacity-0">{index}</span>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                {selected ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
              </span>
            </>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className={`block truncate text-sm ${selected ? 'font-semibold text-ocean-ink' : 'font-medium text-ink'}`}>
              {song.title}
            </span>
            {song.imported && (
              <span className="shrink-0 rounded bg-ocean/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ocean-ink">
                MIDI
              </span>
            )}
          </span>
          <span className="block truncate text-xs text-ink-soft">
            {song.composer} · {song.key}
          </span>
        </span>
        <span className="text-xs tabular-nums text-ink-faint">{formatTime(song.durationSec)}</span>
      </button>

      {onRemove && (
        <button
          type="button"
          title={`Xoá ${song.title}`}
          aria-label={`Remove ${song.title}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
            e.currentTarget.blur();
          }}
          className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-ink-faint transition hover:bg-line/70 hover:text-ink lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export default memo(SongCard);
