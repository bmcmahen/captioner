/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { createVideoURL } from "./embed";
import { VisuallyHidden, Button, toast } from "sancho";

export interface DropzoneProps {
  onRequestAddURL: (file: string, canSave: boolean, name: string) => void;
}

export const Dropzone: React.FunctionComponent<DropzoneProps> = ({
  onRequestAddURL
}) => {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

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

  return (
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
        <Button
          variant="ghost"
          css={{
            color: "white",
            border: "2px dashed rgba(255,255,255,0.6)"
          }}
          onClick={onSelectFileClick}
        >
          Select a video...
        </Button>
      </div>
    </div>
  );
};
