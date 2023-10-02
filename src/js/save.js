document.addEventListener("DOMContentLoaded", function () {
  // Get the video element
  const videoElement = document.getElementById("recorder-video-player");

  // Retrieve the blob URL from the query parameter
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const videoUrl = urlParams.get("videoUrl");

  // Set the video source to the blob URL
  videoElement.src = videoUrl;

  videoElement.addEventListener("ended", function () {
    // Revoke the URL object to free up memory
    URL.revokeObjectURL(videoUrl);
  });
});
