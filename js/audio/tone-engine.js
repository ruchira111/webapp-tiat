/**
 * Musical Instrument Sandbox - Tone.js Audio Engine
 * 
 * Simplified wrapper around Tone.js for easy sound generation.
 * Uses Tone.js CDN samples for drums.
 */

class ToneEngine {
    constructor() {
        this.started = false;
        this.synth = null;
        this.drumSampler = null;
        this.currentSynth = null;
    }

    /**
     * Initialize Tone.js
     * MUST be called after a user interaction (click, key press, etc.)
     * 
     * @returns {Promise<void>}
     */
    async init() {
        if (this.started) {
            console.log('Tone.js already started');
            return;
        }

        try {
            await Tone.start();
            console.log('🎵 Tone.js audio context started');
            this.started = true;

            // Create default synth (polyphonic - can play multiple notes)
            this.synth = new Tone.PolySynth(Tone.Synth, {
                oscillator: {
                    type: 'sine'
                },
                envelope: {
                    attack: 0.005,
                    decay: 0.1,
                    sustain: 0.3,
                    release: 0.5
                }
            }).toDestination();

            this.currentSynth = this.synth;

            // Load drum samples from Tone.js CDN
            this.drumSampler = new Tone.Sampler({
                urls: {
                    C1: "kick.wav",
                    D1: "snare.wav",
                    E1: "hihat.wav",
                    F1: "clap.wav",
                    G1: "tom1.wav",
                    A1: "tom2.wav",
                    B1: "tom3.wav",
                },
                baseUrl: "https://tonejs.github.io/audio/drum-samples/CR78/",
            }).toDestination();

            console.log('✅ ToneEngine ready!');
        } catch (error) {
            console.error('Failed to initialize Tone.js:', error);
            throw error;
        }
    }

    /**
     * Play a note
     * 
     * @param {number|string} note - MIDI number (60) or note name ("C4")
     * @param {number} duration - Note length in seconds (default: 0.5)
     * @param {number} velocity - Volume 0-1 (default: 0.7)
     */
    playNote(note, duration = 0.5, velocity = 0.7) {
        if (!this.started) {
            console.error('⚠️ ToneEngine not started! Call init() first.');
            return;
        }

        // Convert MIDI number to note name if needed
        const noteName = typeof note === 'number'
            ? Tone.Frequency(note, 'midi').toNote()
            : note;

        this.currentSynth.triggerAttackRelease(noteName, duration, undefined, velocity);
    }

    /**
     * Start playing a note (sustain until releaseNote is called)
     * 
     * @param {number|string} note - MIDI number or note name
     * @param {number} velocity - Volume 0-1
     */
    triggerNote(note, velocity = 0.7) {
        if (!this.started) {
            console.error('⚠️ ToneEngine not started! Call init() first.');
            return;
        }

        const noteName = typeof note === 'number'
            ? Tone.Frequency(note, 'midi').toNote()
            : note;

        this.currentSynth.triggerAttack(noteName, undefined, velocity);
    }

    /**
     * Release a sustained note
     * 
     * @param {number|string} note - MIDI number or note name
     */
    releaseNote(note) {
        if (!this.started) return;

        const noteName = typeof note === 'number'
            ? Tone.Frequency(note, 'midi').toNote()
            : note;

        this.currentSynth.triggerRelease(noteName);
    }

    /**
     * Play a drum sample
     * 
     * @param {number} drumIndex - Drum index 0-6 (kick, snare, hihat, clap, tom1, tom2, tom3)
     * @param {number} velocity - Volume 0-1
     */
    playDrum(drumIndex, velocity = 0.7) {
        if (!this.started || !this.drumSampler) {
            console.error('⚠️ Drums not loaded!');
            return;
        }

        const drums = ['C1', 'D1', 'E1', 'F1', 'G1', 'A1', 'B1'];
        if (drumIndex >= 0 && drumIndex < drums.length) {
            this.drumSampler.triggerAttackRelease(drums[drumIndex], '8n', undefined, velocity);
        }
    }

    /**
     * Change the synth type
     * 
     * @param {string} type - 'sine', 'square', 'sawtooth', 'triangle'
     */
    setSynthType(type) {
        if (this.synth) {
            this.synth.set({
                oscillator: { type: type }
            });
        }
    }

    /**
     * Create a theremin-style continuous synth
     * Returns an object with start/stop/setFrequency/setVolume methods
     * 
     * @returns {object} Theremin controller
     */
    createTheremin() {
        const theremin = new Tone.Synth({
            oscillator: {
                type: 'sine'
            },
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 1,
                release: 0.5
            }
        }).toDestination();

        return {
            start: (freq = 440) => {
                theremin.triggerAttack(freq);
            },
            setFrequency: (freq) => {
                theremin.frequency.rampTo(freq, 0.05);
            },
            setVolume: (vol) => {
                theremin.volume.rampTo(Tone.gainToDb(vol), 0.05);
            },
            stop: () => {
                theremin.triggerRelease();
            }
        };
    }

    /**
     * Stop all sounds immediately
     */
    stopAll() {
        if (this.synth) {
            this.synth.releaseAll();
        }
    }

    /**
     * Get BPM (beats per minute) - useful for sequencers
     */
    getBPM() {
        return Tone.Transport.bpm.value;
    }

    /**
     * Set BPM
     */
    setBPM(bpm) {
        Tone.Transport.bpm.value = bpm;
    }
}

// Make available globally
window.ToneEngine = ToneEngine;

