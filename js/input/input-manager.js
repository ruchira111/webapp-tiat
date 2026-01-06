/**
 * Musical Instrument Sandbox - Input Manager
 * 
 * Universal input router that allows ANY input type to work with ANY example.
 * 
 * All inputs emit standardized events:
 * - 'note-on'  → { note, velocity, x, y, key }
 * - 'note-off' → { note, key }
 * - 'continuous' → { x, y, pressure }
 * - 'trigger' → { index, velocity, x, y }
 * 
 * USAGE:
 *   const inputManager = new InputManager();
 *   await inputManager.enableInput('mouse');
 *   inputManager.addEventListener('note-on', (e) => {
 *       playNote(e.detail.note);
 *   });
 */

class InputManager extends EventTarget {
    constructor() {
        super();
        this.activeInputs = new Set();
        this.inputModules = {
            mouse: null,
            keyboard: null,
            midi: null,
            mediapipe: null
        };
    }

    /**
     * Enable an input type
     * 
     * @param {string} type - 'mouse', 'keyboard', 'midi', or 'mediapipe'
     * @param {object} config - Input-specific configuration
     * @returns {Promise<boolean>} Success status
     */
    async enableInput(type, config = {}) {
        console.log(`🎮 Enabling ${type} input...`);

        try {
            switch (type) {
                case 'mouse':
                    this.inputModules.mouse = new MouseInput(this, config);
                    break;

                case 'keyboard':
                    this.inputModules.keyboard = new KeyboardInput(this, config);
                    break;

                case 'midi':
                    this.inputModules.midi = await MidiInput.create(this, config);
                    break;

                case 'mediapipe':
                    this.inputModules.mediapipe = await MediaPipeInput.create(this, config);
                    break;

                default:
                    throw new Error(`Unknown input type: ${type}`);
            }

            this.activeInputs.add(type);
            console.log(`✅ ${type} input enabled`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to enable ${type} input:`, error);
            throw error;
        }
    }

    /**
     * Disable an input type
     */
    disableInput(type) {
        if (this.inputModules[type]) {
            if (this.inputModules[type].cleanup) {
                this.inputModules[type].cleanup();
            }
            this.inputModules[type] = null;
            this.activeInputs.delete(type);
            console.log(`🔇 ${type} input disabled`);
        }
    }

    /**
     * Disable all inputs
     */
    disableAll() {
        for (const type of this.activeInputs) {
            this.disableInput(type);
        }
    }

    /**
     * Emit a standardized musical event
     * 
     * @param {string} eventType - Event type ('note-on', 'note-off', 'continuous', 'trigger')
     * @param {object} data - Event data
     */
    emitMusicalEvent(eventType, data) {
        this.dispatchEvent(new CustomEvent(eventType, { detail: data }));
    }

    /**
     * Check if an input is active
     */
    isActive(type) {
        return this.activeInputs.has(type);
    }

    /**
     * Get list of active inputs
     */
    getActiveInputs() {
        return Array.from(this.activeInputs);
    }
}

// Make available globally
window.InputManager = InputManager;

