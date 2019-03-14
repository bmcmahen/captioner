/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import * as React from "react";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { userContext } from "./user-context";
import { Spinner, theme } from "sancho";
import { BrowserRouter } from "react-router-dom";
import debug from "debug";
import { Routes } from "./Routes";

if (process.env.NODE_ENV !== "production") {
  debug.enable("app:*");
}

export interface AppProps {}

export const App: React.FunctionComponent<AppProps> = props => {
  const { initialising, user } = useAuthState(firebase.auth());

  return (
    <React.Fragment>
      <Global
        styles={{
          body: {
            padding: 0,
            margin: 0,
            backgroundAttachment: "fixed",
            backgroundColor: theme.colors.palette.blue.lightest,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23579ad9' fill-opacity='0.17'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }
        }}
      />
      <userContext.Provider
        value={{
          user: user
        }}
      >
        {initialising ? (
          <Spinner />
        ) : (
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        )}
      </userContext.Provider>
    </React.Fragment>
  );
};

export default App;
