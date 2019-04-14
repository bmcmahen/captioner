/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import TextareaAutosize from "react-autosize-textarea";
import {
  Text,
  Toolbar,
  InputGroup,
  Navbar,
  Button,
  Popover,
  Input,
  IconButton,
  Tooltip,
  Dialog,
  useTheme,
  IconChevronDown,
  IconRepeat,
  IconHelpCircle
} from "sancho";
import debug from "debug";
import { captionFactory, CaptionOptions } from "./firebase";
import formatDuration from "format-duration";
import useLocalStorage from "react-use-localstorage";
import { useSpring, animated } from "react-spring";
import { saveAs as localSave } from "./export";

const log = debug("app:Captions");

interface Caption {
  id: string;
  startTime: number;
  endTime: number;
  content: string;
}

export interface CaptionsProps {
  collectionReference: firebase.firestore.CollectionReference;
  captions: firebase.firestore.QuerySnapshot;
  onRequestSeek: (seconds: number) => void;
  currentTime?: number;
  active: number | null;
  duration: number;
}

export const Captions: React.FunctionComponent<CaptionsProps> = ({
  captions,
  currentTime,
  active,

  duration,
  collectionReference,
  onRequestSeek
}) => {
  const theme = useTheme();
  const [focus, setFocus] = React.useState(active);
  const [showHelp, setShowHelp] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState(active);
  const [looping, setLooping] = useLocalStorage("looping", "enabled");
  const [captionDuration, setCaptionDuration] = useLocalStorage(
    "captionDuration",
    "5"
  );

  React.useEffect(() => {
    if (active !== activeItem) {
      setActiveItem(active);
      setFocus(active);
    }
  }, [active]);

  const initialCaptionDuration =
    Number(captionDuration) === 0 ? 5 : Number(captionDuration);

  const isLooping = looping === "enabled";

  function minValidTime(time: number) {
    if (time < 0) return 0;
    return time;
  }

  function maxValidTime(time: number) {
    if (time > duration) return duration;
    return time;
  }

  React.useEffect(() => {
    // add our default caption if we don't have one yet
    if (captions.docs.length === 0) {
      addCaption(
        captionFactory({
          startTime: 0,
          endTime: maxValidTime(initialCaptionDuration)
        })
      );
    }
  }, [captions]);

  React.useEffect(() => {
    const activeItem = typeof focus === "number" ? captions.docs[focus] : null;

    // handle looping if enabled
    if (typeof currentTime === "number" && isLooping && activeItem) {
      if (currentTime > activeItem.get("endTime")) {
        onRequestSeek(activeItem.get("startTime"));
        return;
      }
    }

    // otherwise, cycle through our components to find
    // the one we should focus
    if (typeof currentTime === "number") {
      // captions.docs.some((caption, i) => {
      //   const d = caption.data();
      //   if (d.startTime > currentTime && currentTime < d.endTime) {
      //     if (i !== focus) {
      //       setActiveItem(i - 1);
      //       return true;
      //     }
      //     return false;
      //   }
      //   return false;
      // });
    }
  }, [currentTime, captions]);

  function exportSRT() {
    if (!captions) {
      return;
    }

    const caps = captions.docs.map(cap => cap.data());
    localSave("file.srt", caps as Caption[], "srt");
  }

  function addCaption(options: CaptionOptions) {
    collectionReference.add(captionFactory(options));
  }

  const animation = useSpring({
    from: { opacity: 0 },
    opacity: 1
  });

  return (
    <animated.div
      style={animation}
      css={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Navbar
        css={{
          background: "white",
          // borderTop: `1px solid ${theme.colors.border.default}`,
          flex: "0 0 auto",
          borderBottom: `1px solid ${theme.colors.border.muted}`
        }}
        position="static"
      >
        <Toolbar
          css={{ display: "flex", justifyContent: "space-between" }}
          compressed
        >
          <div />
          <div css={{ display: "flex", alignItems: "center" }}>
            <Popover
              content={
                <div css={{ maxWidth: "300px", padding: theme.spaces.lg }}>
                  <form onSubmit={e => e.preventDefault()}>
                    <InputGroup
                      label="Default caption duration (seconds)"
                      helpText="This specifies the default caption duration (in seconds) on newly created captions."
                    >
                      <Input
                        type="number"
                        value={captionDuration}
                        step={1}
                        autoFocus
                        min={1}
                        max={30}
                        onChange={e => {
                          setCaptionDuration(e.target.value);
                        }}
                      />
                    </InputGroup>
                  </form>
                </div>
              }
            >
              <Button
                css={{
                  paddingRight: theme.spaces.xs,
                  paddingLeft: theme.spaces.xs,
                  alignItems: "center"
                }}
                size="md"
                variant="ghost"
              >
                {initialCaptionDuration}s
                <IconChevronDown
                  size="sm"
                  color={theme.colors.text.muted}
                  css={{ marginLeft: theme.spaces.xs }}
                />
              </Button>
            </Popover>

            <Tooltip content="Show shortcuts">
              <IconButton
                size="md"
                variant="ghost"
                onClick={() => setShowHelp(true)}
                icon={<IconHelpCircle />}
                label="Show shortcuts"
              />
            </Tooltip>

            <Dialog
              title="Shortcuts"
              isOpen={showHelp}
              onRequestClose={() => setShowHelp(false)}
              css={{
                "& .Dialog__header": {
                  background: theme.colors.background.tint1,
                  borderTopRightRadius: theme.radii.lg,
                  borderTopLeftRadius: theme.radii.lg,
                  paddingBottom: theme.spaces.md
                }
              }}
            >
              <Text
                component="div"
                css={{
                  display: "block",
                  padding: theme.spaces.lg
                }}
              >
                <dl
                  css={{
                    margin: 0,
                    padding: 0,
                    "& > div": {
                      display: "flex"
                    },
                    "& > div > dt": {
                      fontWeight: "bold",
                      flex: "0 0 100px"
                    }
                  }}
                >
                  <div>
                    <dt>Cmd P</dt> <dd>Increment the caption end time.</dd>
                  </div>
                  <div>
                    <dt>Cmd O</dt> <dd>Decrement the caption end time.</dd>
                  </div>
                  <div>
                    <dt>Cmd I</dt> <dd>Increment the caption start time.</dd>
                  </div>
                  <div>
                    <dt>Cmd U</dt> <dd>Decrement the caption start time.</dd>
                  </div>
                  <div>
                    <dt>Cmd Enter</dt>{" "}
                    <dd>Create a new line in the same caption.</dd>
                  </div>
                  <div>
                    <dt>Enter</dt>

                    <dd>
                      Create a new caption directly after the current caption.
                    </dd>
                  </div>
                  <div>
                    <dt>Delete</dt>
                    <dd>
                      If the caption is empty, delete it and return to the
                      previous caption.
                    </dd>
                  </div>
                </dl>
              </Text>
            </Dialog>
            <Tooltip content="Toggle looping">
              <IconButton
                size="md"
                variant="ghost"
                icon={<IconRepeat />}
                onClick={() => setLooping(isLooping ? "false" : "enabled")}
                color={
                  isLooping
                    ? theme.colors.text.selected
                    : theme.colors.palette.gray.light
                }
                label="Repeat"
              />
            </Tooltip>

            <div
              css={{
                width: "1px",
                height: "14px",
                margin: `0 ${theme.spaces.md}`,
                background: theme.colors.background.tint2
              }}
            />
            <Button size="sm" intent="primary" onClick={exportSRT}>
              Export SRT
            </Button>
          </div>
        </Toolbar>
      </Navbar>
      <div
        css={{
          flex: 1,
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch",
          borderBottomRightRadius: theme.radii.lg
        }}
      >
        {captions.docs.map((caption, i) => {
          return (
            <Caption
              active={i === activeItem}
              focus={i === focus}
              onRequestNext={() => {
                log("request next");

                // 1. If another caption exists after this one, focus it
                const next = captions.docs[i + 1];
                if (
                  next &&
                  next.get("startTime") - caption.get("endTime") < 1
                ) {
                  setActiveItem(i + 1);
                  setFocus(i + 1);

                  return;
                }

                // 2. Otherwise, insert a new empty caption and focus it.
                const newStart = caption.get("endTime") + 0.001;

                // don't if we are on the last one
                if (newStart >= duration) {
                  return;
                }

                addCaption({
                  startTime: newStart,
                  endTime: maxValidTime(newStart + initialCaptionDuration)
                });

                setFocus(i + 1);
                setActiveItem(i + 1);
              }}
              updateToNextTimeAllotment={() => {
                // 1. ignore if last time allotment
                if (caption.get("endTime") >= duration) {
                  return;
                }

                // 2. endTime + standard duration
                log("update to next time allotment");
                caption.ref.set(
                  {
                    startTime: caption.get("endTime"),
                    endTime: maxValidTime(
                      caption.get("endTime") + initialCaptionDuration
                    )
                  },
                  { merge: true }
                );
                onRequestSeek(caption.get("endTime"));
              }}
              onRequestDelete={() => {
                // 1. if there's only one caption left, don't delete it
                if (captions.docs.length === 1) {
                  // possibly update to previous timestamps, though
                  if (caption.get("startTime") > 0) {
                    caption.ref.set({
                      startTime: minValidTime(
                        caption.get("startTime") - initialCaptionDuration
                      ),
                      endTime: caption.get("endTime") - initialCaptionDuration
                    });
                  }
                  return;
                }

                // 2. focus our previous caption
                setFocus(i - 1);
                setActiveItem(i - 1);

                // 3. delete from firebase
                log("delete this caption");
                caption.ref.delete();
              }}
              onFocus={() => {
                setFocus(i);
                setActiveItem(i);
                onRequestSeek(caption.get("startTime"));
              }}
              onRequestUpdateTime={({ startTime, endTime }) => {
                // 1. update the time on firebase
                log("update time to: %s, %s", startTime, endTime);
                caption.ref.set(
                  {
                    startTime: minValidTime(startTime),
                    endTime: maxValidTime(endTime)
                  },
                  { merge: true }
                );
              }}
              onRequestSaveContent={(content: string) => {
                caption.ref.set({ content }, { merge: true });
              }}
              caption={caption}
              key={caption.id}
            />
          );
        })}
      </div>
    </animated.div>
  );
};

interface TimeArgs {
  startTime: number;
  endTime: number;
}

interface CaptionProps {
  caption: firebase.firestore.QueryDocumentSnapshot;
  focus: boolean;
  active: boolean;
  onRequestNext: () => void;
  onFocus: () => void;
  onRequestSaveContent: (value: string) => void;
  updateToNextTimeAllotment: () => void;
  onRequestDelete: () => void;
  onRequestUpdateTime: (time: TimeArgs) => void;
}

/**
 * Render an individual caption.
 *
 * This is basically a textarea which makes requests
 * to our parent component, depending upon the input.
 */

const Caption = ({
  caption,
  focus,
  onFocus,
  active,
  onRequestDelete,
  onRequestUpdateTime,
  onRequestNext,
  onRequestSaveContent,
  updateToNextTimeAllotment
}: CaptionProps) => {
  const theme = useTheme();
  const container = React.useRef<HTMLDivElement | null>(null);
  const textarea = React.useRef<HTMLInputElement | null>(null);
  const [value, setValue] = React.useState(caption.get("content"));

  // handle focus
  React.useEffect(() => {
    if (focus && textarea.current) {
      textarea.current.focus();
    }
  }, [focus]);

  React.useEffect(() => {
    if (!focus && active && container.current) {
      container.current!.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
  }, [active, focus]);

  // handle autosave
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRequestSaveContent(value);
    }, 1000);

    return () => clearTimeout(timer);
  }, [value]);

  // handle keydown shortcuts
  function onkeydown(e: React.KeyboardEvent) {
    const key = e.which;
    switch (key) {
      // return key
      case 13:
        if (e.metaKey) {
          break;
        }

        e.preventDefault();

        // if empty, update the startTime and endTime to the next
        // alloted start and endtime.
        if (!value.trim()) {
          updateToNextTimeAllotment();
          return;
        }

        // request next (either to create, or focus)
        onRequestNext();
        return;

      // delete key
      case 8:
        if (!value.trim()) {
          onRequestDelete();
          return;
        }
    }

    if (e.metaKey) {
      switch (key) {
        // command + p = Lengthen end time
        case 80:
          e.preventDefault();
          onRequestUpdateTime({
            startTime: caption.get("startTime"),
            endTime: caption.get("endTime") + 0.5
          });
          return;

        // command + o = shorten end time
        case 79:
          e.preventDefault();
          onRequestUpdateTime({
            startTime: caption.get("startTime"),
            endTime: caption.get("endTime") - 0.5
          });
          return;

        // command + i = add beginning time
        case 73:
          e.preventDefault();
          onRequestUpdateTime({
            startTime: caption.get("startTime") + 0.5,
            endTime: caption.get("endTime")
          });
          return;

        // command + u = subtract beginning time
        case 85:
          e.preventDefault();
          onRequestUpdateTime({
            startTime: caption.get("startTime") - 0.5,
            endTime: caption.get("endTime")
          });
          return;
      }
    }
  }

  return (
    <div
      ref={container}
      css={[
        {
          display: "flex",
          alignItems: "flex-start",
          paddingLeft: theme.spaces.md,
          position: "relative",
          transition: "background 0.15s ease",
          background: "transparent",
          marginTop: "-1px",
          marginBottom: "-1px"
        },
        active && {
          background: theme.colors.palette.gray.lightest,
          zIndex: 5
        }
      ]}
    >
      <label
        css={[
          {
            width: "100px",
            position: "relative",
            lineHeight: theme.lineHeights.body,
            paddingTop: `calc(${theme.spaces.sm} + 2px)`
          }
        ]}
        htmlFor={caption.id}
      >
        <Text
          muted
          variant="subtitle"
          css={{
            fontFamily: "helvetica"
          }}
        >
          {formatDuration(caption.get("startTime") * 1000)} -{" "}
          {formatDuration(caption.get("endTime") * 1000)}
        </Text>
      </label>
      <TextareaAutosize
        css={{
          border: "none",
          width: "100%",
          fontFamily: theme.fonts.base,
          color: theme.colors.text.muted,
          resize: "none",
          background: "transparent",
          lineHeight: theme.lineHeights.body,
          outline: "none",
          fontSize: theme.fontSizes[0],
          padding: `${theme.spaces.sm} 0`,
          paddingRight: theme.spaces.sm,
          marginLeft: theme.spaces.sm,
          borderBottom: `1px solid ${theme.colors.border.muted}`
        }}
        innerRef={(el: any) => (textarea.current = el)}
        id={caption.id}
        value={value}
        onFocus={onFocus}
        onBlur={e => {
          if (caption.get("content") !== e.currentTarget.value) {
            onRequestSaveContent(e.currentTarget.value);
          }
        }}
        onChange={e => setValue(e.currentTarget.value)}
        onKeyDown={onkeydown}
      />
    </div>
  );
};
