import { DRUM_MIDI, getInstrument } from './instruments.js';

/* Turns a two-hand piano score into ensemble parts (melody, harmony, bass,
 * accompaniment, generated pad & drums) plus per-song ensemble presets. */

export const PARTS = [
  { id: 'melody', label: 'Giai điệu', color: '#E28C4D' },
  { id: 'harmony', label: 'Bè phụ', color: '#C9A227' },
  { id: 'accomp', label: 'Đệm', color: '#6A9E78' },
  { id: 'bass', label: 'Bass', color: '#4E94BE' },
  { id: 'pad', label: 'Nền hoà âm', color: '#9A6B9E' },
  { id: 'drums', label: 'Trống', color: '#C2604A' },
];
export const PART_MAP = new Map(PARTS.map((p) => [p.id, p]));
const PITCHED_PARTS = ['melody', 'harmony', 'accomp', 'bass'];

/* ---------- Per-song style ---------- */

const SONG_STYLE = {
  canon: { meter: 4, drums: 'ballad' },
  'bella-ciao': { meter: 4, drums: 'folk' },
  'wedding-march': { meter: 4, drums: 'march' },
  'ode-to-joy': { meter: 4, drums: 'march' },
  'jingle-bells': { meter: 4, drums: 'pop' },
  'noi-nay-co-anh': { meter: 4, drums: 'ballad' },
  'nang-tho': { meter: 4, drums: 'ballad' },
  'a-thousand-miles': { meter: 4, drums: 'pop' },
  'a-thousand-years': { meter: 3, drums: 'six8' },
  'beautiful-in-white': { meter: 4, drums: 'ballad' },
  'pirates-of-the-caribbean': { meter: 3, drums: 'epic' },
  'concerning-hobbits': { meter: 4, drums: 'folk' },
};
export const styleFor = (song) => SONG_STYLE[song?.id] || { meter: song?.meter || 4, drums: 'ballad' };

/* Track lists: [part, instrument, volume?] */
const SUGGESTED = {
  canon: [['melody', 'violin'], ['harmony', 'viola'], ['accomp', 'harp'], ['bass', 'cello']],
  'bella-ciao': [['melody', 'harmonium'], ['harmony', 'clarinet', 60], ['accomp', 'guitar-acoustic'], ['bass', 'bass-electric'], ['drums', 'drums', 70]],
  'wedding-march': [['melody', 'trumpet'], ['harmony', 'french-horn'], ['accomp', 'organ', 70], ['bass', 'tuba'], ['bass', 'timpani', 50], ['drums', 'drums', 55]],
  'ode-to-joy': [['melody', 'flute'], ['melody', 'violin', 60], ['harmony', 'clarinet'], ['accomp', 'french-horn', 70], ['bass', 'cello'], ['pad', 'viola', 50]],
  'jingle-bells': [['melody', 'glockenspiel', 70], ['melody', 'piano'], ['harmony', 'piano', 70], ['accomp', 'guitar-acoustic'], ['bass', 'bass-electric'], ['drums', 'drums', 75]],
  'noi-nay-co-anh': [['melody', 'piano'], ['harmony', 'piano', 75], ['accomp', 'guitar-acoustic', 70], ['bass', 'bass-electric'], ['pad', 'violin', 45], ['drums', 'drums', 65]],
  'nang-tho': [['melody', 'guitar-nylon'], ['harmony', 'guitar-nylon', 70], ['accomp', 'guitar-nylon', 75], ['bass', 'contrabass'], ['pad', 'cello', 45], ['drums', 'drums', 50]],
  'a-thousand-miles': [['melody', 'piano'], ['harmony', 'piano', 80], ['accomp', 'piano', 80], ['bass', 'bass-electric'], ['pad', 'violin', 45], ['drums', 'drums', 70]],
  'a-thousand-years': [['melody', 'violin'], ['harmony', 'piano', 75], ['accomp', 'piano', 75], ['bass', 'cello'], ['pad', 'viola', 45], ['drums', 'drums', 45]],
  'beautiful-in-white': [['melody', 'piano'], ['harmony', 'piano', 75], ['accomp', 'guitar-acoustic', 70], ['bass', 'bass-electric'], ['pad', 'violin', 45], ['drums', 'drums', 60]],
  'pirates-of-the-caribbean': [['melody', 'violin'], ['melody', 'french-horn', 55], ['harmony', 'trombone', 65], ['accomp', 'cello'], ['bass', 'contrabass'], ['bass', 'timpani', 60], ['drums', 'drums', 70]],
  'concerning-hobbits': [['melody', 'flute'], ['harmony', 'clarinet', 65], ['accomp', 'harp'], ['bass', 'contrabass'], ['pad', 'violin', 40]],
};

