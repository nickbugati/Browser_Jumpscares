document.addEventListener('keydown', (e) => {
    if (e.key === '`') {
        chrome.runtime.sendMessage({ message: "toggle_jumpscares" });
    }
});