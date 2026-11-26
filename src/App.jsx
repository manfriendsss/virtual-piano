import { PianoProvider } from './hooks/PianoProvider.jsx';
import Header from './components/layout/Header.jsx';
import SongLibrary from './components/songs/SongLibrary.jsx';
import PlayerCard from './components/player/PlayerCard.jsx';
import ControlBar from './components/controls/ControlBar.jsx';
import EnsembleCard from './components/ensemble/EnsembleCard.jsx';
import ChordHelper from './components/chords/ChordHelper.jsx';
import KeyboardCard from './components/keyboard/KeyboardCard.jsx';

export default function App() {
  return (
    <PianoProvider>
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-3 p-2.5 sm:gap-4 sm:p-4 md:p-6">
        <Header />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
          <SongLibrary />
          <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
            <PlayerCard />
            <EnsembleCard />
            <ControlBar />
            <ChordHelper />
          </div>
        </div>
        <KeyboardCard />
      </main>
    </PianoProvider>
  );
}
