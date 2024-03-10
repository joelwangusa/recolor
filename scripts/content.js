// Function to apply styles to links based on click events
function applyLinkStyles(data) {
    const clickedLinks = data.clickedLinks || {};
    console.log(data.isEnabled)

    document.querySelectorAll('a').forEach(link => {
        // Remove previously added event listeners to avoid duplicates
        link.removeEventListener('click', linkClickHandler);

        // Apply initial style based on settings
        link.style.color = data.unvisitedColor || '#007bff'; // Default unvisited color

        // Add click event listener to change color upon click
        link.addEventListener('click', linkClickHandler.bind(null, data.visitedColor || '#FF5733', link.href)); // Default visited color

        // Check clicked history apply the link styles if it is clicked
        if (clickedLinks[link.href]) {
            link.style.color = data.visitedColor || '#FF5733'; 
        }
    });
}

// Handler for link click events, changes color
function linkClickHandler(visitedColor, url, event) {
    // Change the color after link click
    event.target.style.color = visitedColor;

    // Update local storage with every click
    updateLocalStorageWithClick(url);
}

function updateLocalStorageWithClick(url) {
    chrome.storage.local.get({clickedLinks: {}}, (result) => {
        const {clickedLinks} = result;
        clickedLinks[url] = Date.now(); // Update or add the link with the current timestamp
        chrome.storage.local.set({clickedLinks}); // Save the updated list back to local storage
    });
}

// for future sync storage use
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
function observeDOM(data) {
    const observer = new MutationObserver(() => {
        applyLinkStyles(data);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initial setup: Get settings and apply styles
chrome.storage.local.get(['visitedColor', 'unvisitedColor', 'isEnabled', 'clickedLinks'], (data) => {
    if (data.isEnabled) {
        applyLinkStyles(data);
        observeDOM(data);
    }
});

chrome.runtime.onMessage.addListener(msgObj => {
    console.log("I am here in background!");
    const msgType = msgObj.type;
    if (msgType === 'applySettingsOnTab') {
        const data = msgObj.data;
        if (data.isEnabled) {
            applyLinkStyles(data);
            observeDOM(data);
        }
    }
    return true;
});