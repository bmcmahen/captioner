/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import "./Browser.css";

interface BrowserProps extends React.HTMLAttributes<HTMLElement> {}

export function Browser({ children, ...other }: BrowserProps) {
  return (
    <div className="Browser" {...other}>
      <div className="browser-window">
        <div className="top-bar">
          <div className="circles">
            <div className="circle circle-red" />
            <div className="circle circle-yellow" />
            <div className="circle circle-green" />
          </div>
        </div>
        <div className="content ">{children}</div>
      </div>
    </div>
  );
}
