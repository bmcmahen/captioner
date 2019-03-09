/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Video } from "./Video";
import { Captions } from "./Captions";
import { theme, useCollapse } from "sancho";
import { useDocument } from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import debug from "debug";

const log = debug("app:Editor");

export interface EditorProps {
  id: string;
}

export const Editor: React.FunctionComponent<EditorProps> = ({ id }) => {
  const state = useDocument(firebase.firestore().doc(`captions/${id}`));

  return (
    <Layout>
      <div
        css={{
          gridArea: "video"
        }}
      >
        <Video />
      </div>
      <div
        css={{
          gridArea: "editor",
          background: "white"
        }}
      >
        <Captions captions={[]} />
      </div>

      <div
        css={{
          gridArea: "timeline",
          background: theme.colors.background.tint2
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
        grid-template-columns: 25% 25% 25% 25%;
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
