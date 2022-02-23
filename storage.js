// Listen to message from popup.js and respond
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        let wordleState = JSON.parse(localStorage.getItem("nyt-wordle-state"));
        let darkMode = localStorage.getItem("nyt-wordle-darkmode");
        sendResponse({ wordleState, darkMode});
    } catch (e) {
        sendResponse( {} );
    }
});