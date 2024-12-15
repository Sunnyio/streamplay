import {Firestore} from "firebase-admin/firestore";

const firestore = new Firestore();

const videoCollectionId = "videos";
export interface Video {
  id: string;
  uid: string;
  status: "processing" | "processed" | "error";
  title: string;
  description: string;
  thumbnailUrl: string;
  fileName?: string;
}

async function getVideo(videoId: string): Promise<Video | null> {
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

