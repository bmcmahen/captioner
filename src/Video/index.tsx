/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import ReactPlayer from "react-player";
import { Dropzone } from "./Dropzone";
import { Embed } from "sancho";
import debug from "debug";

const log = debug("app:Video");

export interface VideoProps {
  url: string | null;
  setVideoDuration: (seconds: number) => void;
  setVideoURL: (url: string, canSave: boolean, name: string) => void;
  player: React.RefObject<ReactPlayer>;
  setCurrentTime: (seconds: number) => void;
}

export const Video: React.FunctionComponent<VideoProps> = ({
  setVideoURL,
  setVideoDuration,
  setCurrentTime,
  url,
  player
}) => {
  React.useEffect(() => {
    try {
      if (url) {
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      // this is lazy, but will fire with non object url
    }
  }, []);

  if (!url) {
    return (
      <div>
        <Dropzone onRequestAddURL={setVideoURL} />
      </div>
    );
  }

  function onProgress(progress: any) {
    log("progress: %o", progress);
    setCurrentTime(progress.playedSeconds);
  }

  function onDuration(duration: number) {
    log("duration: %s", duration);
    setVideoDuration(duration);
  }

  function onSeek(seconds: number) {
    log("seek: %s", seconds);
  }

  return (
    <div
      css={{
        width: "100%",
        height: "100%",
        background: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Embed width={4} height={3}>
        <ReactPlayer
          controls
          width="100%"
          ref={player}
          style={{ display: "flex" }}
          height="auto"
          url={url}
          onProgress={onProgress}
          onSeek={onSeek}
          onDuration={onDuration}
        />
      </Embed>
    </div>
  );
};
