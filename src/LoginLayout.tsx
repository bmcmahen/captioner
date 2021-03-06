/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import * as React from "react";
import {
  Popover,
  MenuList,
  MenuItem,
  Toolbar,
  Button,
  useResponsiveBodyPadding,
  useTheme,
  IconChevronDown,
  IconUser,
  IconArrowLeft
} from "sancho";
import { useSession, signOut } from "./auth";
import Helmet from "react-helmet";
import useRouter from "use-react-router";
import { Link } from "react-router-dom";

export interface LoginLayoutProps {
  children?: React.ReactNode;
  title: string;
  showLogin?: boolean;
}

export const LoginLayout: React.FunctionComponent<LoginLayoutProps> = ({
  children,
  title
}) => {
  const theme = useTheme();
  const router = useRouter();
  const responsiveBodyPadding = useResponsiveBodyPadding();

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
            backgroundImage: `url(${require("./backgrounds/skyline.jpg")})`,
            backgroundSize: "cover",
            backgroundAttachment: "fixed"
          }
        }}
      />

      <Toolbar
        css={{
          display: "flex",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          justifyContent: "space-between"
        }}
      >
        <Button
          component={Link}
          variant="ghost"
          to="/"
          intent="primary"
          iconBefore={<IconArrowLeft />}
          // css={{ color: "white" }}
          size="lg"
        >
          Home
        </Button>

        <UserPopover />
      </Toolbar>

      <div
        css={[
          {
            display: "flex",
            ...responsiveBodyPadding,
            marginTop: "0",
            [theme.mediaQueries.md]: {
              marginTop: "-50px",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center"
            }
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
          intent="primary"
          iconBefore={<IconUser />}
          iconAfter={<IconChevronDown />}
        >
          {user.displayName || user!.email}
        </Button>
      </Popover>
    </div>
  );
}
