import FileSave from "file-saver";

interface Caption {
  startTime: number;
  endTime: number;
  content: string;
}

// SRT example format

// 4
// 00:00:23,880 --> 00:00:28,749
// My name is Yuri Zhary.

export function exportSRT(captions: Caption[]): string {
  let buf = [""];
  captions.forEach((caption, i) => {
    // don't include empty captions
    if (caption.content !== "" && caption.content.match(/|S/)) {
      const len = buf.length;
      buf[len] = (i + 1).toString();
      buf[len + 1] =
        secondsToHms(caption.startTime) +
        " --> " +
        secondsToHms(caption.endTime);
      buf[len + 2] = caption.content + "\n";
    }
  });

  return buf.join("\n");
}

// WEBVTT
//
// 00:11.000 --> 00:13.000
// <v Roger Bingham>We are in New York City

// 00:13.000 --> 00:16.000
// <v Roger Bingham>Were actually at the Lucern Hotel, just down the street

export function exportWebVTT(captions: Caption[]): string {
  let buf = [""];
  captions.forEach((caption, i) => {
    const len = buf.length;
    buf[len] =
      secondsToHms(caption.startTime) + " --> " + secondsToHms(caption.endTime);
    buf[len + 1] = caption.content + "\n";
  });
  return buf.join("\n");
}

/**
 * Download captions to disk
 * @param name
 * @param captions
 * @param format
 */

export function saveAs(
  name: string,
  captions: Caption[],
  format: "srt" | "webvtt"
) {
  const buff = format === "srt" ? exportSRT(captions) : exportWebVTT(captions);
  const blob = new Blob([buff], { type: "text/plain;charset=utf-8" });
  FileSave.saveAs(blob, name);
}

/**
 * Convert seconds to HH:MM:SS format
 */

function secondsToHms(d: number) {
  d = Number(d);

  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  return (
    ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2)
  );
}
