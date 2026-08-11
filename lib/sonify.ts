// Deterministic sonification of this portfolio's own content. Every note in
// the resulting sequence is derived from hashing project titles, taglines
// and stack lines from data/projects.ts (condensed below) — not sampled,
// not copied, not derived from any existing recording. Run the same corpus
// through this file twice and you get the identical sequence: this is a
// literal encoding of "the CV", not a curated melody.

// A minor pentatonic — whatever scale degree a given word hashes to, the
// result stays consonant. This is what keeps an arbitrary hash "pleasant"
// without any manual note-picking.
const SCALE = [0, 3, 5, 7, 10]; // semitone offsets from root
const ROOT = 57; // MIDI A3

// Condensed identity corpus — who this is and what's been built, in the
// order it appears on the site. Deliberately just fragments, not full
// sentences: only the words matter for the hash, not the grammar.
const CORPUS = [
  "Chaitanya Tripathi builder researcher Ashoka University",
  "CollegeOS admissions black box opening pgvector recommendation chancing",
  "Meza room telling something reads occupancy environment revenue",
  "FoodSafe data buried PDFs pipeline risk propagation fraud",
  "HoloForge hologram degrade worse measure perception phase",
  "Music Morph control mix hands gesture webcam Web Audio",
  "Drill one topic day explain back recall fluency depth coverage",
  "The Global distributor storefront catalogue enquiry",
  "Dash one person one login checklist KPI finance vault",
  "Airthra mining sky fueling earth sulfur fertiliser",
  "CollegeApp six thousand users showed up zero marketing",
  "Klein B water flea fern lake eutrophication sixty days",
  "Orenth GPS people not places WiFi triangulation",
  "signal noise admissions POS export nanometre wavefront nineteen",
].join(" ");

function hashWord(word: string): number {
  let h = 0;
  for (let i = 0; i < word.length; i++) {
    h = (h * 31 + word.charCodeAt(i)) >>> 0;
  }
  return h;
}

export interface NoteEvent {
  midi: number;
  /** Duration in beats. */
  duration: number;
  velocity: number;
  isBassBeat: boolean;
  drum: "kick" | "hat" | null;
}

/** One deterministic pass over the corpus, in order — the whole site's
 *  content, encoded into a loopable sequence. */
export function buildSequence(): NoteEvent[] {
  const words = CORPUS.split(/\s+/).filter(Boolean);
  return words.map((word, i) => {
    const h = hashWord(word.toLowerCase());
    const degree = SCALE[h % SCALE.length];
    const octaveShift = (h >> 3) % 3; // spread across ~2 octaves
    const midi = ROOT + degree + octaveShift * 12;
    const duration = 0.5 + ((h >> 5) % 3) * 0.25; // 0.5 / 0.75 / 1.0 beats
    const velocity = 0.5 + ((h >> 7) % 5) / 10; // 0.5–0.9
    return {
      midi,
      duration,
      velocity,
      isBassBeat: i % 4 === 0,
      drum: i % 4 === 0 ? "kick" : i % 2 === 0 ? "hat" : null,
    };
  });
}

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
