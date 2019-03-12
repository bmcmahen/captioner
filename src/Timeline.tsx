/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import throttle from "lodash.throttle";
import { theme, Tooltip } from "sancho";
import { useTransition, animated } from "react-spring";
import map from "./interpolate-color";
import color from "color";

/**
 *  Provide an iMovie style visualization of the subtitles.
 *  Attributes worth showing:
 *  - width (indicates duration)
 *  - height (indicates letter count)
 *  - if the ratio of the height / width is too high, provide a colour warning (good, warning, danger)
 *  - Current time
 *
 *  Interactions
 *  - click item to skip to it
 *  - click part of the timeline to skip to it
 *  - zoomable and scrollable
 */

export interface TimelineProps {
  captions: firebase.firestore.QuerySnapshot;
  duration: number;
  currentTime?: number;
  onRequestSeek: (seconds: number) => void;
  onRequestSkip: (i: number) => void;
}

export const Timeline: React.FunctionComponent<TimelineProps> = ({
  captions,
  duration,
  onRequestSkip,
  currentTime,
  onRequestSeek
}) => {
  const [w, setWidth] = React.useState(0);

  const container = React.useRef<HTMLDivElement>(null);
  const width = linearConversion([0, duration], [0, container.current ? w : 0]);
  const height = linearConversion([0, 5], [30, 100]);

  const cap = (num: number) => {
    if (num > 100) return 100;
    return num;
  };

  const onResize = throttle(() => {
    setWidth(container.current!.clientWidth);
  }, 100);

  React.useEffect(() => {
    setWidth(container.current!.clientWidth);

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("reize", onResize);
  }, []);

  function wpm(caption: firebase.firestore.QueryDocumentSnapshot) {
    const content = caption.get("content");
    const len = content.split(" ").length;
    const duration = caption.get("endTime") - caption.get("startTime");
    return len / duration;
  }

  const transitions = useTransition(captions.docs, item => item.id, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  return (
    <div ref={container} css={{ height: "100%", width: "100%" }}>
      {container.current && (
        <svg
          viewBox={`0 0 ${width} 1050`}
          css={{ height: "100%", width: "100%" }}
        >
          {transitions.map(({ item, key, props }, i) => {
            return (
              <Tooltip key={key} content={item.get("content")}>
                <animated.rect
                  onClick={() => {
                    onRequestSkip(i);
                  }}
                  style={props}
                  css={{
                    transition: "height 0.2s ease",
                    cursor: "pointer",
                    ":hover": {
                      fill: color(getColor(wpm(item), false))
                        .lighten(0.2)
                        .toString()
                    }
                  }}
                  key={key}
                  x={width(item.get("startTime"))}
                  y={100 - cap(height(wpm(item)))}
                  fill={getColor(wpm(item), false)}
                  width={
                    width(item.get("endTime")) -
                    width(item.get("startTime")) +
                    1
                  }
                  height={cap(height(wpm(item)))}
                />
              </Tooltip>
            );
          })}
        </svg>
      )}
    </div>
  );
};

function linearConversion(a: [number, number], b: [number, number]) {
  var o = a[1] - a[0],
    n = b[1] - b[0];

  return function(x: number) {
    return ((x - a[0]) * n) / o + b[0];
  };
}

function getColor(rate: number, active: boolean) {
  // 1 == 3.1

  // return map(rate / 3.1);

  if (rate <= 2.3)
    return active
      ? theme.colors.intent.success.dark
      : theme.colors.intent.success.base; // good
  if (rate > 2.3 && rate < 3.1)
    return active
      ? theme.colors.intent.warning.dark
      : theme.colors.intent.warning.base; // warning
  return active
    ? theme.colors.intent.danger.dark
    : theme.colors.intent.danger.base; // danger
}
