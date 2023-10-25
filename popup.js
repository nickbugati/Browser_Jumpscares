document.getElementById('disableButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({ "message": "disable_jumpscares" });
});

if (confirm("This extension will display jump scares with loud audio. Do you wish to proceed?")) {
    chrome.runtime.sendMessage({ "message": "reset_jumpscares" });
}