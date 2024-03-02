document.addEventListener('DOMContentLoaded', () => {
    // Load and set the previously savced colors and privacy settings
    chrome.storage.local.get(['visitedColor', 'unvisitedColor', 'isEnabled'], (settings) => {
        if (settings.visitedColor) {
            document.getElementById('visitedColor').value = settings.visitedColor;
        }
        if (settings.unvisitedColor) {
            document.getElementById('unvisitedColor').value = settings.unvisitedColor;
        }
        /**
        if (settings.syncEnabled) {
            document.getElementById('syncToggle').checked = settings.syncEnabled || false;
        }
        */
        document.getElementById('toggleExtension').checked = settings.isEnabled ?? true; // Default to true if undefined

    });

    // Save settings when the Save button is clicked
    document.getElementById('save').addEventListener('click', () => {
        const visitedColor = document.getElementById('visitedColor').value;
        const unvisitedColor = document.getElementById('unvisitedColor').value;
        const isEnabled = document.getElementById('toggleExtension').checked;
        // const syncEnabled = document.getElementById('syncToggle').checked;

        chrome.storage.local.set({visitedColor, unvisitedColor, isEnabled}, () => {
            console.log('Settings saved');
            // Optionally, provide feedback to the user that settings have been saved.
        });
    });
});


document.getElementById('visitedColor').addEventListener('change', (event) => {
    // Immediate feedback or action upon color change. For example:
    console.log(`Visited color changed to: ${event.target.value}`);
    // You could also apply this color to a preview element here.
});

document.getElementById('unvisitedColor').addEventListener('change', (event) => {
    console.log(`Unvisited color changed to: ${event.target.value}`);
    // Similar immediate action for the unvisited color.
});

