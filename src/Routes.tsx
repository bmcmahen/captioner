/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { Switch, Route, Redirect } from "react-router";
import { Login } from "./Login";
import { Editor } from "./Editor";
import { Branding } from "./Branding";
import { useSession } from "./auth";
import { NewProject } from "./NewProject";
import { Me } from "./Me";

export interface RoutesProps {}

export const Routes: React.FunctionComponent<RoutesProps> = props => {
  return (
    <Switch>
      <Route exact path="/" component={Branding} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/me" component={Me} />
      <PrivateRoute path="/new" component={NewProject} />
      <PrivateRoute path="/:id" component={Editor} />
      <Route component={Branding} /> {/* not found: to do */}
    </Switch>
  );
};

/**
 * A route that requires a user session
 */

interface PrivateRouteProps {
  component: any;
  path?: string;
  [key: string]: any;
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
