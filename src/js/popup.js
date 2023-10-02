document.addEventListener("DOMContentLoaded", function () {
  const startVideoButton = document.getElementById("start-video");

  const stopVideoButton = document.getElementById("stop-video");

  const videoSwitch = document.getElementById("videoSwitch");
  const audioSwitch = document.getElementById("audioSwitch");
  const recordButton = document.getElementById("recordButton");

  let video = false;
  let audio = false;
  let state = "idle";

  function handleVideoChange() {
    video = videoSwitch.checked;
    // Your logic for handling video switch change goes here
  }

  function handleAudioChange() {
    audio = audioSwitch.checked;
    // Your logic for handling audio switch change goes here
  }

  function handleClick() {
    if (state === "idle") {
      state = "recording";
      startRecording();
      recordButton.textContent = "Stop Recording";
    } else {
      state = "idle";
      stopRecording();
      recordButton.textContent = "Start Recording";
    }
  }

  videoSwitch.addEventListener("change", handleVideoChange);
  audioSwitch.addEventListener("change", handleAudioChange);
  recordButton.addEventListener("click", handleClick);

  function startRecording() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "request_recording" },
        function (response) {
          if (!chrome.runtime.lastError) {
            console.log(response.message);
          } else {
            console.log(chrome.runtime.lastError, "error line 15");
          }
        }
      );
    });
  }

  function stopRecording() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "stop_recording" },
        function (response) {
          if (!chrome.runtime.lastError) {
            console.log(response.message);
          } else {
            console.log(chrome.runtime.lastError, "error line 31");
          }
        }
      );
    });
  }
});
