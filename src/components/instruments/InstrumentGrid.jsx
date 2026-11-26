import { memo } from 'react';
import { FAMILIES, INSTRUMENTS } from '../../engine/instruments.js';

/** Instrument chips grouped by family; used to pick the solo instrument. */
function InstrumentGrid({ value, onSelect }) {
  return (
    <div className="flex flex-col gap-2.5">
      {FAMILIES.map((f) => {
        const items = INSTRUMENTS.filter((i) => i.family === f.id);
        return (
          <div key={f.id} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
            <span className="w-20 shrink-0 select-none pt-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">
              {f.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {items.map((inst) => {
                const active = inst.id === value;
                return (
                  <button
                    key={inst.id}
                    type="button"
                    aria-pressed={active}
                    onClick={(e) => { onSelect(inst.id); e.currentTarget.blur(); }}
                    className={`inline-flex cursor-pointer select-none items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs transition active:scale-95 sm:text-sm ${
                      active
                        ? 'border-ocean-deep bg-ocean font-semibold text-paper shadow-[0_2px_8px_rgba(78,148,190,0.28)]'
                        : 'border-line bg-subtle font-medium text-ink hover:bg-subtle-hover'
                    }`}
                  >
                    <span aria-hidden="true">{inst.emoji}</span>
                    {inst.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(InstrumentGrid);
