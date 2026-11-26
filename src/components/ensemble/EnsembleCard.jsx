import { PRESETS, PARTS } from '../../engine/arrange.js';
import { getInstrument } from '../../engine/instruments.js';
import { usePianoController, usePianoState } from '../../hooks/usePiano.js';
import Card, { CardLabel } from '../layout/Card.jsx';
import InstrumentGrid from '../instruments/InstrumentGrid.jsx';
import MixerTrack from './MixerTrack.jsx';

const ROLE_HINT = {
  poly: 'chơi trọn bản nhạc (giai điệu, bè phụ, đệm và bass)',
  melody: 'chơi giai điệu chính',
  bass: 'chơi dòng bass',
  drums: 'chơi nhịp trống theo phong cách của bài',
};

function ModeSwitch({ mode, onChange }) {
  const opts = [
    { id: 'solo', label: 'Độc tấu' },
    { id: 'ensemble', label: 'Hoà tấu' },
  ];
  return (
    <div role="group" aria-label="Chế độ phát" className="inline-flex select-none items-center rounded-xl border border-line bg-subtle p-0.5">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={mode === o.id}
          onClick={(e) => { onChange(o.id); e.currentTarget.blur(); }}
          className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs transition sm:text-sm ${
            mode === o.id ? 'bg-card font-semibold text-ink shadow-[0_1px_3px_rgba(45,43,40,0.12)]' : 'font-medium text-ink-soft hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Choose how songs are performed: one solo instrument, or a mixable ensemble. */
export default function EnsembleCard() {
  const ctrl = usePianoController();
  const mode = usePianoState((s) => s.playMode);
  const soloId = usePianoState((s) => s.soloInstrument);
  const tracks = usePianoState((s) => s.tracks);
  const presetId = usePianoState((s) => s.presetId);
  const hasSong = usePianoState((s) => Boolean(s.selectedSongId));

  const solo = getInstrument(soloId);
  const anySolo = tracks.some((t) => t.soloed);

  return (
    <Card aria-label="Nhạc cụ và hoà tấu" className="flex flex-col gap-3 px-3.5 py-3.5 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CardLabel>Dàn nhạc</CardLabel>
          {!hasSong && <span className="text-xs text-ink-faint">Chọn một bài để nghe</span>}
        </div>
        <ModeSwitch mode={mode} onChange={(m) => ctrl.setPlayMode(m)} />
      </div>

      {mode === 'solo' ? (
        <>
          <p className="text-xs text-ink-soft sm:text-sm">
            <span className="font-semibold text-ink">{solo.emoji} {solo.name}</span> {ROLE_HINT[solo.role]}.
          </p>
          <InstrumentGrid value={soloId} onSelect={(id) => ctrl.setSoloInstrument(id)} />
        </>
      ) : (
        <>
          <div role="group" aria-label="Preset hoà tấu" className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => {
              const active = p.id === presetId;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={active}
                  onClick={(e) => { ctrl.applyPreset(p.id); e.currentTarget.blur(); }}
                  className={`cursor-pointer select-none rounded-xl border px-2.5 py-1.5 text-xs transition active:scale-95 sm:text-sm ${
                    active
                      ? 'border-amber-deep bg-amber font-semibold text-paper shadow-[0_2px_8px_rgba(226,140,77,0.28)]'
                      : 'border-line bg-subtle font-medium text-ink hover:bg-subtle-hover'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5">
            {tracks.map((t) => (
              <MixerTrack key={t.key} track={t} dimmed={!t.instrument || (anySolo ? !t.soloed : t.muted)} />
            ))}
            {!tracks.length && <p className="py-2 text-center text-xs text-ink-faint">Chưa có bè nào. Chọn preset hoặc thêm bè.</p>}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs text-ink-soft">Thêm bè:</span>
            {PARTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={(e) => { ctrl.addTrack(p.id); e.currentTarget.blur(); }}
                className="inline-flex cursor-pointer select-none items-center gap-1.5 rounded-lg border border-dashed border-line px-2 py-1 text-xs font-medium text-ink-soft transition hover:border-solid hover:bg-subtle hover:text-ink"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: p.color }} aria-hidden="true" />+ {p.label}
              </button>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
