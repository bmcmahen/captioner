/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import * as React from "react";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { userContext } from "./user-context";
import { Spinner } from "sancho";
import { Route, Redirect, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Login } from "./Login";
import { Editor } from "./Editor";
import { Branding } from "./Branding";
import { useSession } from "./auth";
import { NewProject } from "./NewProject";
import { Me } from "./Me";
import debug from "debug";

if (process.env.NODE_ENV !== "production") {
  debug.enable("app:*");
}

export interface AppProps {}

export const App: React.FunctionComponent<AppProps> = props => {
  const { initialising, user } = useAuthState(firebase.auth());

  if (initialising) {
    return <Spinner />;
  }

  return (
    <React.Fragment>
      <Global
        styles={{
          body: {
            padding: 0,
            margin: 0
          }
        }}
      />
      <userContext.Provider
        value={{
          user: user
        }}
      >
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Branding} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/me" component={Me} />
            <PrivateRoute path="/new" component={NewProject} />
            <PrivateRoute path="/:id" component={Editor} />
            <Route component={() => <div>Not found</div>} />
          </Switch>
        </BrowserRouter>
      </userContext.Provider>
    </React.Fragment>
  );
};

interface PrivateRouteProps {
  component: any;
  path?: string;
}

const PrivateRoute = ({
  component: Component,
  ...other
}: PrivateRouteProps) => {
  const user = useSession();
  return (
    <Route
      {...other}
      render={props => {
        if (user) {
          return <Component user={user} {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          );
        }
      }}
    />
  );
};

export default App;
