import { FAMILIES, INSTRUMENTS } from '../../engine/instruments.js';

/**
 * Compact native dropdown of instruments grouped by family (mobile friendly).
 * `filter(inst)` narrows the list; `allowNone` adds an "off" option.
 */
export default function InstrumentSelect({ value, onChange, filter, allowNone = false, className = '', label = 'Nhạc cụ' }) {
  const list = filter ? INSTRUMENTS.filter(filter) : INSTRUMENTS;
  return (
    <select
      aria-label={label}
      value={value ?? ''}
      onChange={(e) => { onChange(e.target.value || null); e.currentTarget.blur(); }}
      className={`cursor-pointer rounded-xl border border-line bg-card px-2.5 py-1.5 text-xs font-medium text-ink outline-none transition hover:bg-subtle focus-visible:ring-2 focus-visible:ring-ocean/40 sm:text-sm ${className}`}
    >
      {allowNone && <option value="">— Tắt —</option>}
      {FAMILIES.map((f) => {
        const items = list.filter((i) => i.family === f.id);
        if (!items.length) return null;
        return (
          <optgroup key={f.id} label={f.label}>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.emoji} {i.name}
              </option>
            ))}
          </optgroup>
        );
      })}
    </select>
  );
}
