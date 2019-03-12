import * as firebase from "firebase/app";
import "firebase/firestore";
import config from "./firebase-config";
import { useSession } from "./auth";
import * as React from "react";
import format from "date-fns/format";

firebase.initializeApp(config);

export const db = firebase.firestore();

db.enablePersistence().catch(function(err) {
  console.error(err);
});

export function useCreateProject() {
  const session = useSession();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  function create() {
    if (!session) {
      throw new Error("Session required to create a project");
    }

    setLoading(true);

    return firebase
      .firestore()
      .collection("captions")
      .add(projectFactory(session.uid))
      .then(value => {
        setLoading(false);
        return value;
      })
      .catch(err => {
        setLoading(false);
        setError(true);
        throw err;
      });
  }

  return {
    error,
    loading,
    create
  };
}

export function projectFactory(uid: string) {
  return {
    title: format(new Date(), "MMMM Do, YYYY"),
    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
    updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
    uid
  };
}

export interface CaptionOptions {
  startTime: number;
  endTime: number;
  content?: string;
}

export function captionFactory(options: CaptionOptions) {
  return {
    content: "",
    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
    ...options
  };
}
