/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Video } from "./Video";
import { Captions } from "./Captions";
import { theme, useCollapse, responsiveBodyPadding, Alert } from "sancho";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
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

  // load the document containing meta about the project
  const { error, loading, value: meta } = useDocument(
    firebase
      .firestore()
      .collection("captions")
      .doc(id)
  );

  const subcollection = firebase
    .firestore()
    .collection("captions")
    .doc(id)
    .collection("entries");

  // load the actual captions themselves
  const captions = useCollection(subcollection.orderBy("startTime"));

  // the current video url
  const [video, setVideo] = React.useState<string | null>(
    meta ? meta.get("video") : null
  );

  // the current playback time
  const [time, setTime] = React.useState(0);

  // update our doucment title
  React.useEffect(() => {
    if (meta && meta.exists) {
      document.title = meta.get("title");
    }
  }, [meta]);

  // set the video URL and save to firebase
  function setVideoURL(url: string, canSave: boolean, name: string) {
    setVideo(url);

    // we can't save huge object urls to firebase
    if (canSave && meta) {
      log("save this url to firebase");
      meta.ref.set({ url }, { merge: true });
    }

    // save the video name to firebase if different
    if (meta && meta.get("title") !== name) {
      meta.ref.set({ title: name }, { merge: true });
    }
  }

  // set the current video duration
  // should we warn if the duration changes from saved?
  function setVideoDuration(seconds: number) {
    if (meta) {
      meta.ref.set({ duration: seconds }, { merge: true });
    }
  }

  // we need to track this to determin which caption to focus,
  // and where the scrubber should be located.
  // We should ignore this if "scrubbing"
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
  if (error || (meta && !meta.exists)) {
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
      <EditorNav title={meta && meta.get("title")} />
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
        {meta && captions.value && (
          <Captions
            currentTime={time}
            onRequestSeek={seekTo}
            duration={meta.get("duration")}
            captions={captions.value}
            collectionReference={subcollection}
          />
        )}
      </CaptionsContainer>

      <TimelineContainer>
        {meta && meta.get("duration") && captions.value && (
          <Timeline
            captions={captions.value}
            currentTime={time}
            duration={meta.get("duration")}
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
