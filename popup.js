document.addEventListener('DOMContentLoaded', () => {
    // Load and set the previously savced colors and privacy settings
    chrome.storage.local.get(['visitedColor', 'unvisitedColor', 'isEnabled', 'colorScheme', 'visitedColorCustom', 'unvisitedColorCustom'], (settings) => {
        const colorPairs = {
            protanopia: { visited: '#0000FF', unvisited: '#FFFF00' }, // Blue and Yellow
            tritanopia: { visited: '#FF00FF', unvisited: '#00FF00' }, // Magenta and Green
            monochromacy: { visited: '#555555', unvisited: '#AAAAAA' } // Different shades of gray
        }; 
        // Update the user custom color
        if (settings.visitedColor) {
            document.getElementById('visitedColorCustom').value = settings.visitedColorCustom;
        }
        if (settings.unvisitedColor) {
            document.getElementById('unvisitedColorCustom').value = settings.unvisitedColorCustom;
        }

        // Update Preview color
        if (settings.colorScheme !== 'custom' && colorPairs.hasOwnProperty(settings.colorScheme)) {
            document.getElementById('visitedPreview').style.backgroundColor = colorPairs[settings.colorScheme].visited;
            document.getElementById('unvisitedPreview').style.backgroundColor = colorPairs[settings.colorScheme].unvisited;            
        }
        colorSchemeUIChanges(settings.colorScheme);
        document.getElementById('toggleExtension').checked = settings.isEnabled ?? true; // Default to true if undefined
        document.getElementById('colorScheme').value = settings.colorScheme ?? "custom"; // Default to custom
    });
});


document.getElementById('visitedColorCustom').addEventListener('change', (event) => {
    // Immediate feedback or action upon color change. For example:
    console.log(`Visited color changed to: ${event.target.value}`);
    // You could also apply this color to a preview element here.
    save_settings();
});

document.getElementById('unvisitedColorCustom').addEventListener('change', (event) => {
    console.log(`Unvisited color changed to: ${event.target.value}`);
    // Similar immediate action for the unvisited color.
    save_settings();
});


// Add listeners to show/hide color pickers based on scheme selection
document.getElementById('colorScheme').addEventListener('change', (event) => {
    const colorScheme = event.target.value;
    const colorPairs = {
        protanopia: { visited: '#0000FF', unvisited: '#FFFF00' }, // Blue and Yellow
        tritanopia: { visited: '#FF00FF', unvisited: '#00FF00' }, // Magenta and Green
        monochromacy: { visited: '#555555', unvisited: '#AAAAAA' } // Different shades of gray
    };

    if (colorScheme !== 'custom') {
        // Update the display of color pairs
        //document.getElementById('visitedColor').value = colorPairs[colorScheme].visited;
        //document.getElementById('unvisitedColor').value = colorPairs[colorScheme].unvisited;
        // Optionally, update visual elements to preview colors
        document.getElementById('visitedPreview').style.backgroundColor = colorPairs[colorScheme].visited;
        document.getElementById('unvisitedPreview').style.backgroundColor = colorPairs[colorScheme].unvisited;
    }

    colorSchemeUIChanges(colorScheme);
    save_settings();
});

function colorSchemeUIChanges(colorScheme){
    // Show/hide logic for color pickers as previously described
    const colorPickers = document.querySelectorAll('.colorCustom');
    const colorDefault = document.querySelectorAll('.colorPreview');

    if (colorScheme === 'custom') {
        colorPickers.forEach(picker => picker.style.display = 'block');
        colorDefault.forEach(preview => preview.style.display = 'none');
    } else {
        colorPickers.forEach(picker => picker.style.display = 'none');
        colorDefault.forEach(preview => preview.style.display = 'block');
    }
}

document.getElementById('toggleExtension').addEventListener('change', (event) => {
    save_settings();
});

function save_settings() {
    console.log("saving settings...");
    const isEnabled = document.getElementById('toggleExtension').checked;
    const colorScheme = document.getElementById('colorScheme').value;
    const visitedColorCustom = document.getElementById('visitedColorCustom').value;
    const unvisitedColorCustom = document.getElementById('unvisitedColorCustom').value;
    let visitedColor, unvisitedColor;

    if (colorScheme === 'custom') {
        visitedColor = visitedColorCustom;
        unvisitedColor = unvisitedColorCustom;
    } else {
        // Define default color pairs for each scheme
        const colorPairs = {
            protanopia: { visited: '#0000FF', unvisited: '#FFFF00' }, // Example colors
            tritanopia: { visited: '#FF00FF', unvisited: '#00FF00' },
            monochromacy: { visited: '#555555', unvisited: '#AAAAAA' }
        };

        visitedColor = colorPairs[colorScheme].visited;
        unvisitedColor = colorPairs[colorScheme].unvisited;
    }

    chrome.storage.local.set({visitedColor, unvisitedColor, colorScheme, isEnabled, visitedColorCustom, unvisitedColorCustom}, () => {
        console.log('Settings saved');
        applySettings();
    });
}
/*
function applySettings() {
    chrome.storage.local.get(['visitedColor', 'unvisitedColor', 'isEnabled', 'clickedLinks'], (data) => {
        if (data.isEnabled) {
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                tabs.forEach(tab => {
                    const msgObj = {type:"applySettingsAll", data:data}
                    chrome.tabs.sendMessage(tab.id, msgObj, function(response) {
                        console.log("apply settings changes to active tab!");
                    });
                });
            });
        }
    });
}
*/
function applySettings() {
    chrome.storage.local.get(['visitedColor', 'unvisitedColor', 'isEnabled', 'clickedLinks'], (data) => {
        if (data.isEnabled) {
            const msgObj = {type:"applySettingsAll", data:data}
            chrome.runtime.sendMessage(msgObj, function(response) {
                console.log("apply settings changes to background.js from popup.js!");
            });
        }
    });
}