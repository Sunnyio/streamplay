// this file will contain code to interact with vidoe and google cloud
import { Storage } from "@google-cloud/storage";
import fs, { readFileSync } from 'fs';
import ffmpeg from "fluent-ffmpeg"
import { getVideo } from "./firestore";


const storage = new Storage()
const rawVideoBucketName = "streamplay-raw-vid"
const processedVideoBucketName = "streamplay-processed-vid"
const localRawVideoPath = "./raw-videos"
const localProcessedVideoPath = "./processed-video"
const thumbnailBucketName = "streamplay-thumbnails"

// create local directories for raw and processed vidoes
export function setupDirectories() {
  ensureDirectoryExistence(localRawVideoPath);
  ensureDirectoryExistence(localProcessedVideoPath);
  console.log(`Ensured ${localRawVideoPath} and ${localProcessedVideoPath} exists.`)
}
/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}
 * @returns A promise that resolves when the video has been processed
 */

export function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(metadata.format.duration || 0);
    });
  });
}

export async function convertVideo(rawVideoName: string, processedVideoName: string) {
  const rawVideoPath = `${localRawVideoPath}/${rawVideoName}`;
  const duration = await getVideoDuration(rawVideoPath);
  
  return new Promise<{duration: number}>((resolve, reject) => {
    ffmpeg(rawVideoPath)
      .outputOption("-vf", "scale=-1:360")
      .on("end", () => {
        console.log("Video processed Successfully!");
        resolve({ duration });
      })
      .on("error", (err) => {
        console.log(`An error occurred while converting video: ${err.message}`);
        reject(err);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

/**
 * @param filename name of the to download from the
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder
 * @returns a promise that resolves when the file has been downloaded
 */

export async function downloadRawVideo(filename: string) {
  await storage.bucket(rawVideoBucketName)
    .file(filename)
    .download({destination: `${localRawVideoPath}/${filename}`})
  console.log(`${filename} downloaded successfully to ${localRawVideoPath}/${filename}`)
}

/**
 * @param filename name of the file to upload from
 * {@link localProcessedVideoPath} folder to the {@link processedVideoBucketName}
 * @returns promise that resolves when the file has been uploaded
 */

export async function uploadProcessedVideo(filename: string) {
  const bucket = storage.bucket(processedVideoBucketName);
  
  await bucket.upload(`${localProcessedVideoPath}/${filename}`, {
      destination: filename
    });
  console.log(`${localProcessedVideoPath}/${filename} downloaded successfully to ${processedVideoBucketName}/${filename}`)
  await bucket.file(filename).makePublic();
}

export async function makeThumbnailPublic(videoId: string) {
  const bucket = storage.bucket(thumbnailBucketName);
  const video = await getVideo(videoId);
  if (!video?.thumbnailFileName) return;
  await bucket.file(video.thumbnailFileName).makePublic();
}

/**
 * @param filepath - The path of the video file we want to delete
 * @returns A promise that resolves when the file is successfully deleted
 */

function deleteFile(filePath: string): Promise <void> {
  return new Promise ((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log('Failed to delete File', err)
          reject(err)
        } else {
          console.log(`File deleted at this path ${filePath}`)
          resolve()
        }
      })
    } else {
      console.log(`File ${filePath} do not exist`)
      resolve()
    }
  })
}

/**
 * @param filename - name of the file to be deleted from
 * {@link localRawVideoPath} folder
 * @returns A promise that resolve when the file is succesfully deleted
 */

export function deleteRawVideo(filename: string) {
  return deleteFile(`${localRawVideoPath}/${filename}`);
}

/**
 * @param filename - name of the file to be deleted from
 * {@link localProcessedVideoPath} folder
 * @returns A promise that resolve when the file is succesfully deleted
 */

export function deleteProcessedVideo(filename: string) {
  return deleteFile(`${localProcessedVideoPath}/${filename}`);
}

/**
 * Ensures that a directory exists, create if if necessary
 * @param {string} dirPath - the directory path to check
 */

function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, {recursive: true}); // True to create nested directories
    console.log(`directory created at ${dirPath}`)
  }
}