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
  toast,
  Popover,
  IconButton,
  MenuList,
  MenuItem
} from "sancho";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import { useCreateProject } from "./firebase";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";

const AnimatedLayer = animated(Layer) as any;

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

  const animation = useSpring({
    from: { opacity: 0, transform: "translateY(-5%)" },
    opacity: 1,
    transform: "translateY(0)"
  });

  if (newProjectId) {
    return <Redirect to={newProjectId} />;
  }

  return (
    <LoginLayout title={user ? user.displayName || "Profile" : "Profile"}>
      <AnimatedLayer
        style={animation}
        elevation="xl"
        css={{
          overflow: "hidden",
          maxWidth: "550px",
          width: "100%",
          marginTop: theme.spaces.xl
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

          <List
            css={{
              maxHeight: "60vh",
              overflowY: "scroll",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {value &&
              value.docs.map((doc, i) => {
                return (
                  <ListItem
                    key={doc.id}
                    contentBefore={<Icon icon="document" size="lg" />}
                    component={Link}
                    to={doc.id}
                    primary={doc.get("title")}
                    contentAfter={
                      <Popover
                        content={
                          <MenuList>
                            <MenuItem>Delete project</MenuItem>
                          </MenuList>
                        }
                      >
                        <IconButton
                          icon="more"
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          label="Show options"
                          color={theme.colors.text.muted}
                          variant="ghost"
                        />
                      </Popover>
                    }
                  />
                );
              })}
          </List>
        </div>
      </AnimatedLayer>
    </LoginLayout>
  );
};
