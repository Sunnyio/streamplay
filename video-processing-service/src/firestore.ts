import {Firestore} from "firebase-admin/firestore";
import {initializeApp} from "firebase-admin/app";
import { credential } from "firebase-admin";

initializeApp({
  credential: credential.applicationDefault()
});

const firestore = new Firestore();

const videoCollectionId = "videos";
export interface Video {
  id?: string;
  uid?: string;
  status?: "processing" | "processed" | "error";
  title?: string;
  description?: string;
  videoFileName?: string;
  thumbnailFileName?: string;
  createdAt?: number;
  duration?: number;
}

export async function getVideo(videoId: string): Promise<Video | null> {
  const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
  return (snapshot.data() as Video) ?? {};
}

export function setVideo(videoId: string, video: Partial<Video>) {
  firestore.collection(videoCollectionId)
    .doc(videoId)
    .set(video, {merge: true});
}

export async function isVideoNew(videoId: string): Promise<boolean> {
  const video = await getVideo(videoId);
  return video?.status === undefined;
}

