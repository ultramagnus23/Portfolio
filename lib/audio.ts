// AudioController — singleton, never auto-plays, initialised only on first user gesture.
// Three layers: carrier (60 Hz drone), field (chapter-reactive pad), touch (cursor chirp).

export class AudioController {
  private static _instance: AudioController | null = null;

  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private fieldFilter: BiquadFilterNode | null = null;
  private _muted = true;
  private _chapter = 0;
  private lastTouchMs = 0;

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

    // ── Carrier: 60 Hz sine + slow FM mod ────────────────────────────────
    const carrierGain = this.ctx.createGain();
    carrierGain.gain.value = 0.03;
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

    // ── Field: band-pass noise pad, shifts timbre per chapter ─────────────
    const fieldGain = this.ctx.createGain();
    fieldGain.gain.value = 0.08;
    fieldGain.connect(this.masterGain);

    this.fieldFilter = this.ctx.createBiquadFilter();
    this.fieldFilter.type = "bandpass";
    this.fieldFilter.frequency.value = 400;
    this.fieldFilter.Q.value = 8;
    this.fieldFilter.connect(fieldGain);

    // White-noise buffer source (loop)
    const bufLen = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buf;
    noiseNode.loop = true;
    noiseNode.connect(this.fieldFilter);
    noiseNode.start();
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

  /** Call when entering a new scroll chapter (0–4). Shifts field pad timbre. */
  setChapter(n: number) {
    if (n === this._chapter || !this.ctx || !this.fieldFilter) return;
    this._chapter = n;
    // Chapter 4 (Research): narrow to a clean 440 Hz tone — "the resolved signal"
    const freq = n === 4 ? 440 : Math.max(200, 400 - n * 20);
    const q = n === 4 ? 40 : 8;
    this.fieldFilter.frequency.setTargetAtTime(freq, this.ctx.currentTime, 2);
    this.fieldFilter.Q.setTargetAtTime(q, this.ctx.currentTime, 2);
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
