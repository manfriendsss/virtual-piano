import { midiToNote } from '../../lib/music.js';
import { usePianoState } from '../../hooks/usePiano.js';
import Card, { CardLabel } from '../layout/Card.jsx';
import HandLegend from '../player/HandLegend.jsx';
import Keyboard from './Keyboard.jsx';
import InstrumentSelect from '../instruments/InstrumentSelect.jsx';
import { usePianoController } from '../../hooks/usePiano.js';

/** Frame around the keyboard with the visible-range badge. */
export default function KeyboardCard() {
  const min = usePianoState((s) => s.visibleMinMidi);
  const max = usePianoState((s) => s.visibleMaxMidi);
  const ctrl = usePianoController();
  const kbInst = usePianoState((s) => s.keyboardInstrument);
  const isSongRange = usePianoState((s) => s.rangeMode === 'song');

  return (
    <Card aria-label="Interactive piano keyboard" className="rounded-3xl p-2 sm:p-3.5 md:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-2.5">
        <div className="flex items-center gap-2">
          <CardLabel>Keyboard</CardLabel>
          <span className="inline-flex select-none items-center gap-1.5 rounded-lg border border-line bg-subtle px-2 py-0.5 text-xs font-medium text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-ocean" />
            {midiToNote(min)} – {midiToNote(max)}
            {isSongRange && <span className="text-ink-faint">· song range</span>}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-ink-soft">
            Bàn phím chơi bằng
            <InstrumentSelect value={kbInst} onChange={(id) => id && ctrl.setKeyboardInstrument(id)} label="Nhạc cụ của bàn phím" />
          </label>
          <HandLegend className="lg:hidden" />
        </div>
      </div>
      {kbInst === 'drums' && (
        <p className="px-1 pb-2 text-xs text-ink-soft">
          Bộ trống: C kick · D snare · D# clap · F/G/A tom · F# hi-hat · A# hi-hat mở · B crash (từ C5 trở lên B là ride)
        </p>
      )}
      <Keyboard />
    </Card>
  );
}
