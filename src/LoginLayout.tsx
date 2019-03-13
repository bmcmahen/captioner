/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  theme,
  responsiveBodyPadding,
  Navbar,
  Toolbar,
  Breadcrumb,
  BreadcrumbItem,
  Link,
  Avatar,
  IconButton,
  Popover,
  MenuList,
  MenuItem,
  Text,
  Button
} from "sancho";
import { useSession, signOut } from "./auth";

export interface LoginLayoutProps {
  children?: React.ReactNode;
  title: string;
}

export const LoginLayout: React.FunctionComponent<LoginLayoutProps> = ({
  children,
  title
}) => {
  const user = useSession();
  return (
    <React.Fragment>
      <Global
        styles={{
          body: {
            backgroundAttachment: "fixed",
            backgroundColor: theme.colors.background.tint1
          }
        }}
      />
      <Navbar css={{ background: "white" }}>
        <Toolbar css={{ justifyContent: "space-between" }}>
          <div css={{ display: "flex", alignItems: "center" }}>
            <Breadcrumb
              css={{
                // background: theme.colors.background.tint1
                marginLeft: theme.spaces.md,
                background: theme.colors.background.tint1
              }}
            >
              <BreadcrumbItem>
                <Text variant="body">
                  <Link component={RouterLink} to="/">
                    Home
                  </Link>
                </Text>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Text variant="body" muted>
                  {title}
                </Text>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <UserPopover />
        </Toolbar>
      </Navbar>

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
