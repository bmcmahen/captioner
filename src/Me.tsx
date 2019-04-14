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
  Spinner,
  Alert,
  ListItem,
  List,
  useToast,
  Popover,
  IconButton,
  MenuList,
  MenuItem,
  useTheme,
  IconFileText,
  IconMoreVertical
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
  const theme = useTheme();
  const toast = useToast();

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

  async function deleteProject(doc: firebase.firestore.QueryDocumentSnapshot) {
    try {
      doc.ref.delete();
    } catch (err) {
      console.error(err);
      toast({
        title: "An error occurred. Please try again.",
        subtitle: err.message,
        intent: "danger"
      });
    }
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
          borderRadius: 0,
          marginLeft: "auto",
          marginRight: "auto",
          [theme.mediaQueries.md]: {
            borderRadius: theme.radii.lg,
            marginTop: theme.spaces.xl
          },
          overflow: "hidden",
          maxWidth: "550px",
          width: "100%"
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
            <Button to="/new" component={Link} intent="primary">
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
                fontSize: theme.fontSizes[0]
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
                    contentBefore={<IconFileText size="lg" />}
                    component={Link}
                    to={doc.id}
                    wrap={false}
                    primary={doc.get("title")}
                    contentAfter={
                      <Popover
                        content={
                          <MenuList>
                            <MenuItem
                              onClick={e => {
                                e.preventDefault();
                              }}
                              onSelect={() => {
                                deleteProject(doc);
                              }}
                            >
                              Delete project
                            </MenuItem>
                          </MenuList>
                        }
                      >
                        <IconButton
                          icon={<IconMoreVertical />}
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
