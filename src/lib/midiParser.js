import { midiToNote, isBlackMidi } from './music.js';

const STORAGE_KEY = 'piano-studio:imported-midi:v1';
const ACCENTS = ['#4E94BE', '#C97335', '#6A9E78', '#9A6B9E', '#C2604A', '#B48A3C'];
const RH_NAME_RE = /\b(right|rh|treble|melod|vocal|voice|lead|soprano|tay\s*ph[aả]i)\b/i;
const LH_NAME_RE = /\b(left|lh|bass|accomp|chords?|tay\s*tr[aá]i)\b/i;

const MAJOR_KEYS_SHARP = ['C major', 'G major', 'D major', 'A major', 'E major', 'B major', 'F♯ major', 'C♯ major'];
const MAJOR_KEYS_FLAT = ['C major', 'F major', 'B♭ major', 'E♭ major', 'A♭ major', 'D♭ major', 'G♭ major', 'C♭ major'];
const MINOR_KEYS_SHARP = ['A minor', 'E minor', 'B minor', 'F♯ minor', 'C♯ minor', 'G♯ minor', 'D♯ minor', 'A♯ minor'];
const MINOR_KEYS_FLAT = ['A minor', 'D minor', 'G minor', 'C minor', 'F minor', 'B♭ minor', 'E♭ minor', 'A♭ minor'];

const KEY_PC_NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
const MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

function readAscii(bytes, offset, len) {
  let out = '';
  for (let i = 0; i < len && offset + i < bytes.length; i += 1) {
    out += String.fromCharCode(bytes[offset + i]);
  }
  return out;
}

function findMthdOffset(bytes) {
  if (bytes.length < 18) return -1;
  if (readAscii(bytes, 0, 4) === 'MThd') return 0;
  if (readAscii(bytes, 0, 4) === 'RIFF') {
    const limit = Math.min(bytes.length - 4, 128);
    for (let i = 8; i <= limit; i += 1) {
      if (bytes[i] === 0x4d && bytes[i + 1] === 0x54 && bytes[i + 2] === 0x68 && bytes[i + 3] === 0x64) {
        return i;
      }
    }
  }
  return -1;
}

function decodeKeySignature(sfRaw, mi) {
  const sf = sfRaw > 127 ? sfRaw - 256 : sfRaw;
  if (sf < -7 || sf > 7) return null;
  if (mi === 0) return sf >= 0 ? MAJOR_KEYS_SHARP[sf] : MAJOR_KEYS_FLAT[-sf];
  if (mi === 1) return sf >= 0 ? MINOR_KEYS_SHARP[sf] : MINOR_KEYS_FLAT[-sf];
  return null;
}

function estimateKey(events) {
  const weights = new Float64Array(12);
  for (const ev of events) {
    weights[((ev.midi % 12) + 12) % 12] += Math.max(0.05, ev.dur);
  }
  let bestKey = 'C major';
  let bestScore = -Infinity;
  for (let root = 0; root < 12; root += 1) {
    let majScore = 0;
    let minScore = 0;
    for (let i = 0; i < 12; i += 1) {
      const w = weights[(root + i) % 12];
      majScore += w * MAJOR_PROFILE[i];
      minScore += w * MINOR_PROFILE[i];
    }
    if (majScore > bestScore) {
      bestScore = majScore;
      bestKey = `${KEY_PC_NAMES[root]} major`;
    }
    if (minScore > bestScore) {
      bestScore = minScore;
      bestKey = `${KEY_PC_NAMES[root]} minor`;
    }
  }
  return bestKey;
}

function clampToPianoRange(midi) {
  let m = midi;
  while (m < 21) m += 12;
  while (m > 108) m -= 12;
  return m;
}

