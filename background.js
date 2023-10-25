chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.local.set({ jumpscareEnabled: true });
    setJumpScareAlarm();
});

function setJumpScareAlarm() {
    // Set an alarm to go off in a random time within 20 minutes
    const randomTime = Math.random() * 1;
    chrome.alarms.create('jumpscareAlarm', { delayInMinutes: randomTime });
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'jumpscareAlarm') {
        const result = await chrome.storage.local.get('jumpscareEnabled');
        if (result.jumpscareEnabled) {
            initiateJumpScare();
            setJumpScareAlarm();
        }
    }
});

function initiateJumpScare() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        if (activeTab && typeof activeTab.url === 'string' && !activeTab.url.startsWith("chrome://") && !activeTab.url.startsWith("https://chrome.google.com/webstore/")) {
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                func: triggerJumpScare,
                args: []
            });
        }
    });
}

function triggerJumpScare() {
    const jumpScares = [
        {
            imgSrc: chrome.runtime.getURL("images/chica.png"),
            audioSrc: chrome.runtime.getURL("audio/chica.mp3")
        }
    ];

    const randomIndex = Math.floor(Math.random() * jumpScares.length);
    const selectedJumpScare = jumpScares[randomIndex];

    const jumpScareContainer = document.createElement('div');
    jumpScareContainer.innerHTML = `
        <img src="${selectedJumpScare.imgSrc}" alt="Jump Scare" />
        <audio autoplay onended="this.parentElement.remove()">
            <source src="${selectedJumpScare.audioSrc}" type="audio/mpeg">
            Your browser does not support the audio tag.
        </audio>
    `;
    jumpScareContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
    `;
    document.body.appendChild(jumpScareContainer);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "disable_jumpscares") {
        chrome.storage.local.set({ jumpscareEnabled: false });
        chrome.alarms.clear('jumpscareAlarm');
    } else if (request.message === "reset_jumpscares") {
        chrome.storage.local.set({ jumpscareEnabled: true });
        setJumpScareAlarm();
    }
});