/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { createVideoURL } from "./embed";
import {
  VisuallyHidden,
  Button,
  InputGroup,
  Input,
  Text,
  Popover,
  useTheme,
  useToast,
  IconWrapper,
  LightMode
} from "sancho";

export interface DropzoneProps {
  onRequestAddURL: (file: string, canSave: boolean, name?: string) => void;
}

export const Dropzone: React.FunctionComponent<DropzoneProps> = ({
  onRequestAddURL
}) => {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = React.useState("");
  const theme = useTheme();
  const toast = useToast();

  function createURL(file: File) {
    try {
      const url = createVideoURL(file);
      onRequestAddURL(url, false, file.name);
    } catch (err) {
      toast({
        title: "An error occurred while loading your video",
        subtitle: err.message,
        intent: "danger"
      });
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      createURL(e.dataTransfer.files[0]);
    }
  }

  function onSelectFileClick() {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

  function onFileChange(e: React.ChangeEvent) {
    if (fileRef.current!.files && fileRef.current!.files[0]) {
      createURL(fileRef.current!.files[0]);
    }
  }

  function submitURL(e: React.FormEvent) {
    e.preventDefault();
    onRequestAddURL(url, true);
  }

  return (
    <LightMode>
      <div
        css={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onDrop={onDrop}
      >
        <VisuallyHidden>
          <input onChange={onFileChange} type="file" ref={fileRef} />
        </VisuallyHidden>
        <div>
          <SelectSourceButton
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            }
            title="Video File"
            onClick={onSelectFileClick}
          />

          <Popover
            content={
              <form
                css={{ width: "400px", padding: theme.spaces.md }}
                onSubmit={submitURL}
              >
                <InputGroup
                  helpText="You can enter URLs for YouTube, Vimeo, Twitch, Wistia, Facebook, SoundCloud, MixCloud, and Daily Motion."
                  label="Enter your video URL"
                >
                  <Input
                    placeholder="https://www.youtube.com/watch?v=BHcAuOVdxpY"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                  />
                </InputGroup>
                <div css={{ textAlign: "right" }}>
                  <Button
                    css={{ marginTop: theme.spaces.md }}
                    intent="primary"
                    disabled={!url}
                    type="submit"
                  >
                    Add video
                  </Button>
                </div>
              </form>
            }
          >
            <div css={{ display: "inline-block" }}>
              <SelectSourceButton
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                }
                title="Video Link"
              />
            </div>
          </Popover>
        </div>
      </div>
    </LightMode>
  );
};

interface SelectSourceButtonProps {
  title: string;
  icon: JSX.Element;
  ref?: any;
  onClick?: () => void;
}

const SelectSourceButton = ({
  title,
  icon,
  onClick,
  ref,
  ...other
}: SelectSourceButtonProps) => {
  const theme = useTheme();
  return (
    <Button
      ref={ref}
      css={{
        width: "100px",
        height: "100px",
        margin: theme.spaces.sm,
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
        borderRadius: theme.radii.lg,
        paddingBottom: theme.spaces.sm
      }}
      onClick={onClick}
      {...other}
    >
      <IconWrapper>{icon}</IconWrapper>
      <Text
        wrap={false}
        css={{ marginTop: theme.spaces.sm }}
        variant="h6"
        gutter={false}
      >
        {title}
      </Text>
    </Button>
  );
};
