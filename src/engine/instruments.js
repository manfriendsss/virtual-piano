/* Instrument catalog. Sampled instruments stream from free CDNs
 * (Salamander piano + nbrosowsky/tonejs-instruments, CC-BY); the rest are synthesized. */

const TJI = 'https://nbrosowsky.github.io/tonejs-instruments/samples/';

/** "A3 C#4" -> { A3: 'A3.mp3', 'C#4': 'Cs4.mp3' } */
const urls = (list) =>
  Object.fromEntries(list.trim().split(/\s+/).map((n) => [n, `${n.replace('#', 's')}.mp3`]));

export const FAMILIES = [
  { id: 'keys', label: 'Phím' },
  { id: 'strings', label: 'Dây kéo' },
  { id: 'plucked', label: 'Dây gảy' },
  { id: 'woodwind', label: 'Bộ gỗ' },
  { id: 'brass', label: 'Kèn đồng' },
  { id: 'percussion', label: 'Bộ gõ' },
];

/**
 * role: 'poly'   -> plays chords; in solo mode plays the whole score
 *       'melody' -> single line; in solo mode plays the melody
 *       'bass'   -> low line; in solo mode plays the bass line
 *       'drums'  -> unpitched kit
 * range: [lowMidi, highMidi] notes are folded by octaves into this range.
 * legato: sustained instruments (bowed, wind, organ) - notes are tied into the next one
 *         and get a soft attack so lines sing instead of sounding plucked.
 */
