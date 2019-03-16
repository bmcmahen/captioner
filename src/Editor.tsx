/** @jsx jsx */
import { jsx, css, Global } from "@emotion/core";
import * as React from "react";
import { Video } from "./Video";
import { Captions } from "./Captions";
import {
  theme,
  Layer,
  IconButton,
  Text,
  Tooltip,
  Popover,
  MenuList,
  MenuItem,
  InputGroup,
  Button,
  Input,
  Alert,
  Link
} from "sancho";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import debug from "debug";
import ReactPlayer from "react-player";
import { Timeline } from "./Timeline";
import { RouteChildrenProps } from "react-router";
import { animated, useTrail } from "react-spring";
import Helmet from "react-helmet";

const log = debug("app:Editor");

export interface EditorProps extends RouteChildrenProps<any> {}

export const Editor: React.FunctionComponent<EditorProps> = ({
  match,
  history
}) => {
  const { id } = match && match.params;
  const [active, setActive] = React.useState<number | null>(0);
  const [renderMain, setRenderMain] = React.useState(false);
  const [editNameMode, setEditNameMode] = React.useState(false);

  // load the document containing meta about the project
  const { error, loading, value: meta } = useDocument(
    firebase
      .firestore()
      .collection("captions")
      .doc(id)
  );

  const [name, setName] = React.useState(meta ? meta.get("title") : "");

  const subcollection = firebase
    .firestore()
    .collection("captions")
    .doc(id)
    .collection("entries");

  // load the actual captions themselves
  const captions = useCollection(subcollection.orderBy("startTime"));

  // the current video url
  const [video, setVideo] = React.useState<string | null>(
    meta ? meta.get("url") : null
  );

  React.useEffect(() => {
    if (meta && meta.get("url") !== video && meta.get("url")) {
      setVideo(meta.get("url"));
    }

    if (meta && meta.get("title") !== name) {
      setName(meta.get("title"));
    }
  }, [meta]);

  // the current playback time
  const [time, setTime] = React.useState(0);

  // set the video URL and save to firebase
  function setVideoURL(url: string, canSave: boolean, name?: string) {
    setVideo(url);

    // we can't save huge object urls to firebase
    if (canSave && meta) {
      log("save this url to firebase");
      meta.ref.set({ url }, { merge: true });
    }

    // save the video name to firebase if different
    if (meta && name && !meta.get("customName") && meta.get("title") !== name) {
      meta.ref.set({ title: name }, { merge: true });
    }
  }

  function onRemoveVideo() {
    setVideo("");
    if (meta) {
      meta.ref.update({
        url: firebase.firestore.FieldValue.delete()
      });
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

      // setTime(seconds);
      player.current.seekTo(seconds);
    }
  }

  function editName() {
    setEditNameMode(true);
  }

  function changeName(e: React.FormEvent) {
    e.preventDefault();
    meta!.ref.set({ title: name, customName: true }, { merge: true });
    setEditNameMode(false);
  }

  const trail = useTrail(2, {
    from: { opacity: 0, y: 3 },
    opacity: 1,
    y: 0,
    onRest: () => setRenderMain(true)
  });

  // error is loading errors or the document doesn't exist

  if (error || (meta && !meta.exists)) {
    return (
      <Layout>
        <div
          css={{
            padding: `${theme.spaces.lg} 0`,
            display: "flex",
            justifyContent: "center"
          }}
        >
          <div>
            <Alert
              title="An error occurred while loading your content"
              subtitle={
                <span>
                  Please ensure that you have a correct URL and try again. You
                  can also try going <Link href="/">home.</Link>
                </span>
              }
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet title={meta ? meta.get("title") : "Loading"} />
      <MainEditor animation={trail[0]}>
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
                      component="a" // tooltip not working with ReactRouterLink
                      href="/me"
                      onClick={e => {
                        e.preventDefault();
                        history.push("/me");
                      }}
                      color="white"
                      css={{ marginLeft: "-0.5rem" }}
                      icon="arrow-left"
                      label="View your projects"
                      variant="ghost"
                    />
                  </Tooltip>
                  {meta && (
                    <React.Fragment>
                      {editNameMode ? (
                        <form css={{ display: "flex" }} onSubmit={changeName}>
                          <InputGroup
                            label="Project name"
                            hideLabel
                            css={{ margin: 0 }}
                          >
                            <Input
                              inputSize="sm"
                              placeholder="Your project name"
                              value={name}
                              autoFocus
                              onChange={e => setName(e.target.value)}
                              css={{
                                background: "white",
                                boxShadow: "none",
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0
                              }}
                            />
                          </InputGroup>
                          <Button
                            css={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0
                            }}
                            size="sm"
                            type="submit"
                            disabled={!name}
                            intent="primary"
                          >
                            Done
                          </Button>
                        </form>
                      ) : (
                        <Text
                          variant="h6"
                          onDoubleClick={() => setEditNameMode(true)}
                          gutter={false}
                          css={{ marginLeft: theme.spaces.sm, color: "white" }}
                        >
                          {meta.get("title")}
                        </Text>
                      )}
                    </React.Fragment>
                  )}
                </div>

                <Popover
                  content={
                    <MenuList>
                      <MenuItem
                        css={{ display: video ? "block" : "none" }}
                        onSelect={onRemoveVideo}
                      >
                        Remove Current Video
                      </MenuItem>

                      <MenuItem onSelect={editName}>Edit project name</MenuItem>
                    </MenuList>
                  }
                >
                  <IconButton
                    color="white"
                    icon="more"
                    disabled={!meta}
                    label="More options"
                    variant="ghost"
                  />
                </Popover>
              </React.Fragment>
            </Video>
          )}
        </VideoContainer>
        <CaptionsContainer>
          {!loading && meta && captions.value && renderMain && (
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

      <TimelineContainer animation={trail[1]}>
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
    <>
      <Global
        styles={{
          body: {
            backgroundColor: "#7fddc7",
            backgroundImage: `url(${require("./backgrounds/skyline.jpg")})`,
            backgroundSize: "cover"
          }
        }}
      />
      <div
        css={css`
          height: 100vh;
          overflow: hidden;
          width: 100vw;
          display: grid;

          box-sizing: border-box;
          grid-template-rows: auto 125px;
          grid-template-areas:
            "main"
            "timeline";
        `}
        {...other}
      >
        {children}
      </div>
    </>
  );
}

function MainEditor({
  children,
  animation
}: {
  animation: any;
  children?: React.ReactNode;
}) {
  return (
    <animated.div
      style={{
        opacity: animation.opacity,
        transform: animation.y.interpolate((y: number) => `translateY(${-y}%)`)
      }}
      css={{
        minHeight: 0,
        padding: theme.spaces.lg,
        paddingBottom: 0,
        gridArea: "main"
      }}
    >
      <Layer
        elevation="xl"
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
    </animated.div>
  );
}

function TimelineContainer({
  animation,
  children
}: {
  animation: any;
  children?: React.ReactNode;
}) {
  return (
    <animated.div
      style={{
        opacity: animation.opacity,
        transform: animation.y.interpolate((y: number) => `translateY(${y}%)`)
      }}
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
          elevation="xl"
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
    </animated.div>
  );
}

function CaptionsContainer({ children }: { children?: React.ReactNode }) {
  return <div css={{ flex: "0 0 500px" }}> {children}</div>;
}

function VideoContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div css={{ background: theme.colors.palette.gray.base, flex: "1 1 50%" }}>
      {children}
    </div>
  );
}
