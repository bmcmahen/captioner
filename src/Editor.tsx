/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Video } from "./Video";
import { Captions } from "./Captions";
import {
  theme,
  useCollapse,
  responsiveBodyPadding,
  Alert,
  Layer,
  IconButton,
  Text,
  Tooltip
} from "sancho";
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
  const [active, setActive] = React.useState<number | null>(0);

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
  function seekTo(seconds: number, blur: boolean = false) {
    if (player && player.current) {
      // blur when seeking outside of an established caption
      // this feels hacky, but seems to work
      if (blur) {
        setActive(null);
      }

      player.current.seekTo(seconds);
    }
  }

  // error is loading errors or the document doesn't exist
  if (error || (meta && !meta.exists)) {
    return <div>Alert</div>;
  }

  return (
    <Layout>
      <MainEditor>
        <VideoContainer>
          {!loading && (
            <Video
              setVideoDuration={setVideoDuration}
              setVideoURL={setVideoURL}
              setCurrentTime={setCurrentTime}
              url={video}
              player={player}
            >
              <React.Fragment>
                <div
                  css={{
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <Tooltip content="View your projects">
                    <IconButton
                      color="white"
                      icon="arrow-left"
                      label="View your projects"
                      variant="ghost"
                    />
                  </Tooltip>
                  {meta && (
                    <Text
                      variant="h6"
                      gutter={false}
                      css={{ marginLeft: theme.spaces.sm, color: "white" }}
                    >
                      {meta.get("title")}
                    </Text>
                  )}
                </div>
                <IconButton
                  color="white"
                  icon="more"
                  label="More options"
                  variant="ghost"
                />
              </React.Fragment>
            </Video>
          )}
        </VideoContainer>
        <CaptionsContainer>
          {!loading && meta && captions.value && (
            <Captions
              currentTime={time}
              onRequestSeek={seekTo}
              duration={meta.get("duration")}
              captions={captions.value}
              collectionReference={subcollection}
              active={active}
            />
          )}
        </CaptionsContainer>
      </MainEditor>

      <TimelineContainer>
        {!loading && meta && meta.get("duration") && captions.value && (
          <Timeline
            captions={captions.value}
            currentTime={time}
            onRequestSkip={i => {
              setActive(i);
            }}
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
        overflow: hidden;
        width: 100vw;
        display: grid;
        background-size: cover;
        background-image: url(https://benmcmahen.com/static/blur-262a8a688a70acf945728449894ac5a8.png);
        box-sizing: border-box;
        // grid-template-columns: 25% 25% 25% 25%;
        grid-template-rows: auto 125px;
        grid-template-areas:
          "main"
          "timeline";
      `}
      {...other}
    >
      {children}
    </div>
  );
}

function MainEditor({ children }: { children?: React.ReactNode }) {
  return (
    <div
      css={{
        minHeight: 0,
        padding: theme.spaces.lg,
        paddingBottom: 0,
        gridArea: "main"
      }}
    >
      <Layer
        css={css`
          display: flex;
          min-height: 0;
          height: 100%;
          overflow: hidden;
          width: 100%;
        `}
      >
        {children}
      </Layer>
    </div>
  );
}

function TimelineContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div
      css={{
        gridArea: "timeline"
      }}
    >
      <div
        css={{
          padding: "24px",
          boxSizing: "border-box",
          height: "100%",
          width: "100%"
        }}
      >
        <Layer
          css={{
            borderRadius: theme.radii.lg,
            background: theme.colors.background.tint1,
            width: "100%",
            position: "relative",
            overflow: "hidden",
            height: "100%"
          }}
        >
          {children}
        </Layer>
      </div>
    </div>
  );
}

function CaptionsContainer({ children }: { children?: React.ReactNode }) {
  return <div css={{ flex: "0 0 550px" }}> {children}</div>;
}

function VideoContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div css={{ background: theme.colors.palette.gray.base, flex: "1 1 50%" }}>
      {children}
    </div>
  );
}
