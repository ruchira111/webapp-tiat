/**
 * Musical Instrument Sandbox - Visual Feedback Manager
 * 
 * Creates visual feedback for musical events.
 * Works with CSS animations defined in visual-feedback.css
 */

class VisualManager {
    constructor(container) {
        this.container = container || document.body;
    }

    /**
     * Create a ripple effect at a specific position
     * 
     * @param {number} x - X coordinate in pixels
     * @param {number} y - Y coordinate in pixels
     * @param {string} color - CSS color (default: white)
     */
    createRipple(x, y, color = 'rgba(255, 255, 255, 0.6)') {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = (x - 25) + 'px';
        ripple.style.top = (y - 25) + 'px';
        ripple.style.background = color;

        this.container.appendChild(ripple);

        // Remove after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }

    /**
     * Flash the entire screen
     * 
     * @param {string} color - Flash color (default: white)
     * @param {number} duration - Flash duration in ms (default: 200)
     */
    flashScreen(color = 'rgba(255, 255, 255, 0.3)', duration = 200) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: ${color};
            pointer-events: none;
            z-index: 9999;
            animation: flash-animation ${duration}ms ease-out;
        `;

        this.container.appendChild(flash);

        setTimeout(() => {
            if (flash.parentNode) {
                flash.remove();
            }
        }, duration);
    }

    /**
     * Pulse an element (scale up and down)
     * 
     * @param {HTMLElement} element - Element to pulse
     */
    pulseElement(element) {
        element.classList.add('visual-pulse');
        setTimeout(() => {
            element.classList.remove('visual-pulse');
        }, 500);
    }

    /**
     * Make an element glow
     * 
     * @param {HTMLElement} element - Element to glow
     * @param {string} color - Glow color
     * @param {number} duration - Glow duration in ms
     */
    glowElement(element, color = '#00ff00', duration = 500) {
        element.style.setProperty('--glow-color', color);
        element.classList.add('glow');

        setTimeout(() => {
            element.classList.remove('glow');
        }, duration);
    }

    /**
     * Set element color based on frequency (creates rainbow effect)
     * 
     * @param {HTMLElement} element - Element to colorize
     * @param {number} frequency - Frequency in Hz (200-2000 works well)
     * @param {number} saturation - Color saturation 0-100 (default: 70)
     * @param {number} lightness - Color lightness 0-100 (default: 50)
     */
    setFrequencyColor(element, frequency, saturation = 70, lightness = 50) {
        const hue = map(frequency, 200, 2000, 0, 300) % 360;
        element.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    /**
     * Set element color based on MIDI note (creates rainbow effect)
     * 
     * @param {HTMLElement} element - Element to colorize
     * @param {number} midiNote - MIDI note number (0-127)
     * @param {number} saturation - Color saturation 0-100 (default: 70)
     * @param {number} lightness - Color lightness 0-100 (default: 50)
     */
    setNoteColor(element, midiNote, saturation = 70, lightness = 50) {
        const hue = map(midiNote, 36, 96, 0, 300) % 360;
        element.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    /**
     * Create a particle at a position (simple circle that floats up)
     * 
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} color - Particle color
     */
    createParticle(x, y, color = '#fff') {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            animation: float-up 1s ease-out forwards;
        `;

        this.container.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 1000);
    }

    /**
     * Shake an element
     * 
     * @param {HTMLElement} element - Element to shake
     */
    shakeElement(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }

    /**
     * Clear all visual effects
     */
    clearAll() {
        const effects = this.container.querySelectorAll('.ripple, .particle');
        effects.forEach(el => el.remove());
    }
}

// Make available globally
window.VisualManager = VisualManager;

