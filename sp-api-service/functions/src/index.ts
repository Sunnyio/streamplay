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

const videoCollectionId = "videos";

export interface Video {
  id: string;
  uid: string;
  status: "processing" | "processed" | "error";
  title: string;
  description: string;
  fileName: string;
}

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uuid: user.uid,
    email: user.email,
    photoURL: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});

export const generateUploadUrl = onCall(
  {cors: true},
  async (request) => {
  // check if user is authenticated
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Request not authenticated"
      );
    }

    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);

    // Generate a unique filename for the video
    const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

    // generate a v4 signed url for uploading a video to the bucket
    const [url] = await bucket.file(fileName).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return {url, fileName};
  });


export const getVideos = onCall({maxInstances: 1}, async (request) => {
  const snapshot = await firestore
    . collection(videoCollectionId)
    .limit(10)
    .get();
  return snapshot.docs.map((doc) => doc.data());
});
