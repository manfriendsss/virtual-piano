import { memo } from 'react';

/**
 * A single white or black key. `state` is a class string built from the
 * highlight layers (is-manual / is-auto-rh / is-auto-lh / is-chord), so the
 * memo only re-renders keys whose highlight actually changed.
 */
function PianoKey({ k, dense, state = '' }) {
  if (!k.black) {
    return (
      <button
        type="button"
        tabIndex={-1}
        data-midi={k.midi}
        aria-label={k.name}
        className={`key-white relative flex h-full flex-1 cursor-pointer select-none flex-col items-center justify-end rounded-b-lg px-0.5 pb-2 outline-none sm:rounded-b-xl sm:pb-2.5 ${state}`}
      >
        <span className="chord-dot pointer-events-none absolute top-2.5 h-2 w-2 rounded-full bg-amber ring-2 ring-card/85 sm:top-3.5" />
        <span
          className={`key-note-label pointer-events-none mb-1.5 font-semibold leading-none text-ink ${
            dense ? 'text-[9px] sm:text-[11px]' : 'text-[10px] sm:text-xs'
          }`}
        >
          {k.name}
        </span>
        <span
          className={`key-shortcut-label pointer-events-none inline-flex h-3.5 items-center rounded px-1 font-medium leading-none text-[#918A7F] ${
            dense ? 'text-[8px] sm:text-[10px]' : 'text-[9px] sm:text-[11px]'
          } ${k.shortcut ? 'bg-ink/5' : 'opacity-0'}`}
        >
          {k.shortcut || '·'}
        </span>
      </button>
    );
  }

  const size = dense ? 'text-[7px] sm:text-[9px]' : 'text-[8px] sm:text-[10px]';
  return (
    <button
      type="button"
      tabIndex={-1}
      data-midi={k.midi}
      aria-label={k.name}
      style={{ left: `${k.left}%`, width: `${k.width}%` }}
      className={`key-black pointer-events-auto absolute top-0 z-10 flex h-[60%] cursor-pointer select-none flex-col items-center justify-end rounded-b-md px-0.5 pb-1.5 outline-none sm:rounded-b-lg sm:pb-2 ${state}`}
    >
      <span className="chord-dot pointer-events-none absolute top-2 h-1.5 w-1.5 rounded-full bg-paper sm:top-2.5" />
      <span className={`key-note-label pointer-events-none mb-1 font-medium leading-none tracking-tighter text-[#E9E3D9] ${size}`}>
        {k.name}
      </span>
      <span className={`key-shortcut-label pointer-events-none inline-flex h-3 items-center font-medium leading-none text-[#A39C91] ${size} ${k.shortcut ? '' : 'opacity-0'}`}>
        {k.shortcut || '·'}
      </span>
    </button>
  );
}

export default memo(PianoKey);