export const PRESETS = [
  { id: 'suggested', label: 'Gợi ý cho bài' },
  {
    id: 'orchestra', label: 'Giao hưởng',
    tracks: [['melody', 'violin'], ['melody', 'flute', 55], ['harmony', 'clarinet', 70], ['accomp', 'harp'], ['accomp', 'french-horn', 55],
      ['bass', 'cello'], ['bass', 'contrabass', 70], ['pad', 'viola', 45], ['bass', 'timpani', 40]],
  },
  { id: 'strings', label: 'Tứ tấu dây', tracks: [['melody', 'violin'], ['harmony', 'viola'], ['accomp', 'cello', 80], ['bass', 'contrabass']] },
  {
    id: 'band', label: 'Ban nhạc pop',
    tracks: [['melody', 'piano'], ['harmony', 'guitar-electric', 65], ['accomp', 'guitar-acoustic', 75], ['bass', 'bass-electric'], ['pad', 'organ', 40], ['drums', 'drums', 75]],
  },
  { id: 'acoustic', label: 'Acoustic', tracks: [['melody', 'flute', 80], ['harmony', 'guitar-nylon'], ['accomp', 'guitar-acoustic'], ['bass', 'contrabass'], ['drums', 'drums', 45]] },
  { id: 'brass', label: 'Kèn đồng', tracks: [['melody', 'trumpet'], ['harmony', 'french-horn'], ['accomp', 'trombone'], ['bass', 'tuba'], ['drums', 'drums', 60]] },
  { id: 'winds', label: 'Bộ gỗ', tracks: [['melody', 'flute'], ['harmony', 'clarinet'], ['accomp', 'saxophone', 70], ['bass', 'bassoon']] },
  { id: 'percussion', label: 'Bộ gõ', tracks: [['melody', 'xylophone'], ['harmony', 'marimba', 75], ['accomp', 'marimba'], ['bass', 'timpani'], ['drums', 'drums']] },
];

const DEFAULT_SUGGESTED = PRESETS.find((p) => p.id === 'band').tracks;

let trackSeq = 0;
export const makeTrack = (part, instrument, volume = 85) => ({
  key: `t${++trackSeq}`, part, instrument, volume, muted: false, soloed: false,
});

export function presetTracks(presetId, song) {
  const preset = PRESETS.find((p) => p.id === presetId);
  const list = presetId === 'suggested' || !preset?.tracks
    ? SUGGESTED[song?.id] || DEFAULT_SUGGESTED
    : preset.tracks;
  return list.map(([part, inst, vol]) => makeTrack(part, inst, vol ?? 85));
}

/** Parts an instrument plays when it performs alone. */
export function soloParts(instId) {
  switch (getInstrument(instId).role) {
    case 'poly': return PITCHED_PARTS;
    case 'bass': return ['bass'];
    case 'drums': return ['drums'];
    default: return ['melody'];
  }
}

/* ---------- Score splitting ---------- */

const EPS = 1e-4;

function groupByOnset(events) {
  const groups = [];
  let cur = null;
  for (const ev of events) {
    if (!cur || Math.abs(ev.beat - cur.beat) > EPS) {
      cur = { beat: ev.beat, list: [] };
      groups.push(cur);
    }
    cur.list.push(ev);
  }
  return groups;
}

const toPartEvent = (ev, part) => ({ beat: ev.beat, dur: ev.audioDur ?? ev.dur, midi: ev.midi, vel: ev.vel, part });

