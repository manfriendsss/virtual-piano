import { midiToNote, noteToMidi, isBlackMidi } from '../lib/music.js';

/**
 * Helper to compile a song definition into sorted MIDI events and compute
 * exact white-key-aligned lowest & highest visible MIDI bounds.
 */
export function buildSong(id, title, bpm, composerFn) {
  const rawEvents = [];

  // Push a single note or chord array
  const add = (beat, notes, dur, hand, vel = hand === 'RH' ? 0.80 : 0.62) => {
    const list = Array.isArray(notes) ? notes : [notes];
    list.forEach((n) => {
      if (!n) return;
      const midi = noteToMidi(n);
      rawEvents.push({
        beat,
        dur,
        midi,
        note: midiToNote(midi),
        hand,
        vel,
      });
    });
  };

  // Push a sequential melody phrase of [noteOrChordOrNull, durationInBeats, optionalVel]
  const seq = (startBeat, items, hand, defaultVel = hand === 'RH' ? 0.82 : 0.62) => {
    let cursor = startBeat;
    items.forEach(([notes, dur, vel]) => {
      if (notes !== null) {
        add(cursor, notes, dur, hand, vel ?? defaultVel);
      }
      cursor += dur;
    });
    return cursor;
  };

  composerFn({ add, seq });

  // Stable chronological sort (bass/LH first on identical beats)
  rawEvents.sort((a, b) => {
    if (Math.abs(a.beat - b.beat) > 1e-6) return a.beat - b.beat;
    if (a.hand !== b.hand) return a.hand === 'LH' ? -1 : 1;
    return a.midi - b.midi;
  });

  let minMidi = Infinity;
  let maxMidi = -Infinity;
  let totalBeats = 0;

  rawEvents.forEach((ev, idx) => {
    ev.id = idx;
    if (ev.midi < minMidi) minMidi = ev.midi;
    if (ev.midi > maxMidi) maxMidi = ev.midi;
    const endBeat = ev.beat + ev.dur;
    if (endBeat > totalBeats) totalBeats = endBeat;
  });

  // Snap lowest and highest range boundaries cleanly onto natural/white keys
  let rangeMinMidi = minMidi;
  let rangeMaxMidi = maxMidi;
  if (isBlackMidi(rangeMinMidi)) rangeMinMidi -= 1;
  if (isBlackMidi(rangeMaxMidi)) rangeMaxMidi += 1;

  return {
    id,
    title,
    bpm,
    events: rawEvents,
    totalBeats,
    rangeMinMidi,
    rangeMaxMidi,
  };
}
