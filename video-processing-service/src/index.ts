import express from "express";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, makeThumbnailPublic, setupDirectories, uploadProcessedVideo } from "./storage";
import { setVideo } from "./firestore";

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received');
    } 
  } catch (error) {
    console.log(error);
    return res.status(400).send('Bad Request: missing filename.');
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;
  const videoId = inputFileName.split('.')[0];

  // Download the raw video from cloud storage
  await downloadRawVideo(inputFileName);
  
  // Convert the video to 360p
  try {
    const { duration } = await convertVideo(inputFileName, outputFileName);
    console.log('Video converted successfully');
    
    // Upload processed video
    await uploadProcessedVideo(outputFileName);

    // Make thumbnail public
    await makeThumbnailPublic(videoId);

    // Update video document with processed status and duration
    await setVideo(videoId, {
      status: "processed",
      videoFileName: outputFileName,
      duration: duration
    });

  } catch (err) {
    await Promise.all([
      deleteRawVideo(inputFileName), 
      deleteProcessedVideo(outputFileName)
    ]);
    console.log(err);
    return res.status(500).send('Internal Server Error: Video Processing Failed');
  }

  await Promise.all([
    deleteRawVideo(inputFileName), 
    deleteProcessedVideo(outputFileName)
  ]);

  return res.status(200).send('Processing Finished Successfully');
});

// if env variable is not declared then the server will run on 3000
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Video processing service is running at http://localhost:${port}`);
})

