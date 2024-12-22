/* eslint-disable */

import {httpsCallable} from "firebase/functions";
import {app} from "./firebase";
import {getAuth} from "firebase/auth";
import { functions } from "./firebase";


const auth = getAuth(app);


export interface Video {
  id: string;
  uid: string;
  status: "processing" | "processed" | "error";
  title: string;
  description: string;
  videoFileName: string;
  thumbnailFileName: string;
  createdAt: number;
  duration?: number;
}

const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
const getVideosCall = httpsCallable(functions, "getVideos");
const addVideo = httpsCallable(functions, "addVideo");

interface UploadVideoParams {
  video: File;
  thumbnail: File;
  title: string;
  description: string;
}

export async function uploadVideo({ video, thumbnail, title, description }: UploadVideoParams) {
  // Check if user is authenticated
  if (!auth.currentUser) {
    throw new Error("User must be authenticated to upload");
  }

  // Generate upload URLs for both video and thumbnail
  const response: any = await generateUploadUrl({
    videoExtension: video.name.split(".").pop(),
    thumbnailExtension: thumbnail.name.split(".").pop(),
  });

  // Upload both files in parallel
  await Promise.all([
    // Upload video
    fetch(response.data.videoUrl, {
      method: "PUT",
      body: video,
      headers: {
        "Content-Type": video.type,
      },
    }),
    // Upload thumbnail
    fetch(response.data.thumbnailUrl, {
      method: "PUT",
      body: thumbnail,
      headers: {
        "Content-Type": thumbnail.type,
      },
    })
  ]);

  await addVideo({
    videoId: response.data.videoId,
    title: title,
    description: description,
    videoFileName: response.data.videoFileName,
    thumbnailFileName: response.data.thumbnailFileName,
    createdAt: Date.now(),
  });

  return;
}

export async function getVideos() {
  const response: any = await getVideosCall();
  return response.data as Video[];
}
