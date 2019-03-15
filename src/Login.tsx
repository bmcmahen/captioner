/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import * as React from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import {
  theme,
  Layer,
  Text,
  Button,
  Input,
  InputGroup,
  Icon,
  Link,
  LayerLoading,
  Alert,
  Container
} from "sancho";
import {
  loginWithGoogle,
  loginWithGithub,
  loginWithEmail,
  createUserWithEmail
} from "./auth";
import useReactRouter from "use-react-router";
import queryString from "query-string";
import { LoginLayout } from "./LoginLayout";
import { useSpring, animated, useTrail, config } from "react-spring";

const AnimatedLayer = animated(Layer) as any;

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
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({ email: "", password: "" });

  function login(fn: () => Promise<void>) {
    return async () => {
      try {
        setError("");
        setLoading(true);
        await fn();
        setRedirectToReferrer(true);
      } catch (err) {
        setLoading(false);
        setError(err.message || "Please try again.");
      }
    };
  }

  async function loginEmail(e: React.FormEvent) {
    e.preventDefault();

    const { email, password } = form;

    const fn = isRegistering ? createUserWithEmail : loginWithEmail;

    try {
      setError("");
      setLoading(true);
      await fn(email, password);
      setRedirectToReferrer(true);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Please try again.");
    }
  }

  const animation = useTrail(2, {
    config: config.slow,
    from: { opacity: 0, x: 5 },
    opacity: 1,
    x: 0
  });

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <LoginLayout
      showLogin={false}
      title={isRegistering ? "Register" : "Sign in"}
    >
      <Container>
        <div
          css={{
            marginTop: theme.spaces.xl,
            marginBottom: theme.spaces.lg,
            maxWidth: "30rem",
            marginLeft: "auto",
            marginRight: "auto",
            display: "block",
            [theme.breakpoints.lg]: {
              display: "flex",
              maxWidth: "950px"
            },
            alignItems: "center"
          }}
        >
          <animated.div
            style={animation[0]}
            css={{
              flex: "1 1 50%",
              [theme.breakpoints.lg]: {
                width: "50%",
                marginRight: theme.spaces.xl
              }
            }}
          >
            <Text
              css={{
                textAlign: "center",
                [theme.breakpoints.lg]: {
                  textAlign: "left"
                }
              }}
              variant="h1"
            >
              {isRegistering ? "Sign up to Fiddleware" : "Login to Fiddleware"}
            </Text>
            <Text
              css={{
                display: "block",
                textAlign: "center",
                [theme.breakpoints.lg]: {
                  textAlign: "left"
                }
              }}
              variant="lead"
              muted
            >
              Creating an account on Fiddleware is necessary to save your
              content. It's completely free, and we won't share your content
              with anyone.
              <br />
              <Text
                variant="body"
                css={{
                  display: "block",
                  marginTop: theme.spaces.md,
                  color: "inherit"
                }}
              >
                {isRegistering ? (
                  <span>
                    Already have an account? <br />
                    <Button
                      size="sm"
                      css={{
                        marginTop: theme.spaces.sm
                      }}
                      variant="outline"
                      onClick={e => {
                        setIsRegistering(false);
                      }}
                    >
                      Log in
                    </Button>
                  </span>
                ) : (
                  <span>
                    Don't have an account? <br />
                    <Button
                      size="sm"
                      css={{
                        marginTop: theme.spaces.sm
                      }}
                      variant="outline"
                      onClick={e => {
                        e.preventDefault();
                        setIsRegistering(true);
                      }}
                    >
                      Register here.
                    </Button>
                  </span>
                )}
              </Text>
            </Text>
          </animated.div>

          <AnimatedLayer
            style={animation[1]}
            css={{
              flex: "1 1 40%",
              marginTop: theme.spaces.xl,
              [theme.breakpoints.lg]: {
                marginTop: 0,
                width: "40%"
              },
              padding: theme.spaces.lg,
              background: "white"
            }}
          >
            {error && (
              <Alert
                css={{ marginBottom: theme.spaces.md }}
                intent="danger"
                title="An error has occurred while logging in."
                subtitle={error}
              />
            )}
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
            <LayerLoading loading={loading} />
          </AnimatedLayer>
        </div>
      </Container>
    </LoginLayout>
  );
};
