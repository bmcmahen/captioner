/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import * as React from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import {
  theme,
  Layer,
  Text,
  Button,
  Divider,
  Input,
  InputGroup,
  Icon,
  Link,
  responsiveBodyPadding,
  Navbar,
  Toolbar,
  Breadcrumb,
  BreadcrumbItem,
  LayerLoading
} from "sancho";
import { loginWithGoogle, loginWithGithub, loginWithEmail } from "./auth";
import useReactRouter from "use-react-router";
import queryString from "query-string";

export interface LoginProps {}

export const Login: React.FunctionComponent<LoginProps> = props => {
  const { location } = useReactRouter();
  const qs = queryString.parse(location.search);
  const [isRegistering, setIsRegistering] = React.useState(
    typeof qs.register === "string"
  );

  const [loading, setLoading] = React.useState(false);
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);

  const { from } = location.state || { from: { pathname: "/new" } };

  // logging in errors
  const [error, setError] = React.useState(false);
  const [form, setForm] = React.useState({ email: "", password: "" });

  function login(fn: () => Promise<void>) {
    return async () => {
      try {
        setError(false);
        setLoading(true);
        await fn();
        setRedirectToReferrer(true);
      } catch (err) {
        setLoading(false);
        setError(true);
      }
    };
  }

  async function loginEmail(e: React.FormEvent) {
    e.preventDefault();

    const { email, password } = form;

    try {
      setError(false);
      setLoading(true);
      await loginWithEmail(email, password);
      setRedirectToReferrer(true);
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  }

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <React.Fragment>
      <Global
        styles={{
          body: {
            backgroundAttachment: "fixed",
            backgroundColor: theme.colors.palette.blue.lightest,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23579ad9' fill-opacity='0.17'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }
        }}
      />
      <Navbar css={{ background: "transparent", boxShadow: "none" }}>
        <Toolbar>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link href="/">Fiddleware Subtitles</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              {isRegistering ? "Register" : "Sign in"}
            </BreadcrumbItem>
          </Breadcrumb>
        </Toolbar>
      </Navbar>
      <div
        css={[
          {
            display: "flex",
            justifyContent: "center"
          },
          responsiveBodyPadding
        ]}
      >
        <Layer
          css={{
            marginTop: theme.spaces.xl,
            maxWidth: "425px",
            padding: theme.spaces.lg
          }}
          elevation="sm"
        >
          <div
            css={{
              margin: `${theme.spaces.lg} 0`,
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Icon icon="log-in" size={40} />
          </div>
          <Text css={{ textAlign: "center" }} variant="h3">
            {isRegistering ? "Sign up to Fiddleware" : "Login to Fiddleware"}
          </Text>
          <Text
            css={{ textAlign: "center", display: "block" }}
            variant="body"
            muted
          >
            You can log in to Fiddleware using one of the below methods.{" "}
            {isRegistering ? (
              <span>
                Already have an account?{" "}
                <Link
                  onClick={e => {
                    e.preventDefault();
                    setIsRegistering(false);
                  }}
                  href="#"
                >
                  Login in.
                </Link>
              </span>
            ) : (
              <span>
                Don't have an account?{" "}
                <Link
                  onClick={e => {
                    e.preventDefault();
                    setIsRegistering(true);
                  }}
                  href="#"
                >
                  Register here.
                </Link>
              </span>
            )}
          </Text>
          <Divider css={{ marginTop: theme.spaces.lg }} />
          <div
            css={{
              marginTop: theme.spaces.md
            }}
          >
            <div css={{ display: "flex" }}>
              <Button onClick={login(loginWithGoogle)} css={{ flex: 1 }}>
                Sign {isRegistering ? "up" : "in"} with Google
              </Button>
              <div css={{ display: "inline-block", width: theme.spaces.sm }} />
              <Button onClick={login(loginWithGithub)} css={{ flex: 1 }}>
                Sign {isRegistering ? "up" : "in"} with Github
              </Button>
            </div>
            <Divider />
            <div>
              <form onSubmit={loginEmail}>
                <Text muted variant="subtitle">
                  Sign {isRegistering ? "up" : "in"} using an email and
                  password:
                </Text>
                <InputGroup hideLabel label="Email">
                  <Input inputSize="md" type="email" placeholder="Email" />
                </InputGroup>
                <InputGroup hideLabel label="Password">
                  <Input
                    inputSize="md"
                    type="password"
                    placeholder="Password"
                  />
                </InputGroup>
                <div css={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    css={{ marginLeft: "auto", marginTop: theme.spaces.md }}
                    type="submit"
                    size="md"
                    intent="primary"
                  >
                    Sign {isRegistering ? "up" : "in"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <LayerLoading loading={loading} />
        </Layer>
      </div>
    </React.Fragment>
  );
};
