chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.local.set({ jumpscareEnabled: true });
    setJumpScareAlarm();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'jumpscareAlarm') {
        const result = await chrome.storage.local.get('jumpscareEnabled');
        if (result.jumpscareEnabled) {
            initiateJumpScare();
            setJumpScareAlarm();
        }
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "toggle_jumpscares") {
        chrome.storage.local.get('jumpscareEnabled', (result) => {
            // Toggle the jumpscareEnabled value
            const newState = !result.jumpscareEnabled;
            chrome.storage.local.set({ jumpscareEnabled: newState });
            if (newState) {
                setJumpScareAlarm();
            } else {
                chrome.alarms.clear('jumpscareAlarm');
            }
        });
    } else if (request.message === "disable_jumpscares") {
        chrome.storage.local.set({ jumpscareEnabled: false });
        chrome.alarms.clear('jumpscareAlarm');
    } else if (request.message === "reset_jumpscares") {
        chrome.storage.local.set({ jumpscareEnabled: true });
        setJumpScareAlarm();
    }
});

function setJumpScareAlarm() {
    // Set an alarm to go off in a random time within 20 minutes
    const randomTime = Math.random() * 20;
    chrome.alarms.create('jumpscareAlarm', { delayInMinutes: randomTime });
}

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
        },
        {
            imgSrc: chrome.runtime.getURL("images/bear.png"),
            audioSrc: chrome.runtime.getURL("audio/bear.mp3")
        },
        {
            imgSrc: chrome.runtime.getURL("images/doll.png"),
            audioSrc: chrome.runtime.getURL("audio/doll.mp3")
        },
        {
            imgSrc: chrome.runtime.getURL("images/cat.png"),
            audioSrc: chrome.runtime.getURL("audio/cat.mp3")
        },
        {
            imgSrc: chrome.runtime.getURL("images/pt.png"),
            audioSrc: chrome.runtime.getURL("audio/pt.mp3")
        },
        {
            imgSrc: chrome.runtime.getURL("images/girl.png"),
            audioSrc: chrome.runtime.getURL("audio/girl.mp3")
        },
        {
            imgSrc: chrome.runtime.getURL("images/nun.png"),
            audioSrc: chrome.runtime.getURL("audio/nun.mp3")
        },
        {
            imgSrc: chrome.runtime.getURL("images/re.png"),
            audioSrc: chrome.runtime.getURL("audio/re.mp3")
        },
        {
            imgSrc: chrome.runtime.getURL("images/obunga.png"),
            audioSrc: chrome.runtime.getURL("audio/obunga.mp3")
        },
        {
            imgSrc: chrome.runtime.getURL("images/bonnie.png"),
            audioSrc: chrome.runtime.getURL("audio/bonnie.mp3")
        },
        // ... other jump scares
    ];

    const randomIndex = Math.floor(Math.random() * jumpScares.length);
    const selectedJumpScare = jumpScares[randomIndex];

    // Play the jumpscare audio using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    fetch(selectedJumpScare.audioSrc)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();

            // Check if audioContext is running
            if (audioContext.state !== "running") {
                // If not running, it means autoplay might be blocked. Return early.
                return;
            }

            // Inject the shake keyframes CSS
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                @keyframes shake {
                    0% { transform: translate(-50%, -50%) translate(0, 0); }
                    10% { transform: translate(-50%, -50%) translate(-10px, -5px); }
                    20% { transform: translate(-50%, -50%) translate(10px, 5px); }
                    30% { transform: translate(-50%, -50%) translate(-10px, -5px); }
                    40% { transform: translate(-50%, -50%) translate(10px, 5px); }
                    50% { transform: translate(-50%, -50%) translate(-10px, -5px); }
                    60% { transform: translate(-50%, -50%) translate(10px, 5px); }
                    70% { transform: translate(-50%, -50%) translate(-10px, -5px); }
                    80% { transform: translate(-50%, -50%) translate(10px, 5px); }
                    90% { transform: translate(-50%, -50%) translate(-10px, -5px); }
                    100% { transform: translate(-50%, -50%) translate(0, 0); }
                }
            `;
            document.head.appendChild(styleElement);

            // Display the jumpscare image with shake animation
            const jumpScareContainer = document.createElement('div');
            jumpScareContainer.innerHTML = `
            <img src="${selectedJumpScare.imgSrc}" alt="Jump Scare" style="max-width: 100vw; max-height: 100vh; width: auto; height: auto;" />
            `;
            jumpScareContainer.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 10000;
                animation: shake 0.5s infinite;
            `;
            document.body.appendChild(jumpScareContainer);

            source.onended = () => {
                jumpScareContainer.remove();
                styleElement.remove(); // remove the style once done
            };
        });
}