/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { useSession } from "./auth";
import firebase from "firebase/app";
import { Redirect } from "react-router";
import { Alert, Spinner, theme } from "sancho";

export interface NewProjectProps {}

export const NewProject: React.FunctionComponent<NewProjectProps> = props => {
  const user = useSession();
  const [id, setId] = React.useState();
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      console.error("No user is present");
      setError(true); // this should never be the case
      return;
    }

    firebase
      .firestore()
      .collection("captions")
      .add(projectFactory(user.uid))
      .then(value => {
        setId(value.id);
      })
      .catch(err => {
        console.error(err);
        setError(true);
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
    return <Spinner />;
  }

  return <Redirect to={id} />;
};

function projectFactory(uid: string) {
  return {
    createdAt: new Date(),
    updatedAt: new Date(),
    uid
  };
}
