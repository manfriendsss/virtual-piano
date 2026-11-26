import { useEffect, useRef, useState } from 'react';
import { usePianoController, usePianoState } from '../../hooks/usePiano.js';
import Card, { CardLabel } from '../layout/Card.jsx';
import { CloseIcon, ShuffleIcon, UploadMidiIcon } from '../icons.jsx';
import SongCard from './SongCard.jsx';

/** List of built-in and locally imported MIDI songs with drag-and-drop import. */
export default function SongLibrary() {
  const ctrl = usePianoController();
  const songs = usePianoState((s) => s.songs);
  const selectedId = usePianoState((s) => s.selectedSongId);
  const isPlaying = usePianoState((s) => s.isPlaying);
  const importError = usePianoState((s) => s.importError);

  const fileInputRef = useRef(null);
  const itemRefs = useRef(new Map());
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    const el = itemRefs.current.get(selectedId);
    if (el) el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [selectedId]);

  const handleFiles = (files) => {
    if (files?.length) ctrl.importMidiFiles(files);
  };

  return (
    <Card
      onDragOver={(e) => {
        if (e.dataTransfer?.types?.includes('Files')) {
          e.preventDefault();
          setDragging(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer?.files);
      }}
      className={`flex min-w-0 flex-col gap-2.5 p-3 transition sm:p-4 ${
        dragging ? 'ring-2 ring-ocean/60 bg-ocean/5' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <CardLabel>Song library</CardLabel>
        <div className="flex items-center gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept=".mid,.midi,.rmi,audio/midi,audio/x-midi"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              ctrl.clearImportError();
              fileInputRef.current?.click();
              e.currentTarget.blur();
            }}
            title="Chọn file MIDI (.mid) từ máy"
            className="inline-flex cursor-pointer select-none items-center gap-1 rounded-lg border border-ocean/40 bg-ocean/10 px-2.5 py-1 text-xs font-medium text-ocean-ink transition hover:bg-ocean/20 active:scale-95"
          >
            <UploadMidiIcon className="h-3.5 w-3.5" />
            + MIDI
          </button>
          <button
            type="button"
            onClick={(e) => { ctrl.playRandom(); e.currentTarget.blur(); }}
            className="inline-flex cursor-pointer select-none items-center gap-1.5 rounded-lg border border-amber/40 bg-amber/10 px-2.5 py-1 text-xs font-medium text-amber-ink transition hover:bg-amber/20 active:scale-95"
          >
            <ShuffleIcon className="h-3.5 w-3.5" />
            Random
          </button>
        </div>
      </div>

      {importError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-2 rounded-lg border border-[#C2604A]/35 bg-[#C2604A]/10 px-2.5 py-1.5 text-xs text-[#8D3A28]"
        >
          <span className="min-w-0 flex-1">{importError}</span>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => ctrl.clearImportError()}
            className="shrink-0 cursor-pointer rounded p-0.5 hover:bg-[#C2604A]/15"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <ul className="song-list-scroll -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:max-h-[340px] lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:px-0 lg:pr-1 lg:pb-0 [scrollbar-width:none]">
        {songs.map((song, i) => (
          <li
            key={song.id}
            ref={(el) => {
              if (el) itemRefs.current.set(song.id, el);
              else itemRefs.current.delete(song.id);
            }}
            className="min-w-[210px] snap-start lg:min-w-0"
          >
            <SongCard
              song={song}
              index={i + 1}
              selected={song.id === selectedId}
              playing={song.id === selectedId && isPlaying}
              onSelect={() => ctrl.selectSong(song.id)}
              onRemove={song.imported ? () => ctrl.removeImportedSong(song.id) : undefined}
            />
          </li>
        ))}
      </ul>

      <p className="text-[11px] leading-snug text-ink-faint">
        Chấp nhận file <span className="font-medium text-ink-soft">.mid</span> có sẵn trên máy — kéo thả hoặc bấm <span className="font-medium text-ink-soft">+ MIDI</span>
      </p>
    </Card>
  );
}
