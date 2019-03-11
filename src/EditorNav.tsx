/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { Navbar, Toolbar, theme } from "sancho";

export interface EditorNavProps {
  loading?: boolean;
}

export const EditorNav: React.FunctionComponent<EditorNavProps> = props => {
  return (
    <Navbar
      css={{
        boxShadow: "none",
        borderBottom: `1px solid ${theme.colors.border.default}`
      }}
    >
      <Toolbar>Hello</Toolbar>
    </Navbar>
  );
};
