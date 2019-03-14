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
            minHeight: "100vh"
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
