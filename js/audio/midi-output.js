/**
 * Musical Instrument Sandbox - MIDI Output
 * 
 * Sends MIDI messages to external hardware or software.
 */

class MidiOutput {
    constructor() {
        this.midiAccess = null;
        this.outputDevice = null;
        this.activeNotes = new Set();
    }

    /**
     * Initialize MIDI output
     */
    async init() {
        if (!navigator.requestMIDIAccess) {
            throw new Error('Web MIDI API not supported in this browser');
        }

        try {
            this.midiAccess = await navigator.requestMIDIAccess();
            
            // Get first available output
            const outputs = Array.from(this.midiAccess.outputs.values());
            
            if (outputs.length === 0) {
                throw new Error('No MIDI output devices found');
            }

            this.outputDevice = outputs[0];
            console.log(`🎹 MIDI Output: ${this.outputDevice.name}`);

        } catch (error) {
            console.error('Failed to initialize MIDI output:', error);
            throw error;
        }
    }

    /**
     * Select a specific MIDI output device
     */
    async selectDevice(deviceId) {
        if (!this.midiAccess) {
            await this.init();
        }

        const device = this.midiAccess.outputs.get(deviceId);
        
        if (!device) {
            throw new Error(`MIDI device not found: ${deviceId}`);
        }

        this.outputDevice = device;
        console.log(`🎹 MIDI Output: ${this.outputDevice.name}`);
    }

    /**
     * Get list of available devices
     */
    async getDevices() {
        if (!this.midiAccess) {
            await this.init();
        }

        const devices = [];
        for (const output of this.midiAccess.outputs.values()) {
            devices.push({
                id: output.id,
                name: output.name,
                manufacturer: output.manufacturer
            });
        }
        return devices;
    }

    /**
     * Play a note (with automatic note-off)
     */
    playNote(note, duration, velocity) {
        if (!this.outputDevice) {
            console.error('No MIDI output device selected');
            return;
        }

        const velocityValue = Math.floor(velocity * 127);

        // Note On (0x90 = note on, channel 1)
        this.outputDevice.send([0x90, note, velocityValue]);

        // Note Off after duration
        setTimeout(() => {
            this.outputDevice.send([0x80, note, 0]);
        }, duration * 1000);
    }

    /**
     * Trigger note (sustain until released)
     */
    triggerNote(note, velocity) {
        if (!this.outputDevice) {
            console.error('No MIDI output device selected');
            return;
        }

        const velocityValue = Math.floor(velocity * 127);
        
        // Note On
        this.outputDevice.send([0x90, note, velocityValue]);
        this.activeNotes.add(note);
    }

    /**
     * Release note
     */
    releaseNote(note) {
        if (!this.outputDevice) return;

        // Note Off
        this.outputDevice.send([0x80, note, 0]);
        this.activeNotes.delete(note);
    }

    /**
     * Stop all active notes
     */
    stopAll() {
        if (!this.outputDevice) return;

        // Send note off for all active notes
        this.activeNotes.forEach(note => {
            this.outputDevice.send([0x80, note, 0]);
        });
        
        this.activeNotes.clear();

        // Also send All Notes Off (CC 123)
        this.outputDevice.send([0xB0, 123, 0]);
    }
}

// Make available globally
window.MidiOutput = MidiOutput;

