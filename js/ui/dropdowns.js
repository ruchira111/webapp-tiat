/**
 * Musical Instrument Sandbox - Dropdown UI Components
 * 
 * Creates styled dropdowns for input and output selection.
 * Supports nested options (e.g., WebAudioFont instruments, MIDI devices).
 */

/**
 * Create Input Selector Dropdown
 */
function createInputDropdown(options = {}) {
    const {
        selected = 'mouse',
        onChange = () => {}
    } = options;

    const select = document.createElement('select');
    select.className = 'input-dropdown';
    select.id = 'input-selector';

    const inputs = [
        { value: 'mouse', label: '🖱️ Mouse' },
        { value: 'keyboard', label: '⌨️ Keyboard' },
        { value: 'midi', label: '🎹 MIDI Device' },
        { value: 'mediapipe', label: '👋 Hand Tracking' }
    ];

    inputs.forEach(input => {
        const option = document.createElement('option');
        option.value = input.value;
        option.textContent = input.label;
        if (input.value === selected) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        onChange(e.target.value, {});
    });

    return select;
}

/**
 * Create Output Selector Dropdown with nested options
 */
function createOutputDropdown(options = {}) {
    const {
        selected = 'tonejs',
        selectedConfig = {},
        onChange = () => {},
        midiDevices = []
    } = options;

    const select = document.createElement('select');
    select.className = 'output-dropdown';
    select.id = 'output-selector';

    // Tone.js
    const tonejs = document.createElement('option');
    tonejs.value = 'tonejs';
    tonejs.textContent = '🔊 Tone.js (Synth)';
    tonejs.selected = (selected === 'tonejs');
    select.appendChild(tonejs);

    // WebAudioFont group
    const wafGroup = document.createElement('optgroup');
    wafGroup.label = '🎹 WebAudioFont';
    
    const wafInstruments = [
        { value: 'webaudiofont:organ', label: '  Organ' },
        { value: 'webaudiofont:choir', label: '  Choir' },
        { value: 'webaudiofont:vibes', label: '  Vibes' }
    ];

    wafInstruments.forEach(inst => {
        const option = document.createElement('option');
        option.value = inst.value;
        option.textContent = inst.label;
        const [type, instrument] = inst.value.split(':');
        if (selected === 'webaudiofont' && selectedConfig.instrument === instrument) {
            option.selected = true;
        }
        wafGroup.appendChild(option);
    });
    
    select.appendChild(wafGroup);

    // Drums (disabled for now)
    const drums = document.createElement('option');
    drums.value = 'drums';
    drums.textContent = '🥁 Drums (coming soon)';
    drums.disabled = true;
    select.appendChild(drums);

    // MIDI Output group (if devices available)
    if (midiDevices.length > 0) {
        const midiGroup = document.createElement('optgroup');
        midiGroup.label = '📡 MIDI Output';
        
        midiDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = `midiout:${device.id}`;
            option.textContent = `  ${device.name}`;
            if (selected === 'midiout' && selectedConfig.deviceId === device.id) {
                option.selected = true;
            }
            midiGroup.appendChild(option);
        });
        
        select.appendChild(midiGroup);
    }

    select.addEventListener('change', (e) => {
        const value = e.target.value;
        
        if (value.includes(':')) {
            const [type, config] = value.split(':');
            
            if (type === 'webaudiofont') {
                onChange('webaudiofont', { instrument: config });
            } else if (type === 'midiout') {
                onChange('midiout', { deviceId: config });
            }
        } else {
            onChange(value, {});
        }
    });

    return select;
}

/**
 * Update output dropdown with MIDI devices
 */
async function updateOutputDropdownWithMidiDevices(selectElement, outputManager) {
    try {
        const devices = await outputManager.getMidiOutputDevices();
        
        if (devices.length === 0) return;

        // Remove existing MIDI group if present
        const existingGroup = selectElement.querySelector('optgroup[label="📡 MIDI Output"]');
        if (existingGroup) {
            existingGroup.remove();
        }

        // Add new MIDI group
        const midiGroup = document.createElement('optgroup');
        midiGroup.label = '📡 MIDI Output';
        
        devices.forEach(device => {
            const option = document.createElement('option');
            option.value = `midiout:${device.id}`;
            option.textContent = `  ${device.name}`;
            midiGroup.appendChild(option);
        });
        
        selectElement.appendChild(midiGroup);

    } catch (error) {
        console.log('No MIDI output devices available');
    }
}

// Make available globally
window.createInputDropdown = createInputDropdown;
window.createOutputDropdown = createOutputDropdown;
window.updateOutputDropdownWithMidiDevices = updateOutputDropdownWithMidiDevices;

