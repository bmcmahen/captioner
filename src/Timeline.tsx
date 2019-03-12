/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import throttle from "lodash.throttle";
import { theme, Tooltip } from "sancho";
import { useTransition, animated, useSpring, config } from "react-spring";
import map from "./interpolate-color";
import formatDuration from "format-duration";
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
  onRequestSeek: (seconds: number, blur: boolean) => void;
  onRequestSkip: (i: number) => void;
}

export const Timeline: React.FunctionComponent<TimelineProps> = ({
  captions,
  duration,
  onRequestSkip,
  currentTime,
  onRequestSeek
}) => {
  const [rect, setRect] = React.useState<ClientRect | null>(null);
  const [hover, setHover] = React.useState(false);
  const [mouse, setMouse] = React.useState(0);

  const container = React.useRef<HTMLDivElement>(null);
  const width = linearConversion([0, duration], [0, rect ? rect.width : 0]);
  const height = linearConversion([0, 5], [40, 100]);

  const cap = (num: number) => {
    if (num > 100) return 90;
    return num;
  };

  const onResize = throttle(() => {
    setRect(container.current!.getBoundingClientRect());
  }, 100);

  React.useEffect(() => {
    setRect(container.current!.getBoundingClientRect());
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

  const spring = useSpring({
    width: currentTime ? width(currentTime) : 0
  });

  function onMouseMove(e: React.MouseEvent) {
    if (!rect || !duration) return;

    const target = e.target as SVGElement;
    if (target.hasAttribute("data-caption")) {
      setMouse(0);
      return;
    }

    setMouse(getRelativeClickPosition(e));
  }

  function getRelativeClickPosition(e: React.MouseEvent) {
    const left = e.clientX - 16;
    const w = rect!.width;
    return (left / w) * duration;
  }

  function skipToPoint(e: React.MouseEvent) {
    onRequestSeek(getRelativeClickPosition(e), true);
  }

  return (
    <div
      ref={container}
      css={{
        padding: "16px",
        boxSizing: "border-box",
        height: "100%",
        width: "100%"
      }}
    >
      <div
        css={{
          borderRadius: theme.radii.lg,
          background: theme.colors.palette.gray.light,
          width: "100%",
          position: "relative",
          overflow: "hidden",
          height: "100%",
          ":after": {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: theme.radii.lg,
            boxShadow: "inset 0 0 5px #0000001f",
            content: '""',
            pointerEvents: "none"
          }
        }}
      >
        {container.current && (
          <svg
            shapeRendering="crispEdges"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={skipToPoint}
            onMouseMove={onMouseMove}
            css={{
              height: "100%",
              position: "relative",
              width: "100%",
              transition: "height 0.25s ease, fill 0.25s ease"
            }}
          >
            {/* current time indicator */}
            <animated.rect
              x={0}
              y={0}
              height={100}
              style={spring}
              fill="#c0c8d0"
            />

            {/* click to skip hover indicator */}
            {mouse && (
              <g
                aria-hidden={!hover}
                style={{
                  opacity: hover ? 1 : 0,
                  transition: "opacity 0.2s ease"
                }}
              >
                <animated.rect
                  x={width(mouse)}
                  height={100}
                  y={0}
                  width={3}
                  fill="rgba(255,255,255,0.2)"
                />
                <animated.text
                  style={{
                    cursor: "default",
                    color: "white",
                    fontWeight: "bold",
                    fontFamily: "helvetica, sans-serif",
                    fontSize: "0.7rem"
                  }}
                  y={16}
                  fill="rgba(255,255,255,0.5)"
                  x={width(mouse) + 10}
                >
                  {formatDuration(mouse * 1000)}
                </animated.text>
              </g>
            )}

            {/* captions */}
            {transitions.map(({ item, key, props }, i) => {
              return (
                <Tooltip key={key} content={item.get("content")}>
                  <animated.rect
                    data-caption
                    onClick={e => {
                      e.stopPropagation();
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
                      0.3
                    }
                    height={cap(height(wpm(item)))}
                  />
                </Tooltip>
              );
            })}
          </svg>
        )}
      </div>
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

  if (rate > 3.1) {
    return theme.colors.intent.danger.base;
  }

  return map(rate / 3.1);

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
