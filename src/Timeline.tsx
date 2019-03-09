/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";

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

export interface TimelineProps {}

export const Timeline: React.FunctionComponent<TimelineProps> = props => {
  return <div>timeline</div>;
};
