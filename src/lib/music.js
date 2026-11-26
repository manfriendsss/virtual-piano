/* Musical utilities & constants shared across the app. */

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const IS_BLACK_PC = [false, true, false, true, false, false, true, false, true, false, true, false];

// Horizontal offset of each black key relative to its preceding white key's right edge
export const BLACK_OFFSET_BY_PC = { 1: -0.06, 3: 0.06, 6: -0.07, 8: 0.0, 10: 0.07 };

// Computer keyboard mapping across 2 octaves (semitone offset from the anchor C)
export const KEYBOARD_MAP = [
  { offset: 0, code: 'KeyZ', label: 'Z' },
  { offset: 1, code: 'KeyS', label: 'S' },
  { offset: 2, code: 'KeyX', label: 'X' },
  { offset: 3, code: 'KeyD', label: 'D' },
  { offset: 4, code: 'KeyC', label: 'C' },
  { offset: 5, code: 'KeyV', label: 'V' },
  { offset: 6, code: 'KeyG', label: 'G' },
  { offset: 7, code: 'KeyB', label: 'B' },
  { offset: 8, code: 'KeyH', label: 'H' },
  { offset: 9, code: 'KeyN', label: 'N' },
  { offset: 10, code: 'KeyJ', label: 'J' },
  { offset: 11, code: 'KeyM', label: 'M' },
  { offset: 12, code: 'KeyQ', label: 'Q' },
  { offset: 13, code: 'Digit2', label: '2' },
  { offset: 14, code: 'KeyW', label: 'W' },
  { offset: 15, code: 'Digit3', label: '3' },
  { offset: 16, code: 'KeyE', label: 'E' },
  { offset: 17, code: 'KeyR', label: 'R' },
  { offset: 18, code: 'Digit5', label: '5' },
  { offset: 19, code: 'KeyT', label: 'T' },
  { offset: 20, code: 'Digit6', label: '6' },
  { offset: 21, code: 'KeyY', label: 'Y' },
  { offset: 22, code: 'Digit7', label: '7' },
  { offset: 23, code: 'KeyU', label: 'U' },
];

export const CODE_TO_OFFSET = new Map(KEYBOARD_MAP.map((k) => [k.code, k.offset]));
export const OFFSET_TO_LABEL = new Map(KEYBOARD_MAP.map((k) => [k.offset, k.label]));

// Chord helper definitions (semitone offsets from the anchor C)
export const CHORDS = [
  { id: 'C', label: 'C', offsets: [0, 4, 7] },
  { id: 'Dm', label: 'Dm', offsets: [2, 5, 9] },
  { id: 'Em', label: 'Em', offsets: [4, 7, 11] },
  { id: 'F', label: 'F', offsets: [5, 9, 12] },
  { id: 'G', label: 'G', offsets: [7, 11, 14] },
  { id: 'Am', label: 'Am', offsets: [9, 12, 16] },
  { id: 'Bdim', label: 'Bdim', offsets: [11, 14, 17] },
  { id: 'G7', label: 'G7', offsets: [7, 11, 14, 17] },
];

export const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25];
export const DEFAULT_BASE_OCTAVE = 4; // C4 – B5
export const MIN_OCTAVE_SHIFT = -2;
export const MAX_OCTAVE_SHIFT = 2;

export function midiToNote(midi) {
  const pitch = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${pitch}${octave}`;
}

export function noteToMidi(noteStr) {
  const match = /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(noteStr.trim());
  if (!match) throw new Error(`Invalid note: ${noteStr}`);
  const baseMap = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let pc = baseMap[match[1].toUpperCase()];
  if (match[2] === '#') pc += 1;
  if (match[2] === 'b') pc -= 1;
  return (parseInt(match[3], 10) + 1) * 12 + pc;
}

export function isBlackMidi(midi) {
  return IS_BLACK_PC[((midi % 12) + 12) % 12];
}

export function formatTime(totalSeconds) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function anchorMidiFor(octaveShift) {
  return (DEFAULT_BASE_OCTAVE + octaveShift + 1) * 12; // 60 = C4
}
