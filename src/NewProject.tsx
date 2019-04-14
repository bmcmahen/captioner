/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { Redirect } from "react-router";
import { Alert, Spinner, useTheme } from "sancho";
import { useCreateProject } from "./firebase";
import debug from "debug";
import { LoginLayout } from "./LoginLayout";

const log = debug("app:NewProject");

export interface NewProjectProps {}

export const NewProject: React.FunctionComponent<NewProjectProps> = props => {
  const { error, create } = useCreateProject();
  const [id, setId] = React.useState();
  const theme = useTheme();

  React.useEffect(() => {
    create()
      .then(doc => {
        setId(doc.id);
      })
      .catch(err => {
        log("Error: %s", err);
      });
  }, []);

  if (error) {
    return (
      <div
        css={{
          padding: theme.spaces.xl,
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Alert
          title="An error has stopped us from creating a new project"
          subtitle="Try reloading. If this problem persists, please contact us."
        />
      </div>
    );
  }

  if (!id) {
    return (
      <LoginLayout title="Creating project...">
        <Spinner label="Creating project..." center />
      </LoginLayout>
    );
  }

  return <Redirect to={id} />;
};
