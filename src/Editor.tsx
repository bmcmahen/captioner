/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Video } from "./Video";
import { Captions } from "./Captions";
import { theme, useCollapse, responsiveBodyPadding, Alert } from "sancho";
import { useDocument } from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import debug from "debug";
import { EditorNav } from "./EditorNav";
import ReactPlayer from "react-player";
import { Timeline } from "./Timeline";
import { RouteChildrenProps } from "react-router";

const log = debug("app:Editor");

export interface EditorProps extends RouteChildrenProps<any> {}

export const Editor: React.FunctionComponent<EditorProps> = ({ match }) => {
  const { id } = match && match.params;
  const { error, loading, value } = useDocument(
    firebase
      .firestore()
      .collection("captions")
      .doc(id)
  );

  // the current video url
  const [video, setVideo] = React.useState<string | null>(
    value ? value.get("video") : null
  );

  // the current playback time
  const [time, setTime] = React.useState(0);

  // set the video URL and save to firebase
  function setVideoURL(url: string, canSave: boolean, name: string) {
    setVideo(url);

    // we can't save huge object urls to firebase
    if (canSave && value) {
      log("save this url to firebase");
      value.ref.set({ url });
    }

    // save the video name to firebase
    if (value) {
      value.ref.set({ title: name });
    }
  }

  // set the current video duration
  // should we warn if the duration changes from saved?
  function setVideoDuration(seconds: number) {
    if (value) {
      value.ref.set({ duration: seconds }, { merge: true });
    }
  }

  function setCurrentTime(seconds: number) {
    setTime(seconds);
  }

  const player = React.useRef<ReactPlayer>(null);

  // allow components to seek to a particular time in the video
  function seekTo(seconds: number) {
    if (player && player.current) {
      player.current.seekTo(seconds);
    }
  }

  // error is loading errors or the document doesn't exist
  if (error || (value && !value.exists)) {
    return <div>Alert</div>;
  }

  if (loading) {
    return (
      <Layout css={responsiveBodyPadding}>
        <EditorNav loading />
        <VideoContainer />
        <CaptionsContainer />
        <TimelineContainer />
      </Layout>
    );
  }

  return (
    <Layout css={responsiveBodyPadding}>
      <EditorNav />
      <VideoContainer>
        <Video
          setVideoDuration={setVideoDuration}
          setVideoURL={setVideoURL}
          setCurrentTime={setCurrentTime}
          url={video}
          player={player}
        />
      </VideoContainer>
      <CaptionsContainer>
        {value && <Captions onRequestSeek={seekTo} captions={[]} />}
      </CaptionsContainer>

      <TimelineContainer>
        {value && value.get("duration") && (
          <Timeline
            captions={[]}
            duration={value.get("duration")}
            onRequestSeek={seekTo}
          />
        )}
      </TimelineContainer>
    </Layout>
  );
};

function Layout({ children, ...other }: { children: React.ReactNode }) {
  return (
    <div
      css={css`
        height: 100vh;
        width: 100vw;
        display: grid;
        box-sizing: border-box;
        grid-template-columns: 25% 25% 25% 25%;
        grid-template-rows: auto 100px;
        grid-template-areas:
          "video video editor editor"
          "timeline timeline timeline timeline";
      `}
      {...other}
    >
      {children}
    </div>
  );
}

function TimelineContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div
      css={{
        gridArea: "timeline",
        background: theme.colors.background.tint2
      }}
    >
      {children}
    </div>
  );
}

function CaptionsContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div
      css={{
        gridArea: "editor",
        background: "white"
      }}
    >
      {" "}
      {children}
    </div>
  );
}

function VideoContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div
      css={{
        gridArea: "video"
      }}
    >
      {children}
    </div>
  );
}
