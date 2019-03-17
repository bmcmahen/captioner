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
  Divider
} from "sancho";
import { Link } from "react-router-dom";
import { Browser } from "./Browser";
import Helmet from "react-helmet";
import { useSession } from "./auth";

export interface BrandingProps {}

export const Branding: React.FunctionComponent<BrandingProps> = props => {
  const user = useSession();

  return (
    <React.Fragment>
      <Helmet title="Home" />
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
              component={Link}
              to="/new"
              intent="primary"
              iconAfter="arrow-right"
            >
              Start a new project
            </Button>
          </div>
        </Container>

        <Browser
          css={{
            display: "flex",
            justifyContent: "center",
            padding: theme.spaces.sm,
            paddingBottom: 0
          }}
        >
          <div
            css={{
              opacity: 1,
              // minWidth: "300px",
              width: "100%",
              minHeight: "150px",
              [theme.breakpoints.md]: {
                minHeight: "300px"
              },
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
            display: "none",
            [theme.breakpoints.md]: {
              display: "block"
            },
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
          <Text
            css={{
              textAlign: "center",
              padding: `${theme.spaces.xl} 0 `,
              paddingBottom: 0,
              color: theme.colors.palette.blue.base
            }}
            variant="display3"
          >
            Create subtitles in three simple steps
          </Text>
          <Column
            step={1}
            title="Select almost any video"
            content="Fiddleware subtitles supports loading local files from your computer, but you can also load videos from YouTube, Vimeo, Wistia, Facebook, Daily Motion, Twitch, and more. "
          />
          <Column
            step={2}
            title="Loop as you write your captions"
            content="You might be a fast typer, but chances are you'll need a few chances to get it right. Fiddleware Subtitles includes a loop mode which will repeat a section of video until you've got it down."
          />

          <Column
            step={3}
            title="Export to SRT"
            content="When you feel like you've got everything right, exporting to SRT is one click away. It doesn't get much easier than that. "
          />
          <Divider
            css={{ marginLeft: "auto", marginRight: "auto", width: "200px" }}
          />
          <div
            css={{
              marginTop: theme.spaces.lg,
              [theme.breakpoints.md]: {
                marginTop: theme.spaces.xl
              },
              textAlign: "center"
            }}
          >
            <Text variant="h5" css={{ color: theme.colors.palette.blue.base }}>
              Don't take our word for it. <br /> Try for free by creating your
              own project.
            </Text>
            <Button
              css={{
                marginBottom: theme.spaces.sm,
                marginTop: theme.spaces.md,
                [theme.breakpoints.md]: {
                  marginBottom: theme.spaces.xl,
                  marginTop: theme.spaces.md
                }
              }}
              size="lg"
              component={Link}
              to="/new"
              intent="primary"
              iconAfter="arrow-right"
            >
              Get started for free
            </Button>
          </div>
        </Container>
      </div>

      <div
        css={{
          background: theme.colors.background.tint1,
          marginTop: theme.spaces.lg,
          position: "relative",
          paddingBottom: `${theme.spaces.xl}`,
          [theme.breakpoints.md]: {
            marginTop: "100px"
          }
        }}
      >
        <svg
          css={{
            display: "none",
            [theme.breakpoints.md]: {
              display: "block"
            },
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
        <Container
          css={{
            paddingTop: theme.spaces.xl,
            [theme.breakpoints.md]: {
              paddingTop: 0
            },
            textAlign: "center"
          }}
        >
          <img
            src="https://pbs.twimg.com/profile_images/775452326450475009/MTsFSYGs_400x400.jpg"
            css={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
          <br />
          <br />
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

const Column = ({
  step,
  title,
  content
}: {
  step: number;
  title: string;
  content: string;
}) => {
  return (
    <div
      css={{
        maxWidth: "30rem",
        margin: "0 auto",
        textAlign: "center",
        marginBottom: theme.spaces.lg,
        [theme.breakpoints.lg]: {
          margin: theme.spaces.lg,
          marginTop: theme.spaces.xl,
          marginBottom: theme.spaces.xl,
          marginLeft: "auto",
          marginRight: "auto",
          flex: "1 1 33.333%"
        }
      }}
    >
      <Text
        css={{
          display: "inline-flex",
          background: theme.colors.background.tint2,
          borderRadius: "50%",
          width: "30px",
          marginBottom: theme.spaces.md,
          height: "30px",
          alignItems: "center",
          justifyContent: "center"
        }}
        variant="h6"
        muted
      >
        {step}
      </Text>
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
          css={{ fontWeight: 400, color: theme.colors.palette.blue.base }}
          variant="h5"
        >
          Fiddleware Subtitles
        </Text>
      </Link>
      <div css={{ flex: 1 }} />
      {user ? (
        <React.Fragment>
          {showDashboard && (
            <Button
              iconAfter="arrow-right"
              variant="ghost"
              size="lg"
              intent="primary"
              component={Link}
              to="/me"
            >
              My Projects
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
