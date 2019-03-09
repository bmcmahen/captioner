/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";

export interface EditorProps {}

export const Editor: React.FunctionComponent<EditorProps> = props => {
  return (
    <Layout>
      <div
        css={{
          gridArea: "video",
          background: "blue"
        }}
      />
      <div
        css={{
          gridArea: "editor",
          background: "red"
        }}
      >
        Editor
      </div>

      <div
        css={{
          gridArea: "timeline",
          background: "yellow"
        }}
      >
        Timeline
      </div>
    </Layout>
  );
};

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      css={css`
        height: 100vh;
        width: 100vw;
        display: grid;
        grid-template-rows: auto 150px;
        grid-template-areas:
          "video video editor editor"
          "timeline timeline timeline timeline";
      `}
    >
      {children}
    </div>
  );
}
