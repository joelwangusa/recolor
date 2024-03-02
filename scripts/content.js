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
}

// Handler for link click events, changes color
function linkClickHandler(visitedColor, event) {
    event.target.style.color = visitedColor;
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

