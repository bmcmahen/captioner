/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import TextareaAutosize from "react-autosize-textarea";
import { Text } from "sancho";
import debug from "debug";

const log = debug("app:Captions");

interface Caption {
  id: string;
  startTime: number;
  endTime: number;
  content: string;
}

export interface CaptionsProps {
  captions: Caption[];
  onRequestSeek: (seconds: number) => void;
}

export const Captions: React.FunctionComponent<CaptionsProps> = ({
  captions
}) => {
  const [focus, setFocus] = React.useState(0);

  return (
    <div
      css={{
        width: "100%",
        height: "100%",
        overflowY: "scroll",
        WebkitOverflowScrolling: "touch"
      }}
    >
      {captions.map((caption, i) => {
        return (
          <Caption
            focus={i === focus}
            onRequestNext={() => {
              log("request next");
              // 1. If another caption exists after this one, focus it
              // 2. Otherwise, insert a new empty caption and focus it.
            }}
            updateToNextTimeAllotment={() => {
              // 1. endTime + standard duration
              log("update to next time allotment");
            }}
            onRequestDelete={() => {
              // 1. if there's only one caption left, don't delete it
              // 2. focus our previous caption
              // 3. delete from firebase
              log("delete this caption");
            }}
            onRequestUpdateTime={({ startTime, endTime }) => {
              // 1. update the time on firebase
              log("update time to: %s, %s", startTime, endTime);
            }}
            caption={caption}
            key={caption.id}
          />
        );
      })}
    </div>
  );
};

interface TimeArgs {
  startTime: number;
  endTime: number;
}

interface CaptionProps {
  caption: Caption;
  focus: boolean;
  onRequestNext: () => void;
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
  onRequestDelete,
  onRequestUpdateTime,
  onRequestNext,
  updateToNextTimeAllotment
}: CaptionProps) => {
  const textarea = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState(caption.content);

  // handle focus
  React.useEffect(() => {
    if (focus && textarea.current) {
      textarea.current.focus();
    }
  }, [focus]);

  // handle autosave
  React.useEffect(() => {
    const timer = setTimeout(() => {
      console.log("save");
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
            startTime: caption.startTime,
            endTime: caption.endTime + 0.5
          });
          return;

        // command + o = shorten end time
        case 79:
          e.preventDefault();
          onRequestUpdateTime({
            startTime: caption.startTime,
            endTime: caption.endTime - 0.5
          });
          return;

        // command + i = add beginning time
        case 73:
          e.preventDefault();
          onRequestUpdateTime({
            startTime: caption.startTime + 0.5,
            endTime: caption.endTime
          });
          return;

        // command + u = subtract beginning time
        case 85:
          e.preventDefault();
          onRequestUpdateTime({
            startTime: caption.startTime - 0.5,
            endTime: caption.endTime
          });
          return;
      }
    }
  }

  return (
    <div css={{ display: "flex" }}>
      <label htmlFor={caption.id}>
        <Text variant="subtitle">
          {caption.startTime} - {caption.endTime}
        </Text>
      </label>
      <TextareaAutosize
        innerRef={textarea as any}
        id={caption.id}
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
        onKeyDown={onkeydown}
      />
    </div>
  );
};

function minValidTime(time: number) {
  if (time < 0) return 0;
  return time;
}

function maxValidTime(duration: number, time: number) {
  if (time > duration) return duration;
  return time;
}
