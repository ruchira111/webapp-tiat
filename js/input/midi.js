/**
 * Musical Instrument Sandbox - MIDI Input
 * 
 * Handles MIDI device input using Web MIDI API.
 * 
 * Automatically detects and connects to MIDI devices.
 */

class MidiInput {
    constructor(manager, config = {}) {
        this.manager = manager;
        this.midiAccess = null;
        this.connectedInputs = new Map();
        this.config = config;
    }

    /**
     * Static factory method to create and initialize MIDI input
     */
    static async create(manager, config = {}) {
        const midiInput = new MidiInput(manager, config);
        await midiInput.init();
        return midiInput;
    }

    /**
     * Initialize Web MIDI API
     */
    async init() {
        if (!navigator.requestMIDIAccess) {
            throw new Error('Web MIDI API not supported in this browser');
        }

        try {
            this.midiAccess = await navigator.requestMIDIAccess();
            console.log('🎹 MIDI Access granted');

            // Connect to existing inputs
            this.connectToInputs();

            // Listen for device changes
            this.midiAccess.onstatechange = (e) => {
                this.handleStateChange(e);
            };

            const inputCount = this.midiAccess.inputs.size;
            if (inputCount === 0) {
                console.warn('⚠️ No MIDI devices detected. Please connect a MIDI controller.');
                throw new Error('No MIDI devices detected');
            } else {
                console.log(`✅ Connected to ${inputCount} MIDI device(s)`);
            }

        } catch (error) {
            console.error('❌ Failed to access MIDI devices:', error);
            throw error;
        }
    }

    /**
     * Connect to all available MIDI inputs
     */
    connectToInputs() {
        for (const input of this.midiAccess.inputs.values()) {
            this.connectInput(input);
        }
    }

    /**
     * Connect to a specific MIDI input
     */
    connectInput(input) {
        console.log(`🎹 Connecting to: ${input.name}`);
        
        input.onmidimessage = (message) => {
            this.handleMidiMessage(message);
        };

        this.connectedInputs.set(input.id, input);
    }

    /**
     * Handle MIDI state changes (device connected/disconnected)
     */
    handleStateChange(e) {
        const port = e.port;
        
        if (port.type === 'input') {
            if (port.state === 'connected') {
                console.log(`🎹 MIDI device connected: ${port.name}`);
                this.connectInput(port);
            } else if (port.state === 'disconnected') {
                console.log(`🔌 MIDI device disconnected: ${port.name}`);
                this.connectedInputs.delete(port.id);
            }
        }
    }

    /**
     * Handle incoming MIDI messages
     */
    handleMidiMessage(message) {
        const [status, note, velocity] = message.data;
        
        // Status byte breakdown:
        // 0x90-0x9F = Note On
        // 0x80-0x8F = Note Off
        const command = status & 0xf0;
        const channel = status & 0x0f;

        if (command === 0x90) {
            // Note On
            if (velocity > 0) {
                this.manager.emitMusicalEvent('note-on', {
                    note: note,
                    velocity: velocity / 127,
                    channel: channel
                });
            } else {
                // Velocity 0 = Note Off
                this.manager.emitMusicalEvent('note-off', {
                    note: note,
                    channel: channel
                });
            }
        } else if (command === 0x80) {
            // Note Off
            this.manager.emitMusicalEvent('note-off', {
                note: note,
                channel: channel
            });
        } else if (command === 0xb0) {
            // Control Change (could be useful for knobs/sliders)
            const controlNumber = note;
            const controlValue = velocity;
            
            this.manager.emitMusicalEvent('control-change', {
                control: controlNumber,
                value: controlValue / 127,
                channel: channel
            });
        }
    }

    /**
     * Get list of connected MIDI devices
     */
    getConnectedDevices() {
        const devices = [];
        for (const input of this.connectedInputs.values()) {
            devices.push({
                id: input.id,
                name: input.name,
                manufacturer: input.manufacturer,
                state: input.state
            });
        }
        return devices;
    }

    /**
     * Cleanup
     */
    cleanup() {
        if (this.midiAccess) {
            for (const input of this.connectedInputs.values()) {
                input.onmidimessage = null;
            }
            this.connectedInputs.clear();
        }
    }
}

// Make available globally
window.MidiInput = MidiInput;

