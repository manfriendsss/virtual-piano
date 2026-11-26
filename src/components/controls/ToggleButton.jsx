/** Pill-shaped on/off button used for Sustain and Note names. */
export default function ToggleButton({ pressed, onToggle, icon, children }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={(e) => { onToggle(); e.currentTarget.blur(); }}
      className={`inline-flex cursor-pointer select-none items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition active:scale-[0.98] sm:text-sm ${
        pressed
          ? 'border-ocean-deep bg-ocean text-paper shadow-[0_2px_8px_rgba(78,148,190,0.28)] hover:bg-ocean-deep'
          : 'border-line bg-subtle text-ink-soft hover:bg-subtle-hover hover:text-ink'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
