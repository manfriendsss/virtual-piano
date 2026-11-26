/** Color legend for the auto-play hands. */
export default function HandLegend({ className = '' }) {
  return (
    <div className={`inline-flex select-none items-center gap-3 text-xs text-ink-soft ${className}`}>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-ocean" />
        Melody · right hand
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-amber" />
        Left hand
      </span>
    </div>
  );
}
