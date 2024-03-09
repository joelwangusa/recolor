/*
chrome.runtime.onMessage.addListener(msgObj => {
    console.log("I am here in background!");
    const msgType = msgObj.type;
    if (msgType === 'applySettingsAll') {
        const data = msgObj.data;
        if (data.isEnabled) {
            applyLinkStyles(data);
            observeDOM(data);
        }
    }
    return true;
});
*/

chrome.runtime.onMessage.addListener(msgObj => {
    console.log("I am here in background!");
    const msgType = msgObj.type;
    const data = msgObj.data;
    if (msgType === 'applySettingsAll') {
        if (data.isEnabled) {
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                tabs.forEach(tab => {
                    const msgObj = {type:"applySettingsOnTab", data:data}
                    chrome.tabs.sendMessage(tab.id, msgObj, function(response) {
                        console.log("sending message to active tabs to apply the settings changes.");
                    });
                });
            });
        }
    }
    return true;
});


