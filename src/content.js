console.log("hello from content script ahhh");

var recorder = null;

function handleDataAvailable(recordedBlob, callback) {
  let videoUrl = URL.createObjectURL(recordedBlob);

  callback(videoUrl);
}

function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);

  recorder.start();

  recorder.onstop = function (e) {
    stream.getTracks().forEach((track) => {
      if (track.readyState == "live") {
        track.stop();
      }
    });
  };

  recorder.ondataavailable = function (e) {
    handleDataAvailable(e.data, (videoUrl) => {
      // Send a message to the background script to open a new tab
      chrome.runtime.sendMessage({ type: "open_tab", videoUrl: videoUrl });
    });
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "request_recording") {
    console.log("requesting recording");

    sendResponse({ message: `Processed: ${message.action}` });

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 1920,
          height: 1080,
        },
      })
      .then((stream) => {
        onAccessApproved(stream);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (message.action === "stop_recording") {
    console.log("stopping recording");
    sendResponse({ message: `Processed: ${message.action}` });
    if (!recorder) {
      console.log("No recorder");
    }
    recorder.stop();
  }
});
