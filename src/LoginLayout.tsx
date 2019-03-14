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
  MenuItem,
  Toolbar,
  Tooltip
} from "sancho";
import { useSession, signOut } from "./auth";
import { AnonNav } from "./Branding";
import Helmet from "react-helmet";
import useRouter from "use-react-router";

export interface LoginLayoutProps {
  children?: React.ReactNode;
  title: string;
  showLogin?: boolean;
}

export const LoginLayout: React.FunctionComponent<LoginLayoutProps> = ({
  children,
  title
}) => {
  const router = useRouter();

  const goHome = React.useCallback(
    e => {
      e.preventDefault();
      router.history.push("/");
    },
    [router]
  );

  return (
    <React.Fragment>
      <Helmet title={title} />
      <Global
        styles={{
          body: {
            backgroundImage: `url(${require("./backgrounds/green.jpg")})`,
            backgroundSize: "cover"
          }
        }}
      />

      <Toolbar
        css={{
          display: "flex",
          position: "fixed",
          top: 0,
          left: 0
        }}
      >
        <Tooltip placement="right" content="Go home">
          <IconButton
            label="home"
            component="a"
            onClick={goHome}
            href="/"
            size="lg"
            variant="ghost"
            icon="arrow-left"
            color="white"
          />
        </Tooltip>
        <UserPopover />
      </Toolbar>

      <div
        css={[
          {
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
          }
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
    <div css={{ display: "flex", alignItems: "center" }}>
      <div
        css={{
          width: "2px",
          height: "18px",
          margin: `0 ${theme.spaces.sm}`,
          background: "rgba(255,255,255,0.3)"
        }}
      />
      <Popover
        content={
          <MenuList>
            <MenuItem onSelect={signOut}>Sign out</MenuItem>
          </MenuList>
        }
      >
        <IconButton
          variant="ghost"
          size="lg"
          color="white"
          icon={"user"}
          label={user.displayName || user!.email || "?"}
        />
      </Popover>
    </div>
  );
}

{
  /* <Avatar
size="xs"
src={user.photoURL || undefined}
name={user.displayName || user!.email || "?"}
/> */
}
