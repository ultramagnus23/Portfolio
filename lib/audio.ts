// AudioController — singleton, never auto-plays, initialised only on first
// user gesture. Two layers now: a quiet 60 Hz carrier drone (foundation),
// and a generative "song" — pluck, bass and drum voices scheduled from a
// deterministic sequence sonifying this site's own content (see
// lib/sonify.ts). Nothing here is a sample or a copy of an existing
// recording; every note is synthesised and derived from hashing text.

import { buildSequence, midiToFreq, type NoteEvent } from "./sonify";

const TEMPO_BPM = 96;
const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_S = 0.12;

export class AudioController {
  private static _instance: AudioController | null = null;

  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private songGain: GainNode | null = null;
  private pluckFilter: BiquadFilterNode | null = null;
  private _muted = true;
  private _chapter = 0;
  private lastTouchMs = 0;

  private sequence: NoteEvent[] = [];
  private seqIndex = 0;
  private nextNoteTime = 0;
  private schedulerId: number | null = null;

  static get instance(): AudioController {
    if (!AudioController._instance) {
      AudioController._instance = new AudioController();
    }
    return AudioController._instance;
  }

  private boot() {
    if (this.ctx) return;
    this.ctx = new AudioContext();

    // Master gain — controls overall mute/unmute with a smooth ramp
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0; // always start muted
    this.masterGain.connect(this.ctx.destination);

    // ── Carrier: 60 Hz sine + slow FM mod — quiet foundation under the song ──
    const carrierGain = this.ctx.createGain();
    carrierGain.gain.value = 0.025;
    carrierGain.connect(this.masterGain);

    const carrierOsc = this.ctx.createOscillator();
    carrierOsc.type = "sine";
    carrierOsc.frequency.value = 60;

    const modOsc = this.ctx.createOscillator();
    modOsc.type = "sine";
    modOsc.frequency.value = 0.1;

    const modGain = this.ctx.createGain();
    modGain.gain.value = 5;
    modOsc.connect(modGain);
    modGain.connect(carrierOsc.frequency);
    carrierOsc.connect(carrierGain);

    carrierOsc.start();
    modOsc.start();

    // ── Song bus: every pluck/bass/drum voice routes through here, then a
    // per-chapter lowpass filter that brightens/dulls the pluck as you
    // scroll ─────────────────────────────────────────────────────────────
    this.songGain = this.ctx.createGain();
    this.songGain.gain.value = 0.9;
    this.songGain.connect(this.masterGain);

    this.pluckFilter = this.ctx.createBiquadFilter();
    this.pluckFilter.type = "lowpass";
    this.pluckFilter.frequency.value = 2200;
    this.pluckFilter.Q.value = 0.7;
    this.pluckFilter.connect(this.songGain);

    this.sequence = buildSequence();
    this.startScheduler();
  }

  private beatSeconds() {
    return 60 / TEMPO_BPM;
  }

  private startScheduler() {
    if (!this.ctx) return;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.schedulerId = window.setInterval(() => this.tick(), LOOKAHEAD_MS);
  }

  private tick() {
    if (!this.ctx) return;
    while (this.nextNoteTime < this.ctx.currentTime + SCHEDULE_AHEAD_S) {
      const note = this.sequence[this.seqIndex];
      this.scheduleNote(note, this.nextNoteTime);
      this.nextNoteTime += note.duration * this.beatSeconds();
      this.seqIndex = (this.seqIndex + 1) % this.sequence.length;
    }
  }

  private scheduleNote(note: NoteEvent, time: number) {
    this.pluck(note, time);
    if (note.isBassBeat) this.bassNote(note, time);
    if (note.drum === "kick") this.kick(time);
    if (note.drum === "hat") this.hat(time);
  }

  // Plucked-string-style voice: fast attack, exponential decay, lowpass —
  // reads as a soft guitar/mbira pluck rather than a synth stab.
  private pluck(note: NoteEvent, time: number) {
    const ctx = this.ctx;
    if (!ctx || !this.pluckFilter) return;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = midiToFreq(note.midi);

    const g = ctx.createGain();
    const dur = note.duration * this.beatSeconds();
    const peak = note.velocity * 0.1;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(peak, time + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, time + dur * 0.95);

    osc.connect(g);
    g.connect(this.pluckFilter);
    osc.start(time);
    osc.stop(time + dur);
  }

  private bassNote(note: NoteEvent, time: number) {
    const ctx = this.ctx;
    if (!ctx || !this.songGain) return;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = midiToFreq(note.midi - 24); // two octaves down

    const g = ctx.createGain();
    const dur = this.beatSeconds() * 1.6;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.12, time + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0008, time + dur);

    osc.connect(g);
    g.connect(this.songGain);
    osc.start(time);
    osc.stop(time + dur + 0.05);
  }

  private kick(time: number) {
    const ctx = this.ctx;
    if (!ctx || !this.songGain) return;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.32, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(g);
    g.connect(this.songGain);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  private hat(time: number) {
    const ctx = this.ctx;
    if (!ctx || !this.songGain) return;
    const bufLen = Math.floor(ctx.sampleRate * 0.05);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = "highpass";
    filt.frequency.value = 6000;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.1, time);
    g.gain.exponentialRampToValueAtTime(0.0008, time + 0.05);

    src.connect(filt);
    filt.connect(g);
    g.connect(this.songGain);
    src.start(time);
  }

  /** Toggle mute. Safe to call before any gesture — boots the context on first call. */
  toggle(): boolean {
    this.boot();
    this._muted = !this._muted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this._muted ? 0 : 1,
        this.ctx.currentTime,
        0.3
      );
    }
    return this._muted;
  }

  get isMuted(): boolean {
    return this._muted;
  }

  /** Call when entering a new scroll chapter (0–4). Brightens/dulls the
   *  pluck voice's filter per chapter, so the song's timbre visibly tracks
   *  scroll position instead of staying static. */
  setChapter(n: number) {
    if (n === this._chapter || !this.ctx || !this.pluckFilter) return;
    this._chapter = n;
    // Chapter 4 (Research): narrow, focused tone — "the resolved signal".
    const freq = n === 4 ? 3400 : 1400 + n * 350;
    const q = n === 4 ? 3 : 0.7;
    this.pluckFilter.frequency.setTargetAtTime(freq, this.ctx.currentTime, 1.5);
    this.pluckFilter.Q.setTargetAtTime(q, this.ctx.currentTime, 1.5);
  }

  /** Brief sine chirp on cursor interaction — 200 ms debounce. */
  touch() {
    if (this._muted || !this.ctx) return;
    const now = Date.now();
    if (now - this.lastTouchMs < 200) return;
    this.lastTouchMs = now;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.04);
    g.gain.setValueAtTime(0.015, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.045);
  }
}
