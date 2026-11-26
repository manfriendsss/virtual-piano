/** Rounded warm surface used by every panel. */
export default function Card({ as: Tag = 'section', className = '', children, ...rest }) {
  return (
    <Tag
      className={`rounded-2xl border border-line bg-card/90 shadow-[0_10px_30px_-14px_rgba(45,43,40,0.18)] backdrop-blur-sm ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardLabel({ children, className = '' }) {
  return (
    <span className={`select-none text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft ${className}`}>
      {children}
    </span>
  );
}
