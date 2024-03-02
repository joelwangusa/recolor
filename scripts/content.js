// Function to apply styles to links based on click events
function applyLinkStyles(settings) {
    document.querySelectorAll('a').forEach(link => {
        // Remove previously added event listeners to avoid duplicates
        link.removeEventListener('click', linkClickHandler);

        // Apply initial style based on settings
        link.style.color = settings.unvisitedColor || '#007bff'; // Default unvisited color

        // Add click event listener to change color upon click
        link.addEventListener('click', linkClickHandler.bind(null, settings.visitedColor || '#551A8B')); // Default visited color
    });

    // Check the history
    chrome.storage.local.get(['clickedLinks'], (result) => {
        const clickedLinks = result.clickedLinks || {};
        document.querySelectorAll('a').forEach((link) => {
            if (clickedLinks[link.href]) {
                link.style.color = '#FF5733'; // Example: Change color to a distinct orange
            }
        });
    });
}

// Handler for link click events, changes color
function linkClickHandler(visitedColor, event) {
    // Change the color after link click
    event.target.style.color = visitedColor;

    // Update local storage with every click
    updateLocalStorageWithClick(url);

    // Check if syncing is enabled, then update sync storage
    chrome.storage.sync.get('syncEnabled', function(data) {
        if (data.syncEnabled) {
            updateSyncStorageWithClick(url);
        }
    });
}

function updateLocalStorageWithClick(url) {
    chrome.storage.local.get({clickedLinks: {}}, (result) => {
        const {clickedLinks} = result;
        clickedLinks[url] = Date.now(); // Update or add the link with the current timestamp
        chrome.storage.local.set({clickedLinks}); // Save the updated list back to local storage
    });
}

function updateSyncStorageWithClick(url) {
    chrome.storage.sync.get({clickedLinks: {}}, (result) => {
        let {clickedLinks} = result;
        clickedLinks[url] = Date.now(); // Update or add the link with the current timestamp

        // Convert object to an array, sort by timestamp, and keep the most recent 500 links
        const sortedEntries = Object.entries(clickedLinks)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 500);

        // Convert the array back to an object
        const prunedLinks = Object.fromEntries(sortedEntries);
        chrome.storage.sync.set({clickedLinks: prunedLinks});
    });
}


// Observe the DOM for changes and reapply styles
function observeDOM(settings) {
    const observer = new MutationObserver(() => {
        applyLinkStyles(settings);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initial setup: Get settings and apply styles
chrome.storage.sync.get(['visitedColor', 'unvisitedColor', 'isEnabled'], (settings) => {
    if (settings.isEnabled) {
        applyLinkStyles(settings);
        observeDOM(settings);
    }
});

