/**
 * Musical Instrument Sandbox - Example Layout Helper
 * 
 * Provides common layout structure for all examples.
 * Call createExampleLayout() to setup the wrapper with minimal code.
 */

/**
 * Create the standard example layout
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.title - Example title (e.g., "Example 1: Hello World / Simple Beeps")
 * @param {string} config.backLink - URL to go back to (default: "../../index.html")
 * @param {Array<Object>} config.inputButtons - Array of input button configs
 *   Example: [{ id: 'mouse', label: 'Mouse', active: true }, { id: 'keyboard', label: 'Keyboard' }]
 * @param {boolean} config.showKeyboardHelper - Whether to show keyboard helper (default: false)
 * @param {string} config.instructions - Initial instruction text
 * 
 * @returns {Object} - Object with references to key elements
 */
function createExampleLayout(config = {}) {
    const {
        title = 'Example',
        backLink = '../../index.html',
        inputButtons = [
            { id: 'mouse', label: 'Mouse', active: true },
            { id: 'keyboard', label: 'Keyboard' },
            { id: 'midi', label: 'MIDI' },
            { id: 'mediapipe', label: 'Hand Tracking' }
        ],
        showKeyboardHelper = false,
        instructions = 'Click to start'
    } = config;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper';

    // Start screen
    const startWrapper = document.createElement('div');
    startWrapper.id = 'start-wrapper';
    startWrapper.innerHTML = `
        <button id="start-button">Start</button>
        <div id="start-text">
            <p>Click to begin</p>
            <p>Choose your input method and make some music</p>
        </div>
    `;

    // Top bar
    const topBar = document.createElement('div');
    topBar.className = 'top-bar';

    // Back button
    const backButton = document.createElement('a');
    backButton.href = backLink;
    backButton.className = 'back-button';
    backButton.textContent = '← Back';

    // Title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'example-title';
    titleDiv.textContent = title;

    // Input selector
    const inputSelector = document.createElement('div');
    inputSelector.className = 'input-selector';
    inputButtons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'input-button' + (btn.active ? ' active' : '');
        button.dataset.input = btn.id;
        button.textContent = btn.label;
        inputSelector.appendChild(button);
    });

    topBar.appendChild(backButton);
    topBar.appendChild(titleDiv);
    topBar.appendChild(inputSelector);

    // Note display (bottom left)
    const output = document.createElement('div');
    output.id = 'output';
    output.innerHTML = `
        <div class="note-info">
            <div class="note-box" id="noteBox">
                <div class="note-name" id="noteName">-</div>
                <div class="note-freq" id="noteFreq">Ready</div>
            </div>
        </div>
    `;

    // Instructions (bottom center)
    const instructionsDiv = document.createElement('div');
    instructionsDiv.id = 'instructions';
    instructionsDiv.innerHTML = `<span id="instructionText">${instructions}</span>`;

    // Keyboard helper (optional)
    const keyboardHelper = document.createElement('div');
    keyboardHelper.className = 'keyboard-helper' + (showKeyboardHelper ? ' show' : '');
    keyboardHelper.id = 'keyboardHelper';
    keyboardHelper.innerHTML = `
        <p>Keyboard Layout:</p>
        <div class="key-row">
            <div class="key">2</div>
            <div class="key">3</div>
            <div class="key" style="opacity: 0.3">-</div>
            <div class="key">5</div>
            <div class="key">6</div>
            <div class="key">7</div>
        </div>
        <div class="key-row">
            <div class="key">Q</div>
            <div class="key">W</div>
            <div class="key">E</div>
            <div class="key">R</div>
            <div class="key">T</div>
            <div class="key">Y</div>
            <div class="key">U</div>
            <div class="key">I</div>
        </div>
        <div style="height: 5px"></div>
        <div class="key-row">
            <div class="key">S</div>
            <div class="key">D</div>
            <div class="key" style="opacity: 0.3">-</div>
            <div class="key">G</div>
            <div class="key">H</div>
            <div class="key">J</div>
        </div>
        <div class="key-row">
            <div class="key">Z</div>
            <div class="key">X</div>
            <div class="key">C</div>
            <div class="key">V</div>
            <div class="key">B</div>
            <div class="key">N</div>
            <div class="key">M</div>
            <div class="key">,</div>
        </div>
    `;

    // Assemble
    wrapper.appendChild(startWrapper);
    wrapper.appendChild(topBar);
    wrapper.appendChild(output);
    wrapper.appendChild(instructionsDiv);
    wrapper.appendChild(keyboardHelper);

    // Insert into body
    document.body.appendChild(wrapper);

    // Return references to key elements
    return {
        wrapper,
        startWrapper,
        startButton: document.getElementById('start-button'),
        inputButtons: document.querySelectorAll('.input-button'),
        noteBox: document.getElementById('noteBox'),
        noteName: document.getElementById('noteName'),
        noteFreq: document.getElementById('noteFreq'),
        instructionText: document.getElementById('instructionText'),
        keyboardHelper: document.getElementById('keyboardHelper')
    };
}

/**
 * Hide the start screen
 */
function hideStartScreen() {
    const startWrapper = document.getElementById('start-wrapper');
    if (startWrapper) {
        startWrapper.classList.add('hidden');
    }
}

/**
 * Update instruction text
 */
function updateInstructions(text) {
    const instructionText = document.getElementById('instructionText');
    if (instructionText) {
        instructionText.textContent = text;
    }
}

/**
 * Show/hide keyboard helper
 */
function toggleKeyboardHelper(show) {
    const helper = document.getElementById('keyboardHelper');
    if (helper) {
        if (show) {
            helper.classList.add('show');
        } else {
            helper.classList.remove('show');
        }
    }
}

// Make functions available globally
window.createExampleLayout = createExampleLayout;
window.hideStartScreen = hideStartScreen;
window.updateInstructions = updateInstructions;
window.toggleKeyboardHelper = toggleKeyboardHelper;

