import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v1";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

initializeApp();

const firestore = new Firestore();
const storage = new Storage();
const rawVideoBucketName = "streamplay-raw-vid";
const thumbnailBucketName = "streamplay-thumbnails";

const videoCollectionId = "videos";

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

export const createUser = functions.auth.user().onCreate(async (user) => {
  const userInfo = {
    uuid: user.uid,
    email: user.email,
    photoURL: user.photoURL,
  };

  await firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});

export const generateUploadUrl = onCall(
  {
    cors: ["http://localhost:3000", "https://sp-web-client.vercel.app"],
  },
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Request not authenticated"
      );
    }

    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);
    const thumbnailBucket = storage.bucket(thumbnailBucketName);

    // Generate unique filenames
    const videoFileName = `${auth.uid}-${Date.now()}.${data.videoExtension}`;
    const thumbnailFileName =
    `${auth.uid}-${Date.now()}-thumb.${data.thumbnailExtension}`;

    // Save initial video metadata to Firestore
    const videoId = videoFileName.split(".")[0];

    // Generate signed URLs
    const [videoUrl] = await bucket.file(videoFileName).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
    });

    const [thumbnailUrl] = await thumbnailBucket.file(thumbnailFileName)
      .getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000,
      });

    return {
      videoUrl: videoUrl,
      videoId: videoId,
      thumbnailUrl: thumbnailUrl,
      videoFileName: videoFileName,
      thumbnailFileName: thumbnailFileName,
    };
  });


export const getVideos = onCall({maxInstances: 1}, async (request) => {
  const snapshot = await firestore
    .collection(videoCollectionId)
    .limit(10)
    .get();
  return snapshot.docs.map((doc) => doc.data());
});

export const addVideo = onCall({maxInstances: 1}, async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Request not authenticated"
    );
  }

  const {
    videoId, title, description,
    videoFileName, thumbnailFileName, createdAt,
  } = request.data;

  await firestore.collection("videos").doc(videoId).set({
    id: videoId,
    uid: request.auth.uid, // Add this
    status: "processing",
    title: title,
    description: description,
    videoFileName: videoFileName,
    thumbnailFileName: thumbnailFileName,
    createdAt: createdAt,
  });

  return {videoId};
});
