document.addEventListener('DOMContentLoaded', () => {
    // Load and set the previously savced colors and privacy settings
    chrome.storage.local.get(['visitedColor', 'unvisitedColor', 'isEnabled'], (settings) => {
        if (settings.visitedColor) {
            document.getElementById('visitedColor').value = settings.visitedColor;
        }
        if (settings.unvisitedColor) {
            document.getElementById('unvisitedColor').value = settings.unvisitedColor;
        }
        document.getElementById('toggleExtension').checked = settings.isEnabled ?? true; // Default to true if undefined
    });
});


document.getElementById('visitedColor').addEventListener('change', (event) => {
    // Immediate feedback or action upon color change. For example:
    console.log(`Visited color changed to: ${event.target.value}`);
    // You could also apply this color to a preview element here.
    save_settings();
});

document.getElementById('unvisitedColor').addEventListener('change', (event) => {
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
        document.getElementById('visitedColor').value = colorPairs[colorScheme].visited;
        document.getElementById('unvisitedColor').value = colorPairs[colorScheme].unvisited;
        // Optionally, update visual elements to preview colors
        document.getElementById('visitedPreview').style.backgroundColor = colorPairs[colorScheme].visited;
        document.getElementById('unvisitedPreview').style.backgroundColor = colorPairs[colorScheme].unvisited;
    }

    // Show/hide logic for color pickers as previously described
    const colorPickers = document.querySelectorAll('.colorCustom');
    const colorDefault = document.querySelectorAll('.colorPreview');

    if (event.target.value === 'custom') {
        colorPickers.forEach(picker => picker.style.display = 'block');
        colorDefault.forEach(preview => preview.style.display = 'none');
    } else {
        colorPickers.forEach(picker => picker.style.display = 'none');
        colorDefault.forEach(preview => preview.style.display = 'block');
    }
    save_settings();
});
document.getElementById('toggleExtension').addEventListener('change', (event) => {
    save_settings();
});

function save_settings() {
    console.log("saving settings...");
    const isEnabled = document.getElementById('toggleExtension').checked;
    const colorScheme = document.getElementById('colorScheme').value;
    let visitedColor, unvisitedColor;

    if (colorScheme === 'custom') {
        visitedColor = document.getElementById('visitedColor').value;
        unvisitedColor = document.getElementById('unvisitedColor').value;
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

    // Save selected scheme or custom colors
    chrome.storage.sync.set({visitedColor, unvisitedColor, colorScheme}, () => {
        console.log('Settings saved');
        // Provide user feedback here if desired
    });


    chrome.storage.local.set({visitedColor, unvisitedColor, isEnabled}, () => {
        console.log('Settings saved');
        // Optionally, provide feedback to the user that settings have been saved.
    });
}