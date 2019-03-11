// create a video URL from a local video file.

// I'm unusure how taxing this can be for larger files, so if perf
// becomes an issue might be worth looking into service worker
// options.

export function createVideoURL(file: File) {
  const url = window.URL;
  if (!url || typeof url.createObjectURL === "undefined") {
    throw new Error("Your web browser does not support loading local files.");
  }

  if (!canPlayVideo(file.type)) {
    throw new Error(
      "This video format is currently unsupported. Please try using an mp4 formatted video."
    );
  }

  return url.createObjectURL(file);
}

function canPlayVideo(type: string) {
  var mpeg4,
    h264,
    ogg,
    webm,
    compatibleTypes = [],
    testVideo = document.createElement("video");

  if (testVideo.canPlayType) {
    // H264
    h264 =
      "" !==
      (testVideo.canPlayType('video/mp4; codecs="avc1.42E01E"') ||
        testVideo.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'));
    if (h264) compatibleTypes.push("video/mp4");

    // Check for Ogg support
    ogg = "" !== testVideo.canPlayType('video/ogg; codecs="theora"');
    if (ogg) compatibleTypes.push("video/ogg");

    // Check for Webm support
    webm = "" !== testVideo.canPlayType('video/webm; codecs="vp8, vorbis"');
    if (webm) compatibleTypes.push("video/webm");
  }
  return compatibleTypes.indexOf(type) > -1;
}
