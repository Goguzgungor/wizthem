async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

chrome.runtime.onInstalled.addListener(async () => {
    const tab = await getCurrentTab();
    if (tab && tab.url) {
        chrome.storage.local.set({currentUrl: tab.url}, function() {
            console.log('Current URL saved:', tab.url);
        });
    }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await getCurrentTab();
    if (tab && tab.url) {
        chrome.storage.local.set({currentUrl: tab.url}, function() {
            console.log('URL updated:', tab.url);
        });
    }
});