//chrome

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId },
        files: ["./content.js"],
      })
      .then(() => {
        console.log("we have injected the content script");
      })
      .catch((err) => console.log(err, "error in background script line 10"));
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "redirect") {
    // Redirect the user to the specified URL
    chrome.tabs.create({ url: message.url }, (tab) => {
      // Wait for the page to load
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (info.status === "complete" && tabId === tab.id) {
          // Inject the script into the page
          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              func: (videoUrl) => {
                const videoPlayer = document.getElementById(
                  "recorder-video-player"
                );

                if (videoPlayer) {
                  videoPlayer.src = videoUrl;
                }
              },
              args: [message.videoUrl],
            },
            () => {
              // Remove the listener
              chrome.tabs.onUpdated.removeListener(listener);

              // Send a response to the content script
              sendResponse();
            }
          );
        }
      });
    });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }

  if (message.type === "open_tab") {
    const videoPageUrl = chrome.runtime.getURL(
      `save.html?videoUrl=${message.videoUrl}`
    );
    chrome.tabs.create({ url: videoPageUrl });
  }
});
