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
  fileName: string;
}

const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
const getVideosCall = httpsCallable(functions, "getVideos");

export async function uploadVideo(file: File) {
  // Check if user is authenticated
  if (!auth.currentUser) {
    throw new Error("User must be authenticated to upload");
  }
  console.log(auth.currentUser);
  console.log("generating upload url");
  const response: any = await generateUploadUrl({
    fileExtension: file.name.split(".").pop(),
  });
  console.log("signed url generated", response);
  //upload the file to the signed url
  await fetch(response?.data?.url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
  return;
}

export async function getVideos() {
  const response: any = await getVideosCall();
  return response.data as Video[];
}
