import { PianoLogo } from '../icons.jsx';
import StatusPill from './StatusPill.jsx';

export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-1 pt-1">
      <div className="flex items-center gap-3">
        <PianoLogo className="h-10 w-10 drop-shadow-sm" />
        <div className="leading-tight">
          <h1 className="font-display text-2xl tracking-tight text-ink sm:text-[28px]">Music Studio</h1>
          <p className="text-xs text-ink-soft sm:text-sm">Piano, dàn dây, kèn, sáo, guitar, trống — độc tấu hoặc hoà tấu</p>
        </div>
      </div>
      <StatusPill />
    </header>
  );
}