export const INSTRUMENTS = [
  // Keys
  {
    id: 'piano', name: 'Piano', emoji: '🎹', family: 'keys', role: 'poly', range: [21, 108], gainDb: 0,
    kind: 'sampler', baseUrl: 'https://tonejs.github.io/audio/salamander/', release: 1.15,
    urls: urls('A1 C2 D#2 F#2 A2 C3 D#3 F#3 A3 C4 D#4 F#4 A4 C5 D#5 F#5 A5 C6 D#6 F#6 A6 C7'),
  },
  {
    id: 'organ', name: 'Organ', emoji: '⛪', family: 'keys', role: 'poly', range: [36, 96], gainDb: -9,
    kind: 'sampler', baseUrl: `${TJI}organ/`, release: 0.5, attack: 0.03, legato: true,
    urls: urls('C1 C2 C3 C4 C5 C6 D#1 D#2 D#3 D#4 D#5 F#1 F#2 F#3 F#4 F#5 A1 A2 A3 A4 A5'),
  },
  {
    id: 'harmonium', name: 'Phong cầm (accordion)', emoji: '🪗', family: 'keys', role: 'poly', range: [36, 84], gainDb: -7,
    kind: 'sampler', baseUrl: `${TJI}harmonium/`, release: 0.5, attack: 0.05, legato: true,
    urls: urls('C2 C3 C4 C5 C#2 C#3 C#4 C#5 D2 D3 D4 D5 D#2 D#3 D#4 E2 E3 E4 F2 F3 F4 F#2 F#3 G2 G3 G4 G#2 G#3 G#4 A2 A3 A4 A#2 A#3 A#4'),
  },
  {
    id: 'harp', name: 'Đàn hạc (harp)', emoji: '🪕', family: 'plucked', role: 'poly', range: [24, 103], gainDb: -1,
    kind: 'sampler', baseUrl: `${TJI}harp/`, release: 2,
    urls: urls('C3 C5 D2 D4 D6 D7 E1 E3 E5 F2 F4 F6 F7 G1 G3 G5 A2 A4 A6 B1 B3 B5 B6'),
  },

  // Bowed strings
  {
    id: 'violin', name: 'Violin', emoji: '🎻', family: 'strings', role: 'melody', range: [55, 100], gainDb: -5,
    kind: 'sampler', baseUrl: `${TJI}violin/`, release: 1.0, attack: 0.09, legato: true,
    urls: urls('A3 A4 A5 A6 C4 C5 C6 C7 E4 E5 E6 G4 G5 G6'),
  },
  {
    // No dedicated viola set: violin samples played in the viola register
    id: 'viola', name: 'Viola', emoji: '🎻', family: 'strings', role: 'melody', range: [48, 84], gainDb: -5,
    kind: 'sampler', baseUrl: `${TJI}violin/`, release: 1.0, attack: 0.1, legato: true,
    urls: urls('A3 A4 A5 C4 C5 C6 E4 E5 G4 G5'),
  },
  {
    id: 'cello', name: 'Cello', emoji: '🎻', family: 'strings', role: 'bass', range: [36, 76], gainDb: -3,
    kind: 'sampler', baseUrl: `${TJI}cello/`, release: 1.0, attack: 0.08, legato: true,
    urls: urls('C2 D2 E2 F2 G2 A2 B2 C3 D3 E3 F3 G3 A3 B3 C4 D4 E4 F4 G4 A4 B4 C5 C#3 C#4 D#2 D#3 D#4 F#3 F#4 G#2 G#3 G#4 A#2 A#3'),
  },
  {
    id: 'contrabass', name: 'Contrabass', emoji: '🎻', family: 'strings', role: 'bass', range: [28, 60], gainDb: 0,
    kind: 'sampler', baseUrl: `${TJI}contrabass/`, release: 0.8, attack: 0.06, legato: true,
    urls: urls('C2 C#3 D2 E2 E3 F#1 F#2 G1 G#2 G#3 A2 A#1 B3'),
  },

  // Plucked
  {
    id: 'guitar-nylon', name: 'Guitar cổ điển', emoji: '🎸', family: 'plucked', role: 'poly', range: [40, 83], gainDb: -1,
    kind: 'sampler', baseUrl: `${TJI}guitar-nylon/`, release: 1.2,
    urls: urls('F#2 F#3 F#4 F#5 G3 G5 G#2 G#4 G#5 A2 A3 A4 A5 A#5 B1 B2 B3 B4 C#3 C#4 C#5 D2 D3 D5 D#4 E2 E3 E4 E5'),
  },
  {
    id: 'guitar-acoustic', name: 'Guitar acoustic', emoji: '🎸', family: 'plucked', role: 'poly', range: [40, 83], gainDb: -2,
    kind: 'sampler', baseUrl: `${TJI}guitar-acoustic/`, release: 1.1,
    urls: urls('E2 F2 F#2 G2 G#2 A2 A#2 B2 C3 C#3 D3 D#3 E3 F3 F#3 G3 G#3 A3 A#3 B3 C4 C#4 D4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5 C#5 D5'),
  },
  {
    id: 'guitar-electric', name: 'Guitar điện', emoji: '🎸', family: 'plucked', role: 'poly', range: [40, 86], gainDb: -4,
    kind: 'sampler', baseUrl: `${TJI}guitar-electric/`, release: 0.9,
    urls: urls('C#2 E2 F#2 A2 C3 D#3 F#3 A3 C4 D#4 F#4 A4 C5 D#5 F#5 A5 C6'),
  },
  {
    id: 'bass-electric', name: 'Guitar bass', emoji: '🎸', family: 'plucked', role: 'bass', range: [28, 60], gainDb: 0,
    kind: 'sampler', baseUrl: `${TJI}bass-electric/`, release: 0.5,
    urls: urls('C#1 E1 G1 A#1 C#2 E2 G2 A#2 C#3 E3 G3 A#3 C#4 E4 G4 A#4'),
  },

  // Woodwinds
  {
    id: 'flute', name: 'Sáo (flute)', emoji: '🪈', family: 'woodwind', role: 'melody', range: [60, 96], gainDb: -6,
    kind: 'sampler', baseUrl: `${TJI}flute/`, release: 0.6, attack: 0.05, legato: true,
    urls: urls('C4 E4 A4 C5 E5 A5 C6 E6 A6 C7'),
  },
  {
    id: 'clarinet', name: 'Clarinet', emoji: '🎷', family: 'woodwind', role: 'melody', range: [50, 91], gainDb: -5,
    kind: 'sampler', baseUrl: `${TJI}clarinet/`, release: 0.6, attack: 0.04, legato: true,
    urls: urls('D3 F3 A#3 D4 F4 A#4 D5 F5 A#5 D6 F#6'),
  },
  {
    id: 'saxophone', name: 'Saxophone', emoji: '🎷', family: 'woodwind', role: 'melody', range: [49, 81], gainDb: -7,
    kind: 'sampler', baseUrl: `${TJI}saxophone/`, release: 0.55, attack: 0.04, legato: true,
    urls: urls('C#3 D3 D#3 E3 F3 F#3 G3 G#3 A#3 B3 C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5 C#5 D5 D#5 E5 F5 F#5 G5 G#5 A5'),
  },
  {
    id: 'bassoon', name: 'Bassoon', emoji: '🎷', family: 'woodwind', role: 'bass', range: [34, 72], gainDb: -3,
    kind: 'sampler', baseUrl: `${TJI}bassoon/`, release: 0.6, attack: 0.04, legato: true,
    urls: urls('G2 A2 C3 G3 A3 C4 E4 G4 A4 C5'),
  },

  // Brass
  {
    id: 'trumpet', name: 'Kèn trumpet', emoji: '🎺', family: 'brass', role: 'melody', range: [54, 86], gainDb: -9,
    kind: 'sampler', baseUrl: `${TJI}trumpet/`, release: 0.5, attack: 0.03, legato: true,
    urls: urls('F3 A3 C4 D#4 F4 G4 A#4 D5 F5 A5 C6'),
  },
  {
    id: 'french-horn', name: 'Kèn cor (horn)', emoji: '📯', family: 'brass', role: 'melody', range: [41, 77], gainDb: -5,
    kind: 'sampler', baseUrl: `${TJI}french-horn/`, release: 0.7, attack: 0.06, legato: true,
    urls: urls('A1 C2 D#2 G2 D3 F3 A3 C4 D5 F5'),
  },
  {
    id: 'trombone', name: 'Trombone', emoji: '🎺', family: 'brass', role: 'melody', range: [40, 72], gainDb: -7,
    kind: 'sampler', baseUrl: `${TJI}trombone/`, release: 0.6, attack: 0.04, legato: true,
    urls: urls('A#1 C#2 D#2 F2 G#2 A#2 C3 D3 D#3 F3 G#3 A#3 C4 C#4 D4 D#4 F4'),
  },
  {
    id: 'tuba', name: 'Tuba', emoji: '🎺', family: 'brass', role: 'bass', range: [28, 58], gainDb: -3,
    kind: 'sampler', baseUrl: `${TJI}tuba/`, release: 0.6, attack: 0.04, legato: true,
    urls: urls('F1 A#1 D#2 F2 A#2 D3 F3 A#3 D4'),
  },

  // Percussion
  {
    id: 'xylophone', name: 'Xylophone', emoji: '🎶', family: 'percussion', role: 'poly', range: [60, 100], gainDb: -5,
    kind: 'sampler', baseUrl: `${TJI}xylophone/`, release: 1,
    urls: urls('G4 C5 G5 C6 G6 C7 G7 C8'),
  },
  { id: 'marimba', name: 'Marimba', emoji: '🎶', family: 'percussion', role: 'poly', range: [45, 96], gainDb: -3, kind: 'synth', synth: 'marimba' },
  { id: 'glockenspiel', name: 'Chuông (glockenspiel)', emoji: '🔔', family: 'percussion', role: 'melody', range: [72, 108], gainDb: -12, kind: 'synth', synth: 'glock' },
  { id: 'timpani', name: 'Trống định âm (timpani)', emoji: '🥁', family: 'percussion', role: 'bass', range: [38, 57], gainDb: -2, kind: 'synth', synth: 'timpani' },
  { id: 'drums', name: 'Bộ trống (drum kit)', emoji: '🥁', family: 'percussion', role: 'drums', range: [36, 71], gainDb: -3, kind: 'drums' },
];

