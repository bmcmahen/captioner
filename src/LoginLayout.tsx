/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import * as React from "react";
import {
  theme,
  IconButton,
  Popover,
  MenuList,
  MenuItem,
  Toolbar,
  Tooltip,
  Button
} from "sancho";
import { useSession, signOut } from "./auth";
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
            backgroundColor: "#7fddc7",
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
            flexDirection: "column",
            justifyContent: "center",
            marginTop: "0",
            [theme.breakpoints.lg]: {
              marginTop: "-50px"
            },
            minHeight: "100vh"
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
        <Button
          variant="ghost"
          size="lg"
          css={{ color: "white" }}
          iconBefore={"user"}
          iconAfter="chevron-down"
        >
          {user.displayName || user!.email}
        </Button>
      </Popover>
    </div>
  );
}
