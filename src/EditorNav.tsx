/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { Navbar, Toolbar, Breadcrumbs, BreadcrumbItem } from "sancho";
import { UserPopover } from "./LoginLayout";

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
          {/* <IconButton
            css={{ marginRight: theme.spaces.sm }}
            icon="menu"
            color="white"
            size="lg"
            variant="ghost"
            label="Show menu"
          /> */}
          <Breadcrumbs>
            <BreadcrumbItem inverted>Projects</BreadcrumbItem>
            <BreadcrumbItem inverted>{props.title}</BreadcrumbItem>
          </Breadcrumbs>

          {/* {props.title && (
            <Text variant="h5" css={{ color: "white" }} gutter={false}>
              {props.title}
            </Text>
          )} */}
        </div>

        <UserPopover />
      </Toolbar>
    </Navbar>
  );
};
