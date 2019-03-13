/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { Navbar, Toolbar, theme, Text, IconButton } from "sancho";

export interface EditorNavProps {
  loading?: boolean;
  title?: string;
}

export const EditorNav: React.FunctionComponent<EditorNavProps> = props => {
  return (
    <Navbar
      css={{
        boxShadow: "none",
        background: "transparent"
      }}
    >
      <Toolbar css={{ justifyContent: "space-between" }}>
        <div css={{ display: "flex", alignItems: "center" }}>
          <IconButton
            css={{ color: "white", marginRight: theme.spaces.sm }}
            icon="menu"
            size="lg"
            variant="ghost"
            label="Show menu"
          />
          {props.title && (
            <Text variant="h5" css={{ color: "white" }} gutter={false}>
              {props.title}
            </Text>
          )}
        </div>
        <div css={{ width: "36px" }} />
      </Toolbar>
    </Navbar>
  );
};