function medianOf(nums) {
  if (!nums.length) return 60;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function cleanTitle(fileName, fallbackTrackTitle) {
  const stripped = (fileName || '')
    .replace(/\.(midi?|rmi)$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const generic = !stripped || /^(imported|untitled|track\s*\d*|midi\s*\d*)$/i.test(stripped);
  if (generic && fallbackTrackTitle) return fallbackTrackTitle;
  return stripped || fallbackTrackTitle || 'Imported MIDI';
}

function accentForTitle(title) {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) {
    hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  }
  return ACCENTS[hash % ACCENTS.length];
}

function assignHands(notes, trackNames) {
  const byTrack = new Map();
  for (const n of notes) {
    if (!byTrack.has(n.trackIdx)) byTrack.set(n.trackIdx, []);
    byTrack.get(n.trackIdx).push(n);
  }

  const trackEntries = Array.from(byTrack.entries());
  const trackHand = new Map();

  if (trackEntries.length === 2) {
    const [tA, listA] = trackEntries[0];
    const [tB, listB] = trackEntries[1];
    const nameA = trackNames.get(tA) || '';
    const nameB = trackNames.get(tB) || '';
    const aRH = RH_NAME_RE.test(nameA);
    const aLH = LH_NAME_RE.test(nameA);
    const bRH = RH_NAME_RE.test(nameB);
    const bLH = LH_NAME_RE.test(nameB);

    if ((aRH && bLH) || (aRH && !bRH) || (bLH && !aLH)) {
      trackHand.set(tA, 'RH');
      trackHand.set(tB, 'LH');
    } else if ((bRH && aLH) || (bRH && !aRH) || (aLH && !bLH)) {
      trackHand.set(tA, 'LH');
      trackHand.set(tB, 'RH');
    } else {
      const medA = medianOf(listA.map((n) => n.midi));
      const medB = medianOf(listB.map((n) => n.midi));
      if (Math.abs(medA - medB) >= 2.5) {
        trackHand.set(tA, medA > medB ? 'RH' : 'LH');
        trackHand.set(tB, medB > medA ? 'RH' : 'LH');
      }
    }
  } else if (trackEntries.length > 2) {
    for (const [tIdx, list] of trackEntries) {
      const name = trackNames.get(tIdx) || '';
      if (RH_NAME_RE.test(name)) {
        trackHand.set(tIdx, 'RH');
      } else if (LH_NAME_RE.test(name)) {
        trackHand.set(tIdx, 'LH');
      } else {
        const med = medianOf(list.map((n) => n.midi));
        if (med < 57) trackHand.set(tIdx, 'LH');
        else if (med >= 64) trackHand.set(tIdx, 'RH');
      }
    }
  }

  const unassigned = [];
  for (const n of notes) {
    const fixed = trackHand.get(n.trackIdx);
    if (fixed) n.hand = fixed;
    else {
      n.hand = null;
      unassigned.push(n);
    }
  }

  if (unassigned.length > 0) {
    unassigned.sort((a, b) => a.startSec - b.startSec || a.midi - b.midi);
    let split = 60;
    let i = 0;
    while (i < unassigned.length) {
      const anchorTime = unassigned[i].startSec;
      let j = i + 1;
      while (j < unassigned.length && unassigned[j].startSec - anchorTime <= 0.045) {
        j += 1;
      }
      const win = unassigned.slice(i, j).sort((a, b) => a.midi - b.midi);
      const minMidi = win[0].midi;
      const maxMidi = win[win.length - 1].midi;

      if (maxMidi - minMidi >= 7) {
        const midPoint = (minMidi + maxMidi) / 2;
        const cutoff = Math.min(63, maxMidi - 10);
        for (const n of win) {
          const isLow = n.midi <= cutoff || (minMidi < 58 && n.midi < midPoint);
          n.hand = isLow ? 'LH' : 'RH';
        }
        split = 0.82 * split + 0.18 * Math.max(54, Math.min(65, midPoint));
      } else {
        let sum = 0;
        for (const n of win) sum += n.midi;
        const mean = sum / win.length;
        const hand = mean >= split ? 'RH' : 'LH';
        for (const n of win) n.hand = hand;
      }
      i = j;
    }
  }
}

/**
 * Parse a Standard MIDI File (.mid / .midi / .rmi) into a Piano Studio song object.
 */
export function parseMidiFile(inputBuffer, fileName = 'Imported.mid') {
  const bytes = inputBuffer instanceof Uint8Array ? inputBuffer : new Uint8Array(inputBuffer);
  const mthdOffset = findMthdOffset(bytes);
  if (mthdOffset < 0 || mthdOffset + 14 > bytes.length) {
    throw new Error('File không đúng định dạng MIDI (.mid).');
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const headerLen = view.getUint32(mthdOffset + 4, false);
  const format = view.getUint16(mthdOffset + 8, false);
  if (format === 2) {
    throw new Error('Không hỗ trợ MIDI định dạng 2 (multi-song).');
  }
  const division = view.getUint16(mthdOffset + 12, false);

  const isSmpte = (division & 0x8000) !== 0;
  let ticksPerBeat = 480;
  let smpteTicksPerSec = 1000;
  if (!isSmpte) {
    ticksPerBeat = division;
    if (ticksPerBeat <= 0) {
      throw new Error('File MIDI có thông số nhịp (division) không hợp lệ.');
    }
  } else {
    const rawFps = -((division >> 8) - 256);
    const fps = rawFps === 29 ? 29.97 : rawFps || 24;
    const ticksPerFrame = division & 0xff || 1;
    smpteTicksPerSec = fps * ticksPerFrame;
  }

  let cursor = mthdOffset + 8 + headerLen;
  const tempoEvents = [];
  const trackNames = new Map();
  const allNotes = [];
  let detectedKey = null;
  let firstTrackTitle = '';
  let trackIdx = 0;
  const textDecoder = new TextDecoder('utf-8', { fatal: false });

  while (cursor + 8 <= bytes.length) {
    const tag = readAscii(bytes, cursor, 4);
    const chunkLen = view.getUint32(cursor + 4, false);
    cursor += 8;
    const trackEnd = Math.min(bytes.length, cursor + chunkLen);

    if (tag !== 'MTrk') {
      cursor = trackEnd;
      continue;
    }

    let pos = cursor;
    let tick = 0;
    let runningStatus = 0;
    const openNotes = new Map();
    const pedalDown = new Array(16).fill(false);
    const pedaledNotes = Array.from({ length: 16 }, () => []);

    const readVlq = () => {
      let val = 0;
      for (let k = 0; k < 5 && pos < trackEnd; k += 1) {
        const b = bytes[pos++];
        val = (val << 7) | (b & 0x7f);
        if ((b & 0x80) === 0) return val;
      }
      return val;
    };

    const closeNote = (ch, midi, endTick) => {
      const key = (ch << 8) | midi;
      const note = openNotes.get(key);
      if (!note) return;
      openNotes.delete(key);
      note.endTick = Math.max(note.startTick + 1, endTick);
      if (pedalDown[ch]) {
        pedaledNotes[ch].push(note);
      }
      allNotes.push(note);
    };

    while (pos < trackEnd) {
      const delta = readVlq();
      tick += delta;
      if (pos >= trackEnd) break;

      let status;
      const peek = bytes[pos];
      if (peek >= 0x80) {
        pos += 1;
        status = peek;
        runningStatus = peek < 0xf0 ? peek : 0;
      } else {
        if (!runningStatus) break;
        status = runningStatus;
      }

      if (status < 0xf0) {
        const type = status & 0xf0;
        const ch = status & 0x0f;

        if (type === 0x90) {
          if (pos + 2 > trackEnd) break;
          const midi = bytes[pos++];
          const vel = bytes[pos++];
          if (vel > 0) {
            closeNote(ch, midi, tick);
            openNotes.set((ch << 8) | midi, {
              trackIdx,
              channel: ch,
              midi,
              startTick: tick,
              endTick: null,
              sustainEndTick: null,
              vel: Math.max(0.18, Math.min(1, vel / 127)),
            });
          } else {
            closeNote(ch, midi, tick);
          }
        } else if (type === 0x80) {
          if (pos + 2 > trackEnd) break;
          const midi = bytes[pos++];
          pos += 1; // release velocity
          closeNote(ch, midi, tick);
        } else if (type === 0xb0) {
          if (pos + 2 > trackEnd) break;
          const cc = bytes[pos++];
          const val = bytes[pos++];
          if (cc === 64) {
            const down = val >= 64;
            if (pedalDown[ch] && !down) {
              for (const n of pedaledNotes[ch]) {
                n.sustainEndTick = tick;
              }
              pedaledNotes[ch].length = 0;
            }
            pedalDown[ch] = down;
          }
        } else if (type === 0xa0 || type === 0xe0) {
          pos += 2;
        } else if (type === 0xc0 || type === 0xd0) {
          pos += 1;
        }
      } else if (status === 0xf0 || status === 0xf7) {
        const len = readVlq();
        pos += len;
      } else if (status === 0xff) {
        if (pos >= trackEnd) break;
        const metaType = bytes[pos++];
        const len = readVlq();
        const dataEnd = Math.min(trackEnd, pos + len);
        if (metaType === 0x51 && dataEnd - pos === 3) {
          const usPerBeat = (bytes[pos] << 16) | (bytes[pos + 1] << 8) | bytes[pos + 2];
          if (usPerBeat > 0) tempoEvents.push({ tick, usPerBeat });
        } else if (metaType === 0x59 && dataEnd - pos >= 2 && !detectedKey) {
          detectedKey = decodeKeySignature(bytes[pos], bytes[pos + 1]);
        } else if (metaType === 0x03 && dataEnd > pos && !trackNames.has(trackIdx)) {
          const rawName = textDecoder.decode(bytes.subarray(pos, dataEnd)).replace(/[\x00-\x1f]+/g, ' ').trim();
          if (rawName) {
            trackNames.set(trackIdx, rawName);
            if (trackIdx === 0 && !firstTrackTitle) firstTrackTitle = rawName;
          }
        } else if (metaType === 0x2f) {
          pos = dataEnd;
          break;
        }
        pos = dataEnd;
      } else {
        break;
      }
    }

    const fallbackEndTick = tick + Math.round((ticksPerBeat || 240) * 0.25);
    for (const note of openNotes.values()) {
      note.endTick = Math.max(note.startTick + 1, fallbackEndTick);
      allNotes.push(note);
    }
    for (let ch = 0; ch < 16; ch += 1) {
      for (const n of pedaledNotes[ch]) {
        n.sustainEndTick = tick;
      }
    }

    cursor = trackEnd;
    trackIdx += 1;
  }

  const pitchedNotes = allNotes.filter((n) => n.channel !== 9);
  const workingNotes = pitchedNotes.length > 0 ? pitchedNotes : allNotes;
  if (workingNotes.length === 0) {
    throw new Error('File MIDI không có nốt nhạc nào để phát.');
  }

  // Build tempo map & tickToSec
  let tickToSec;
  let bpm = 120;

  if (isSmpte) {
    tickToSec = (t) => t / smpteTicksPerSec;
  } else {
    tempoEvents.sort((a, b) => a.tick - b.tick);
    const mergedTempos = [];
    for (const te of tempoEvents) {
      if (mergedTempos.length && mergedTempos[mergedTempos.length - 1].tick === te.tick) {
        mergedTempos[mergedTempos.length - 1].usPerBeat = te.usPerBeat;
      } else {
        mergedTempos.push({ ...te });
      }
    }
    if (!mergedTempos.length || mergedTempos[0].tick > 0) {
      mergedTempos.unshift({ tick: 0, usPerBeat: 500000 });
    }

    const tempoSegs = [];
    let accSec = 0;
    for (let i = 0; i < mergedTempos.length; i += 1) {
      const cur = mergedTempos[i];
      if (i > 0) {
        const prev = mergedTempos[i - 1];
        accSec += ((cur.tick - prev.tick) / ticksPerBeat) * (prev.usPerBeat / 1e6);
      }
      tempoSegs.push({ tick: cur.tick, usPerBeat: cur.usPerBeat, startSec: accSec });
    }

    tickToSec = (t) => {
      let lo = 0;
      let hi = tempoSegs.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (tempoSegs[mid].tick <= t) lo = mid;
        else hi = mid - 1;
      }
      const seg = tempoSegs[lo];
      return seg.startSec + ((t - seg.tick) / ticksPerBeat) * (seg.usPerBeat / 1e6);
    };

    let minTick = Infinity;
    let maxTick = 0;
    for (const n of workingNotes) {
      if (n.startTick < minTick) minTick = n.startTick;
      if (n.endTick > maxTick) maxTick = n.endTick;
    }
    let weightedBpmSum = 0;
    let totalDurSec = 0;
    for (let i = 0; i < tempoSegs.length; i += 1) {
      const segStart = Math.max(minTick, tempoSegs[i].tick);
      const segEndTick = i + 1 < tempoSegs.length ? Math.min(maxTick, tempoSegs[i + 1].tick) : maxTick;
      if (segEndTick > segStart) {
        const segDur = tickToSec(segEndTick) - tickToSec(segStart);
        const segBpm = 60e6 / tempoSegs[i].usPerBeat;
        weightedBpmSum += segBpm * segDur;
        totalDurSec += segDur;
      }
    }
    if (totalDurSec > 0) {
      bpm = Math.max(40, Math.min(220, Math.round(weightedBpmSum / totalDurSec)));
    }
  }

  let minStartSec = Infinity;
  for (const n of workingNotes) {
    n.midi = clampToPianoRange(n.midi);
    n.startSec = tickToSec(n.startTick);
    n.endSec = Math.max(n.startSec + 0.05, tickToSec(n.endTick));
    n.rawSustainSec = n.sustainEndTick ? tickToSec(n.sustainEndTick) : n.endSec;
    if (n.startSec < minStartSec) minStartSec = n.startSec;
  }

  const leadShift = minStartSec > 0.12 ? minStartSec - 0.08 : 0;
  for (const n of workingNotes) {
    n.startSec = Math.max(0, n.startSec - leadShift);
    n.endSec = Math.max(n.startSec + 0.05, n.endSec - leadShift);
    n.rawSustainSec = Math.max(n.endSec, n.rawSustainSec - leadShift);
  }

  workingNotes.sort((a, b) => a.startSec - b.startSec || a.midi - b.midi);

  // Cap sustain pedal duration before next strike of same pitch or 5.5s max
  const lastByMidi = new Map();
  for (let i = workingNotes.length - 1; i >= 0; i -= 1) {
    const n = workingNotes[i];
    const nextStart = lastByMidi.get(n.midi);
    if (n.rawSustainSec > n.endSec + 0.02) {
      const capNext = nextStart !== undefined ? nextStart - 0.01 : Infinity;
      n.sustainSec = Math.max(n.endSec, Math.min(n.rawSustainSec, capNext, n.startSec + 5.5));
    } else {
      n.sustainSec = n.endSec;
    }
    lastByMidi.set(n.midi, n.startSec);
  }

  assignHands(workingNotes, trackNames);

  const bps = bpm / 60;
  const rawEvents = workingNotes.map((n) => {
    const beat = Number((n.startSec * bps).toFixed(4));
    const dur = Number(Math.max(0.06, (n.endSec - n.startSec) * bps).toFixed(4));
    const audioDur = n.sustainSec > n.endSec + 0.03
      ? Number(((n.sustainSec - n.startSec) * bps).toFixed(4))
      : undefined;
    return {
      beat,
      dur,
      midi: n.midi,
      note: midiToNote(n.midi),
      hand: n.hand,
      vel: Number(n.vel.toFixed(3)),
      ...(audioDur !== undefined ? { audioDur } : {}),
    };
  });

  // Deduplicate simultaneous identical-pitch strikes
  rawEvents.sort((a, b) => {
    if (Math.abs(a.beat - b.beat) > 1e-6) return a.beat - b.beat;
    if (a.hand !== b.hand) return a.hand === 'LH' ? -1 : 1;
    return a.midi - b.midi;
  });

  const events = [];
  for (const ev of rawEvents) {
    let dup = null;
    for (let k = events.length - 1; k >= 0; k -= 1) {
      const prev = events[k];
      if (ev.beat - prev.beat >= 0.025) break;
      if (prev.midi === ev.midi) {
        dup = prev;
        break;
      }
    }
    if (dup) {
      dup.dur = Math.max(dup.dur, ev.dur);
      dup.vel = Math.max(dup.vel, ev.vel);
      if (ev.audioDur !== undefined) {
        dup.audioDur = dup.audioDur !== undefined ? Math.max(dup.audioDur, ev.audioDur) : ev.audioDur;
      }
      if ((dup.hand === 'RH' || ev.hand === 'RH') && ev.midi >= 60) {
        dup.hand = 'RH';
      }
    } else {
      events.push(ev);
    }
  }

  let minMidi = Infinity;
  let maxMidi = -Infinity;
  let totalBeats = 0;
  events.forEach((ev, idx) => {
    ev.id = idx;
    if (ev.midi < minMidi) minMidi = ev.midi;
    if (ev.midi > maxMidi) maxMidi = ev.midi;
    const endBeat = ev.beat + ev.dur;
    if (endBeat > totalBeats) totalBeats = endBeat;
  });

  if (maxMidi - minMidi < 23) {
    const mid = Math.round((minMidi + maxMidi) / 2);
    minMidi = Math.max(21, mid - 12);
    maxMidi = Math.min(108, minMidi + 23);
    if (maxMidi - minMidi < 23) {
      minMidi = Math.max(21, maxMidi - 23);
    }
  }

  let rangeMinMidi = minMidi;
  let rangeMaxMidi = maxMidi;
  if (isBlackMidi(rangeMinMidi)) rangeMinMidi = Math.max(21, rangeMinMidi - 1);
  if (isBlackMidi(rangeMaxMidi)) rangeMaxMidi = Math.min(108, rangeMaxMidi + 1);

  const title = cleanTitle(fileName, firstTrackTitle);
  const key = detectedKey || estimateKey(events);
  const accent = accentForTitle(title);

  return {
    id: `midi-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    composer: 'MIDI (.mid)',
    key,
    accent,
    bpm,
    events,
    totalBeats,
    durationSec: (totalBeats * 60) / bpm,
    rangeMinMidi,
    rangeMaxMidi,
    imported: true,
  };
}

export function loadImportedSongs() {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list
      .filter((s) => s && typeof s.id === 'string' && Array.isArray(s.events) && s.events.length > 0)
      .map((s) => ({
        ...s,
        imported: true,
        events: s.events.map((t, idx) => ({
          id: idx,
          beat: t[0],
          dur: t[1],
          midi: t[2],
          note: midiToNote(t[2]),
          hand: t[3] === 1 ? 'RH' : 'LH',
          vel: t[4],
          ...(t[5] > 0 ? { audioDur: t[5] } : {}),
        })),
      }));
  } catch {
    return [];
  }
}

export function saveImportedSongs(songs) {
  try {
    if (typeof localStorage === 'undefined') return;
    const compact = songs.map((s) => ({
      id: s.id,
      title: s.title,
      composer: s.composer,
      key: s.key,
      accent: s.accent,
      bpm: s.bpm,
      totalBeats: s.totalBeats,
      durationSec: s.durationSec,
      rangeMinMidi: s.rangeMinMidi,
      rangeMaxMidi: s.rangeMaxMidi,
      events: s.events.map((ev) => [
        ev.beat,
        ev.dur,
        ev.midi,
        ev.hand === 'RH' ? 1 : 0,
        Number(ev.vel.toFixed(2)),
        ev.audioDur || 0,
      ]),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
  } catch {
    // Ignore storage quota or private mode errors gracefully
  }
}
