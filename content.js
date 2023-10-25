chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      if (request.message === "show_jumpscares") {
          const selectedJumpScare = request.data;

          const jumpScareContainer = document.createElement('div');
          jumpScareContainer.innerHTML = `
              <img src="${selectedJumpScare.imgSrc}" alt="Jump Scare" />
              <audio autoplay id="audioElement">
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

          document.getElementById("audioElement").addEventListener("ended", function () {
              jumpScareContainer.remove();
              chrome.runtime.sendMessage({ "message": "reset_jumpscares" });
          });
      }
  }
);