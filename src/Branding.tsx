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
  Icon
} from "sancho";
import { Link } from "react-router-dom";
import { Browser } from "./Browser";
import Helmet from "react-helmet";
import { useSession } from "./auth";

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
          backgroundColor: theme.colors.palette.blue.lightest,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23579ad9' fill-opacity='0.17'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
                color: theme.colors.palette.blue.base,
                textAlign: "center"
              }}
            >
              Can making subtitles really be fun?
            </Text>

            <Text
              muted
              css={{ maxWidth: "38rem", margin: "0 auto" }}
              variant="lead"
            >
              Nope. But Fiddleware does help make subtitling as painless as
              possible. And it's free to try it out. So why not give it a go?
            </Text>

            <Button
              css={{ marginTop: theme.spaces.lg }}
              size="lg"
              intent="primary"
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
              background: theme.colors.background.tint1
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
          <NegativeMarginsContainer>
            <NegativeMarginsContainer
              css={{
                display: "block",
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
              <Column
                title="Some great attribute"
                content="Dolor veniam pariatur irure officia in. Nostrud magna laborum nostrud consectetur voluptate sunt consectetur et esse magna laboris. Est velit amet ullamco enim magna cupidatat esse ut laborum non aliquip. Non laborum sunt nulla sit consectetur sit non Lorem adipisicing. Laborum ad culpa enim amet tempor do."
              />
            </NegativeMarginsContainer>
          </NegativeMarginsContainer>
        </Container>
      </div>
      <Divider muted />
      <div css={{ padding: `${theme.spaces.xl} 0` }}>
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
        maxWidth: "38rem",
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

export const AnonNav = ({ user }: { user?: firebase.User }) => (
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
        <Text css={{ color: theme.colors.palette.blue.base }} variant="h6">
          Fiddleware Subtitles
        </Text>
      </Link>
      <div css={{ flex: 1 }} />
      {user ? (
        <Button variant="ghost" intent="primary" component={Link} to="/me">
          My Dashboard{" "}
          <Icon
            color={theme.colors.palette.blue.base}
            css={{ marginLeft: theme.spaces.md, color: "white" }}
            icon="arrow-right"
          />
        </Button>
      ) : (
        <React.Fragment>
          <Button
            component={Link}
            to="/login?register=true"
            variant="ghost"
            intent="primary"
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
        </React.Fragment>
      )}
    </Toolbar>
  </Navbar>
);
