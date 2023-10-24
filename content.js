if (confirm("This extension will display jump scares with loud audio. Do you wish to proceed?")) {
    let jumpScareTimeout = setTimeout(() => {
        const jumpScares = [
            { imgSrc: "path_to_your_image1.jpg", audioSrc: "path_to_your_audio1.mp3" },
            { imgSrc: "path_to_your_image2.jpg", audioSrc: "path_to_your_audio2.mp3" },
            // Add more jump scare scenarios as needed
        ];

        const randomIndex = Math.floor(Math.random() * jumpScares.length);
        const selectedJumpScare = jumpScares[randomIndex];

        const jumpScareContainer = document.createElement('div');
        jumpScareContainer.innerHTML = `
        <img src="${selectedJumpScare.imgSrc}" alt="Jump Scare" />
        <audio autoplay>
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
    }, Math.random() * 10000); // Adjust timing as needed

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.message === "disable_jumpscares") {
                clearTimeout(jumpScareTimeout);
                // Add any additional cleanup logic here if necessary
            }
        }
    );
}