/** Highest RH note per onset = melody, rest = harmony; lowest LH = bass, rest = accompaniment. */
function splitHands(song, meter) {
  const rh = song.events.filter((e) => e.hand !== 'LH');
  const lh = song.events.filter((e) => e.hand === 'LH');
  const out = { melody: [], harmony: [], bass: [], accomp: [] };
  for (const g of groupByOnset(rh)) {
    const top = g.list.reduce((a, b) => (b.midi > a.midi ? b : a));
    g.list.forEach((ev) => out[ev === top ? 'melody' : 'harmony'].push(toPartEvent(ev, ev === top ? 'melody' : 'harmony')));
  }
  // Bass = lowest LH note in each half-bar window (so arpeggios stay in the accompaniment)
  const win = meter === 3 ? 3 : meter / 2;
  const windows = new Map();
  for (const ev of lh) {
    const w = Math.floor((ev.beat + EPS) / win);
    const cur = windows.get(w);
    if (!cur || ev.midi < cur.midi || (ev.midi === cur.midi && ev.beat < cur.beat)) windows.set(w, ev);
  }
  const bassSet = new Set(windows.values());
  for (const ev of lh) {
    if (bassSet.has(ev)) out.bass.push(toPartEvent(ev, 'bass'));
    else out.accomp.push(toPartEvent(ev, 'accomp'));
  }
  // Let each bass note ring until the next one (capped to one window)
  out.bass.forEach((ev, i) => {
    const next = out.bass[i + 1];
    const gap = next ? next.beat - ev.beat : win;
    ev.dur = Math.max(ev.dur, Math.min(gap, win));
  });
  return out;
}

/* ---------- Generated pad (sustained chord per bar) ---------- */

function buildPad(song, meter) {
  const pad = [];
  let prev = null;
  for (let b = 0; b < song.totalBeats - EPS; b += meter) {
    const end = b + meter;
    const weight = new Map();
    let bassPc = null;
    let bassMidi = Infinity;
    for (const ev of song.events) {
      if (ev.beat >= end) break;
      const evEnd = ev.beat + ev.dur;
      if (evEnd <= b + EPS) continue;
      const overlap = Math.min(end, evEnd) - Math.max(b, ev.beat);
      if (overlap <= 0) continue;
      const pc = ev.midi % 12;
      weight.set(pc, (weight.get(pc) || 0) + overlap * (ev.hand === 'LH' ? 1.4 : 0.8));
      if (ev.hand === 'LH' && ev.midi < bassMidi) { bassMidi = ev.midi; bassPc = pc; }
    }
    if (!weight.size) { prev = null; continue; }

    const ranked = [...weight.entries()].sort((a, c) => c[1] - a[1]).map(([pc]) => pc);
    const pcs = bassPc !== null ? [bassPc, ...ranked.filter((p) => p !== bassPc)] : ranked;
    const chosen = pcs.slice(0, 3);
    if (chosen.length === 1) chosen.push((chosen[0] + 7) % 12);

    // Voice each pitch class inside G3..C5
    const notes = [...new Set(chosen.map((pc) => { let m = 55 + ((pc - 55) % 12 + 12) % 12; return m; }))].sort((x, y) => x - y);
    const sig = notes.join(',');

    if (prev && prev.sig === sig && prev.bars < 2 && Math.abs(prev.end - b) < EPS) {
      prev.events.forEach((e) => { e.dur += meter; });
      prev.end = end;
      prev.bars += 1;
    } else {
      const events = notes.map((midi) => ({ beat: b, dur: meter, midi, vel: 0.42, part: 'pad' }));
      pad.push(...events);
      prev = { sig, end, bars: 1, events };
    }
  }
  return pad;
}

/* ---------- Generated drums ---------- */

const D = DRUM_MIDI;
const PATTERNS = {
  pop: (m) => [[0, D.kick, 0.95], [1, D.snare, 0.85], [2, D.kick, 0.85], [2.5, D.kick, 0.55], [3, D.snare, 0.85],
    ...Array.from({ length: m * 2 }, (_, i) => [i / 2, D.hhc, i % 2 ? 0.35 : 0.55])],
  ballad: (m) => [[0, D.kick, 0.8], [2.5, D.kick, 0.5], [1, D.rim, 0.6], [3, D.snare, 0.6],
    ...Array.from({ length: m }, (_, i) => [i, D.hhc, 0.4])],
  folk: (m) => [[0, D.kick, 0.9], [2, D.kick, 0.8], [1, D.snare, 0.7], [3, D.snare, 0.7],
    ...Array.from({ length: m }, (_, i) => [i + 0.5, D.hho, 0.32])],
  march: () => [[0, D.kick, 0.9], [2, D.kick, 0.8], [1, D.snare, 0.75], [3, D.snare, 0.75], [3.5, D.snare, 0.45]],
  waltz: () => [[0, D.kick, 0.85], [1, D.hhc, 0.45], [2, D.hhc, 0.45], [1, D.rim, 0.4], [2, D.rim, 0.4]],
  six8: () => [[0, D.kick, 0.8], [1.5, D.snare, 0.55], ...Array.from({ length: 6 }, (_, i) => [i / 2, D.hhc, i % 3 ? 0.3 : 0.5])],
  epic: () => [[0, D.kick, 0.95], [0.5, D.kick, 0.6], [1, D.tomL, 0.75], [1.5, D.snare, 0.8], [2, D.tomM, 0.7], [2.5, D.tomL, 0.6],
    ...Array.from({ length: 6 }, (_, i) => [i / 2, D.hhc, 0.3])],
};

