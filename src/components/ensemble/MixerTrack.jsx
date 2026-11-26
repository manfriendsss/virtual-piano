import { memo } from 'react';
import { PARTS, PART_MAP } from '../../engine/arrange.js';
import { usePianoController } from '../../hooks/usePiano.js';
import InstrumentSelect from '../instruments/InstrumentSelect.jsx';

const pitched = (i) => i.role !== 'drums';
const drumsOnly = (i) => i.role === 'drums';

function SmallToggle({ on, onClick, title, children, activeClass }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={on}
      onClick={(e) => { onClick(); e.currentTarget.blur(); }}
      className={`h-7 w-7 shrink-0 cursor-pointer select-none rounded-lg border text-[11px] font-bold transition active:scale-95 ${
        on ? activeClass : 'border-line bg-subtle text-ink-soft hover:bg-subtle-hover hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

/** One mixer row: part, instrument, volume, mute / solo / remove. */
function MixerTrack({ track, dimmed }) {
  const ctrl = usePianoController();
  const part = PART_MAP.get(track.part);
  const isDrums = track.part === 'drums';

  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-xl border border-line-soft bg-subtle/60 px-2.5 py-2 transition-opacity ${
        dimmed ? 'opacity-45' : ''
      }`}
    >
      <span className="h-6 w-1.5 shrink-0 rounded-full" style={{ background: part?.color }} aria-hidden="true" />
      <select
        aria-label="Bè"
        value={track.part}
        onChange={(e) => {
          const next = e.target.value;
          const patch = { part: next };
          if (next === 'drums') patch.instrument = 'drums';
          else if (track.instrument === 'drums') patch.instrument = 'piano';
          ctrl.updateTrack(track.key, patch);
          e.currentTarget.blur();
        }}
        className="w-[7.5rem] cursor-pointer rounded-lg border border-transparent bg-transparent py-1 text-xs font-semibold text-ink outline-none hover:border-line sm:text-sm"
      >
        {PARTS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
      </select>

      <InstrumentSelect
        value={track.instrument}
        allowNone
        filter={isDrums ? drumsOnly : pitched}
        onChange={(id) => ctrl.updateTrack(track.key, { instrument: id })}
        className="min-w-0 flex-1 basis-40"
      />

      <div className="flex items-center gap-1.5">
        <input
          type="range"
          min="0"
          max="100"
          value={track.volume}
          aria-label={`Âm lượng ${part?.label}`}
          onChange={(e) => ctrl.updateTrack(track.key, { volume: Number(e.target.value) })}
          className="warm-slider w-20 sm:w-24"
          style={{ '--fill': `${track.volume}%` }}
        />
        <SmallToggle
          on={track.muted}
          title="Tắt tiếng bè này"
          onClick={() => ctrl.updateTrack(track.key, { muted: !track.muted })}
          activeClass="border-amber-deep bg-amber text-paper"
        >
          M
        </SmallToggle>
        <SmallToggle
          on={track.soloed}
          title="Chỉ nghe bè này"
          onClick={() => ctrl.updateTrack(track.key, { soloed: !track.soloed })}
          activeClass="border-ocean-deep bg-ocean text-paper"
        >
          S
        </SmallToggle>
        <SmallToggle on={false} title="Xoá bè" onClick={() => ctrl.removeTrack(track.key)} activeClass="">
          ✕
        </SmallToggle>
      </div>
    </div>
  );
}

export default memo(MixerTrack);
