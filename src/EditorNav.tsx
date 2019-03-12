/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { Navbar, Toolbar, theme, Text } from "sancho";

export interface EditorNavProps {
  loading?: boolean;
  title?: string;
}

export const EditorNav: React.FunctionComponent<EditorNavProps> = props => {
  return (
    <Navbar
      css={{
        boxShadow: "none",
        background: theme.colors.background.tint1
      }}
    >
      <Toolbar>
        {props.title && (
          <Text variant="h5" gutter={false}>
            {props.title}
          </Text>
        )}
      </Toolbar>
    </Navbar>
  );
};
