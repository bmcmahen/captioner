/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { LoginLayout } from "./LoginLayout";
import { useSession } from "./auth";
import {
  Layer,
  Toolbar,
  Button,
  Text,
  Navbar,
  theme,
  Spinner,
  Alert,
  ListItem,
  Icon,
  List,
  LayerLoading,
  toast
} from "sancho";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import { useCreateProject } from "./firebase";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

export interface MeProps {}

export const Me: React.FunctionComponent<MeProps> = props => {
  const user = useSession();
  const [newProjectId, setNewProjectId] = React.useState();

  const { error, loading, value } = useCollection(
    firebase
      .firestore()
      .collection("captions")
      .where("uid", "==", user!.uid)
  );

  const { loading: creatingProject, create } = useCreateProject();

  function createProject() {
    create()
      .then(result => {
        setNewProjectId(result.id);
      })
      .catch(err => {
        toast({
          title: "An error occurred while creating your project",
          subtitle: err.message || "Please try again.",
          intent: "danger"
        });
      });
  }

  if (newProjectId) {
    return <Redirect to={newProjectId} />;
  }

  return (
    <LoginLayout title={user ? user.displayName || "Profile" : "Profile"}>
      <Layer
        elevation="sm"
        css={{
          overflow: "hidden",
          maxWidth: "550px",
          width: "100%",
          marginTop: theme.spaces.md
        }}
      >
        <Navbar
          css={{
            boxShadow: "none",
            borderBottom: `1px solid ${theme.colors.border.muted}`
          }}
          position="static"
        >
          <Toolbar>
            <Text gutter={false} variant="h5">
              Your projects
            </Text>
            <div css={{ flex: 1 }} />
            <Button
              onClick={createProject}
              css={{ position: "relative" }}
              loading={creatingProject}
              disabled={creatingProject}
              intent="primary"
            >
              New project
            </Button>
          </Toolbar>
        </Navbar>
        <div>
          {loading && (
            <div
              css={{
                margin: theme.spaces.md,
                display: "flex",
                justifyContent: "center"
              }}
            >
              <Spinner />
            </div>
          )}

          {error && (
            <Alert
              css={{ margin: theme.spaces.md }}
              title="An error occurred while loading your document. Please try reloading."
            />
          )}

          {value && value.size === 0 && (
            <Text
              muted
              css={{
                display: "block",
                margin: theme.spaces.md,
                fontSize: theme.sizes[0]
              }}
            >
              You have yet to create any projects.
            </Text>
          )}
          <List>
            {value &&
              value.docs.map((doc, i) => {
                return (
                  <ListItem
                    key={doc.id}
                    component={Link}
                    css={{
                      padding: `${theme.spaces.md} ${theme.spaces.lg}`,
                      borderBottom:
                        i === value.docs.length - 1 ? "none" : undefined
                    }}
                    to={doc.id}
                    primary={doc.get("title")}
                    iconAfter={<Icon icon="chevron-right" />}
                  />
                );
              })}
          </List>
        </div>
      </Layer>
    </LoginLayout>
  );
};
