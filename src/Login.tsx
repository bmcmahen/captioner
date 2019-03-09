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
  LayerLoading,
  Alert
} from "sancho";
import { loginWithGoogle, loginWithGithub, loginWithEmail } from "./auth";
import useReactRouter from "use-react-router";
import queryString from "query-string";
import { LoginLayout } from "./LoginLayout";

export interface LoginProps {}

export const Login: React.FunctionComponent<LoginProps> = props => {
  const { location } = useReactRouter();
  const qs = queryString.parse(location.search);
  const [isRegistering, setIsRegistering] = React.useState(
    typeof qs.register === "string"
  );

  const [loading, setLoading] = React.useState(false);
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);

  const { from } = location.state || { from: { pathname: "/me" } };

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
    <LoginLayout title={isRegistering ? "Register" : "Sign in"}>
      <Layer
        css={{
          marginTop: theme.spaces.xl,
          maxWidth: "425px",
          background: theme.colors.background.tint1,

          overflow: "hidden"
        }}
        elevation="sm"
      >
        <div
          css={{
            margin: `${theme.spaces.lg} 0`,
            display: "flex",
            justifyContent: "center",
            padding: theme.spaces.lg,
            paddingBottom: theme.spaces.sm
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
              Already have an account? <br />
              <Link
                onClick={e => {
                  e.preventDefault();
                  setIsRegistering(false);
                }}
                href="#"
              >
                Log in.
              </Link>
            </span>
          ) : (
            <span>
              Don't have an account? <br />
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
        {error && (
          <Alert
            css={{ marginTop: theme.spaces.md }}
            intent="danger"
            title="An error has occurred while logging in."
            subtitle="Please ensure that all of your details are correct and try again."
          />
        )}

        <div
          css={{
            padding: theme.spaces.lg,
            background: "white",
            marginTop: theme.spaces.xl,
            borderTop: "1px solid",
            borderColor: theme.colors.border.default
          }}
        >
          <Button
            onClick={login(loginWithGoogle)}
            css={{
              marginBottom: theme.spaces.md,
              width: "100%",
              display: "block"
            }}
            block
          >
            Sign {isRegistering ? "up" : "in"} with Google
          </Button>

          <div>
            <form onSubmit={loginEmail}>
              <Text muted css={{ textAlign: "center" }} variant="subtitle">
                Or sign {isRegistering ? "up" : "in"} using an email and
                password:
              </Text>
              <InputGroup hideLabel label="Email">
                <Input
                  onChange={e => {
                    setForm({ ...form, email: e.currentTarget.value });
                  }}
                  value={form.email}
                  inputSize="md"
                  type="email"
                  placeholder="Email"
                />
              </InputGroup>
              <InputGroup hideLabel label="Password">
                <Input
                  onChange={e => {
                    setForm({ ...form, password: e.currentTarget.value });
                  }}
                  value={form.password}
                  inputSize="md"
                  type="password"
                  placeholder="Password"
                />
              </InputGroup>
              <div css={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  disabled={!form.email || !form.password}
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
    </LoginLayout>
  );
};
