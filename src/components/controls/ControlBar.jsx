import { usePianoController, usePianoState } from '../../hooks/usePiano.js';
import Card from '../layout/Card.jsx';
import { EyeIcon, EyeOffIcon, PedalIcon } from '../icons.jsx';
import OctaveControl from './OctaveControl.jsx';
import VolumeControl from './VolumeControl.jsx';
import ToggleButton from './ToggleButton.jsx';

/** Octave, volume, sustain pedal and note-name toggles. */
export default function ControlBar() {
  const ctrl = usePianoController();
  const sustainOn = usePianoState((s) => s.sustainOn);
  const showLabels = usePianoState((s) => s.showLabels);

  return (
    <Card aria-label="Piano controls" className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-3 sm:px-5">
      <OctaveControl />
      <div className="flex flex-wrap items-center gap-2">
        <VolumeControl />
        <ToggleButton pressed={sustainOn} onToggle={() => ctrl.toggleSustain()} icon={<PedalIcon className="h-3.5 w-3.5" />}>
          Sustain
        </ToggleButton>
        <ToggleButton
          pressed={showLabels}
          onToggle={() => ctrl.toggleLabels()}
          icon={showLabels ? <EyeIcon className="h-3.5 w-3.5" /> : <EyeOffIcon className="h-3.5 w-3.5" />}
        >
          Note names
        </ToggleButton>
      </div>
    </Card>
  );
}