export const INSTRUMENT_MAP = new Map(INSTRUMENTS.map((i) => [i.id, i]));
export const getInstrument = (id) => INSTRUMENT_MAP.get(id) || INSTRUMENT_MAP.get('piano');

/** Fold a MIDI note by octaves into the instrument's comfortable range. */
export function foldToRange(midi, inst) {
  if (!inst?.range || inst.role === 'drums') return midi;
  const [lo, hi] = inst.range;
  let m = midi;
  while (m < lo) m += 12;
  while (m > hi) m -= 12;
  return m < lo ? lo : m;
}

/* Drum-kit layout by pitch class (works for any octave on the keyboard). */
export const DRUM_BY_PC = ['kick', 'rim', 'snare', 'clap', 'snare', 'tomL', 'hhc', 'tomM', 'hhp', 'tomH', 'hho', 'crash'];
export const DRUM_LABEL = {
  kick: 'Kick', rim: 'Rim', snare: 'Snare', clap: 'Clap', tomL: 'Tom 3', tomM: 'Tom 2', tomH: 'Tom 1',
  hhc: 'Hi-hat', hhp: 'HH pedal', hho: 'HH open', crash: 'Crash', ride: 'Ride',
};
export const drumPieceFor = (midi) => {
  const pc = ((midi % 12) + 12) % 12;
  if (pc === 11 && midi >= 60) return 'ride';
  return DRUM_BY_PC[pc];
};
/** Canonical MIDI numbers used by generated drum parts. */
export const DRUM_MIDI = { kick: 36, rim: 37, snare: 38, clap: 39, tomL: 41, hhc: 42, tomM: 43, hhp: 44, tomH: 45, hho: 46, crash: 47, ride: 71 };
