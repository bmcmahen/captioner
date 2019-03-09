/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import ReactPlayer from "react-player";
import { Input, InputGroup, Button, Divider, theme, Text } from "sancho";

export interface VideoProps {
  defaultVideoURL?: string;
}

export const Video: React.FunctionComponent<VideoProps> = ({
  defaultVideoURL
}) => {
  const [url, setURL] = React.useState(defaultVideoURL);

  if (!url) {
    return (
      <div
        css={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: theme.colors.background.tint1
        }}
      >
        <div>
          <Text variant="h5">Select a video you want to caption</Text>
          <Divider />

          <form css={{ display: "flex" }}>
            <InputGroup label="Add a URL of a video" hideLabel>
              <Input
                css={{
                  width: "300px",
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0
                }}
                placeholder="Youtube or Vimeo URL"
              />
            </InputGroup>
            <Button
              css={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
              }}
              intent="primary"
            >
              Add video
            </Button>
          </form>
          <Divider muted css={{ margin: `${theme.spaces.lg} 0` }} />
          <Button>Select a video...</Button>
        </div>
      </div>
    );
  }

  return <ReactPlayer url={url} />;
};
