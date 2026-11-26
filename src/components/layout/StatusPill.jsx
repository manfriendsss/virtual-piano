import { usePianoState } from '../../hooks/usePiano.js';

const DOT = {
  loading: 'bg-amber animate-soft-pulse',
  ready: 'bg-sage',
  fallback: 'bg-ocean',
};

/** Audio readiness indicator. */
export default function StatusPill() {
  const status = usePianoState((s) => s.status);
  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex select-none items-center gap-2 rounded-full border border-line bg-card/80 px-3 py-1.5 text-xs font-medium text-ink-soft shadow-sm"
    >
      <span className={`h-2 w-2 rounded-full ${DOT[status.mode] || DOT.fallback}`} />
      {status.text}
    </div>
  );
}
