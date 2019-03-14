/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import * as React from "react";
import {
  theme,
  responsiveBodyPadding,
  Avatar,
  IconButton,
  Popover,
  MenuList,
  MenuItem
} from "sancho";
import { useSession, signOut } from "./auth";
import { AnonNav } from "./Branding";
import Helmet from "react-helmet";

export interface LoginLayoutProps {
  children?: React.ReactNode;
  title: string;
  showLogin?: boolean;
}

export const LoginLayout: React.FunctionComponent<LoginLayoutProps> = ({
  children,
  title,
  showLogin
}) => {
  const user = useSession();

  return (
    <React.Fragment>
      <Helmet title={title} />
      <Global
        styles={{
          body: {}
        }}
      />
      <AnonNav showLogin={showLogin} showDashboard={false} user={user} />

      <div
        css={[
          {
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
          },
          responsiveBodyPadding
        ]}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

export function UserPopover() {
  const user = useSession();

  if (!user) {
    return null;
  }

  return (
    <Popover
      content={
        <MenuList>
          <MenuItem onSelect={signOut}>Sign out</MenuItem>
        </MenuList>
      }
    >
      <IconButton
        variant="ghost"
        size="sm"
        icon={
          <Avatar
            size="sm"
            src={user.photoURL || undefined}
            name={user.displayName || user!.email || "?"}
          />
        }
        label={user.displayName || user!.email || "?"}
      />
    </Popover>
  );
}
