/* Inline stroke icons (no icon dependency). */
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const PlayIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.02-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z" />
  </svg>
);
export const PauseIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <rect x="6" y="5" width="4.5" height="14" rx="1.2" />
    <rect x="13.5" y="5" width="4.5" height="14" rx="1.2" />
  </svg>
);
export const StopIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);
export const MinusIcon = (p) => (
  <svg {...base} strokeWidth={2.4} {...p}><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
export const PlusIcon = (p) => (
  <svg {...base} strokeWidth={2.4} {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
export const ShuffleIcon = (p) => (
  <svg {...base} strokeWidth={2.1} {...p}>
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);
export const VolumeIcon = ({ level = 100, ...p }) => (
  <svg {...base} {...p}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" style={{ opacity: level > 0 ? 1 : 0.18 }} />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" style={{ opacity: level >= 50 ? 1 : 0.18 }} />
  </svg>
);
export const EyeIcon = (p) => (
  <svg {...base} strokeWidth={2.1} {...p}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const EyeOffIcon = (p) => (
  <svg {...base} strokeWidth={2.1} {...p}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
export const PedalIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M7 21h10" />
    <path d="M9 21V10a3 3 0 0 1 6 0v11" />
  </svg>
);
export const UploadMidiIcon = (p) => (
  <svg {...base} strokeWidth={2.1} {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
export const CloseIcon = (p) => (
  <svg {...base} strokeWidth={2.2} {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
export const PianoLogo = (p) => (
  <svg viewBox="0 0 32 32" {...p}>
    <rect x="2" y="5" width="28" height="22" rx="5" fill="#2D2B28" />
    <rect x="5" y="9" width="22" height="15" rx="2" fill="#FAF8F4" />
    {[9.5, 14.5, 19.5].map((x) => (
      <line key={x} x1={x + 0.75} y1="9" x2={x + 0.75} y2="24" stroke="#DDD6C9" strokeWidth="0.8" />
    ))}
    {[8.4, 12.6, 18.4, 22.6].map((x) => (
      <rect key={x} x={x - 1.1} y="9" width="2.2" height="8" rx="0.6" fill="#4E94BE" />
    ))}
  </svg>
);