function buildDrums(song, meter, styleName) {
  let style = PATTERNS[styleName] ? styleName : 'ballad';
  if (meter === 3 && !['waltz', 'six8', 'epic'].includes(style)) style = 'waltz';
  if (meter !== 3 && ['waltz', 'six8', 'epic'].includes(style)) style = 'ballad';
  const pattern = PATTERNS[style](meter).filter(([off]) => off < meter);

  const bars = Math.ceil(song.totalBeats / meter - EPS);
  const active = new Array(bars).fill(false);
  for (const ev of song.events) {
    const from = Math.floor(ev.beat / meter);
    const to = Math.min(bars - 1, Math.floor((ev.beat + ev.dur - EPS) / meter));
    for (let i = from; i <= to; i += 1) active[i] = true;
  }

  const drums = [];
  for (let i = 0; i < bars; i += 1) {
    if (!active[i]) continue;
    const b = i * meter;
    const last = i === bars - 1;
    if (last) {
      drums.push({ beat: b, dur: 0.5, midi: D.crash, vel: 0.85, part: 'drums' }, { beat: b, dur: 0.5, midi: D.kick, vel: 0.9, part: 'drums' });
      continue;
    }
    const phraseStart = i % 8 === 0;
    const fill = i % 8 === 7 && active[i + 1];
    for (const [off, midi, vel] of pattern) {
      if (fill && off >= meter - 1) continue;
      if (phraseStart && off === 0 && (midi === D.hhc || midi === D.hho)) continue;
      drums.push({ beat: b + off, dur: 0.25, midi, vel, part: 'drums' });
    }
    if (phraseStart) drums.push({ beat: b, dur: 0.5, midi: D.crash, vel: 0.7, part: 'drums' });
    if (fill) {
      [[0, D.snare], [0.25, D.tomH], [0.5, D.tomM], [0.75, D.tomL]].forEach(([o, midi]) => {
        drums.push({ beat: b + meter - 1 + o, dur: 0.2, midi, vel: 0.7, part: 'drums' });
      });
    }
  }
  return drums;
}

/* ---------- Legato: tie each note into the next onset of its part ---------- */

const MAX_TIE_GAP = 1; // beats of rest that may be bridged; longer rests stay silent

function addLegato(events) {
  const onsets = [...new Set(events.map((e) => e.beat))].sort((x, y) => x - y);
  let j = 0;
  for (const ev of events) {
    while (j < onsets.length && onsets[j] <= ev.beat + EPS) j += 1;
    const next = onsets[j];
    const end = ev.beat + ev.dur;
    if (next === undefined) ev.legatoDur = ev.dur + 0.5;
    else if (next - end <= MAX_TIE_GAP) ev.legatoDur = Math.max(ev.dur, next - ev.beat);
    else ev.legatoDur = ev.dur + 0.25;
  }
}

/* ---------- Public: cached arrangement ---------- */

const cache = new WeakMap();

export function arrangeSong(song) {
  if (cache.has(song)) return cache.get(song);
  const { meter, drums: drumStyle } = styleFor(song);
  const parts = splitHands(song, meter);
  parts.pad = buildPad(song, meter);
  parts.drums = buildDrums(song, meter, drumStyle);
  PITCHED_PARTS.forEach((p) => { parts[p].sort((x, y) => x.beat - y.beat); addLegato(parts[p]); });
  parts.pad.forEach((ev) => { ev.legatoDur = ev.dur; });
  const timeline = Object.values(parts).flat().sort((a, b) => a.beat - b.beat);
  const result = { parts, timeline, meter };
  cache.set(song, result);
  return result;
}
