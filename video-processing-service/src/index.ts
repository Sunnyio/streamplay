import express from "express";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";
import { isVideoNew, setVideo } from "./firestore";

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
  // Get the bucket and filename from the Cloud Pub/Sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received');
    } 
  } catch (error) {
    console.log(error);
    return res.status(400).send('Bad Request: missing Filename.');
  }

  const inputFileName = data.name;
  const outputFilename = `processed-${inputFileName}`;
  const videoId = inputFileName.split('.')[0];

  if (!isVideoNew(videoId)) {
    return res.status(400).send('Bad Request: Video already processing or processed.');
  } else {
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split('-')[0],
      status: "processing",
      title: "",
      description: ""
    })
  }
  // Download the raw video from cloud storage
  await downloadRawVideo(inputFileName);
  
  // convert the video to 360
  try {
    await convertVideo(inputFileName, outputFilename);
    console.log('Video converted successfully')
  } catch (err) {

    await Promise.all([deleteRawVideo(inputFileName), deleteProcessedVideo(outputFilename)])
    // or you can do the above step with this code - await deleteRawVideo(inputFileName); await deleteProcessedVideo(outputFilename);

    console.log(err);
    return res.status(500).send('Internal Server Error. Video Processing Failed')
  }

  // upload processed video
  await uploadProcessedVideo(outputFilename);

  await setVideo(videoId, {
    status: "processed",
    fileName: outputFilename,
  });

  await Promise.all([deleteRawVideo(inputFileName), deleteProcessedVideo(outputFilename)]);

  return res.status(200).send('Processing Finished Successfully')

})

// if env variable is not declared then the server will run on 3000
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Video processing service is running at http://localhost:${port}`);
})

