/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import {
  theme,
  Navbar,
  Toolbar,
  Text,
  Button,
  Link as Anchor,
  Container,
  NegativeMarginsContainer,
  Divider,
  Icon,
  Popover,
  MenuList,
  MenuItem
} from "sancho";
import { Link } from "react-router-dom";
import { Browser } from "./Browser";
import Helmet from "react-helmet";
import { useSession, signOut } from "./auth";
import { UserPopover } from "./LoginLayout";

export interface BrandingProps {}

export const Branding: React.FunctionComponent<BrandingProps> = props => {
  const bg = theme.colors.palette.blue.light;
  const text = theme.colors.palette.blue.dark;

  const user = useSession();

  return (
    <React.Fragment>
      <Helmet title="Fiddleware Subtitles - Create subtitles for your videos" />
      <AnonNav user={user} />
      <div
        css={{
          backgroundAttachment: "fixed",

          backgroundImage: `url(${require("./backgrounds/skyline.jpg")})`,
          backgroundSize: "cover",
          paddingTop: "60px",
          minHeight: "300px",
          width: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Container
          css={{
            textAlign: "center"
          }}
        >
          <div css={{ padding: `4.5rem 0` }}>
            <Text
              variant="display2"
              css={{
                color: theme.colors.text.selected,
                textAlign: "center"
              }}
            >
              Can making subtitles really be fun?
            </Text>

            <Text
              css={{
                // color: "rgba(255,255,255,0.75)",
                maxWidth: "38rem",
                margin: "0 auto"
              }}
              muted
              variant="lead"
            >
              Nope. But Fiddleware does help make subtitling as painless as
              possible. And it's free to try it out. So why not give it a go?
            </Text>

            <Button
              css={{ marginTop: theme.spaces.lg }}
              size="lg"
              intent="primary"
              iconAfter="arrow-right"
            >
              Start a new project
            </Button>
          </div>
        </Container>

        <Browser
          css={{
            marginBottom: "-20px",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <div
            css={{
              opacity: 1,
              minWidth: "700px",
              minHeight: "300px",
              backgroundImage: `url(${require("./backgrounds/thumbnail.jpg")})`,
              backgroundSize: "cover",
              backgroundPositionY: "-2px"
            }}
          />
        </Browser>
      </div>

      <div
        css={{
          background: "white",
          minHeight: "200px",
          zIndex: 10,
          position: "relative"
        }}
      >
        <svg
          css={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            fill: "white"
          }}
          id="bigHalfCircle"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="100%"
          height="100"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0 100 C40 0 60 0 100 100 Z" />
        </svg>
        <Container>
          <NegativeMarginsContainer
            css={{
              display: "block",
              justifyContent: "space-evenly",
              [theme.breakpoints.lg]: { display: "flex" }
            }}
          >
            <Column
              title="Some great attribute"
              content="Dolor veniam pariatur irure officia in. Nostrud magna laborum nostrud consectetur voluptate sunt consectetur et esse magna laboris. Est velit amet ullamco enim magna cupidatat esse ut laborum non aliquip. Non laborum sunt nulla sit consectetur sit non Lorem adipisicing. Laborum ad culpa enim amet tempor do."
            />
            <Column
              title="Some great attribute"
              content="Dolor veniam pariatur irure officia in. Nostrud magna laborum nostrud consectetur voluptate sunt consectetur et esse magna laboris. Est velit amet ullamco enim magna cupidatat esse ut laborum non aliquip. Non laborum sunt nulla sit consectetur sit non Lorem adipisicing. Laborum ad culpa enim amet tempor do."
            />
          </NegativeMarginsContainer>
        </Container>
      </div>

      <div
        css={{
          background: theme.colors.background.tint1,
          marginTop: "100px",
          position: "relative",
          paddingBottom: `${theme.spaces.xl}`
        }}
      >
        <svg
          css={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            fill: theme.colors.background.tint1
          }}
          id="bigHalfCircle"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="100%"
          height="100"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0 100 C40 0 60 0 100 100 Z" />
        </svg>
        <Container css={{ textAlign: "center" }}>
          <Text css={{ fontSize: theme.sizes[0] }}>
            Made with ☕ by{" "}
            <Anchor href="http://benmcmahen.com">Ben McMahen</Anchor>
          </Text>
          <br />
          <Text css={{ fontSize: theme.sizes[0] }}>
            View the <Anchor href="http://benmcmahen.com">source</Anchor> on
            Github
          </Text>
        </Container>
      </div>
    </React.Fragment>
  );
};

const Column = ({ title, content }: { title: string; content: string }) => {
  return (
    <div
      css={{
        maxWidth: "28rem",
        margin: "0 auto",
        marginBottom: theme.spaces.xl,
        [theme.breakpoints.lg]: {
          margin: theme.spaces.lg,
          marginTop: theme.spaces.xl,
          marginBottom: theme.spaces.xl,
          flex: "1 1 33.333%"
        }
      }}
    >
      <Text variant="h4" css={{ marginBottom: theme.spaces.md }}>
        {title}
      </Text>
      <Text muted css={{ color: theme.colors.text.muted }}>
        {content}
      </Text>
    </div>
  );
};

export const AnonNav = ({
  user,
  showDashboard = true,
  showLogin = true
}: {
  showDashboard?: boolean;
  user?: firebase.User;
  showLogin?: boolean;
}) => (
  <Navbar
    css={{
      boxShadow: "none",
      position: "absolute",
      color: theme.colors.palette.blue.dark,
      background: "transparent"
    }}
  >
    <Toolbar>
      <Link css={{ textDecoration: "none" }} to="/">
        <Text
          gutter={false}
          css={{ color: theme.colors.palette.blue.base }}
          variant="h6"
        >
          Fiddleware Subtitles
        </Text>
      </Link>
      <div css={{ flex: 1 }} />
      {user ? (
        <React.Fragment>
          {showDashboard && (
            <Button variant="ghost" intent="primary" component={Link} to="/me">
              My Projects{" "}
              <Icon
                color={theme.colors.palette.blue.base}
                css={{ marginLeft: theme.spaces.sm }}
                icon="arrow-right"
              />
            </Button>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {showLogin && (
            <>
              <Button
                component={Link}
                to="/login?register=true"
                variant="ghost"
                css={{
                  display: "none",
                  [theme.breakpoints.md]: {
                    display: "block"
                  },
                  marginRight: theme.spaces.md
                }}
              >
                Register
              </Button>
              <Button intent="primary" component={Link} to="/login">
                Login
              </Button>
            </>
          )}
        </React.Fragment>
      )}
    </Toolbar>
  </Navbar>
);
