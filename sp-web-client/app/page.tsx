// page.tsx
'use client';

import { getVideos } from "./firebase/functions";
import Link from "next/link";
import styles from "./page.module.css";
import VideoThumbnail from "./components/video-thumbnail";
import { useEffect, useState } from "react";
import { Video } from "./firebase/functions";

const DEFAULT_TITLE = "Title not provided";
const DEFAULT_DESCRIPTION = "Description not provided";
const DEFAULT_THUMBNAIL = "/dummy-thumbnail.svg";
const THUMBNAIL_BUCKET = "https://storage.googleapis.com/streamplay-thumbnails/";
const DEFAULT_DURATION = "2:15";

function formatDuration(seconds: number | undefined): string {
  if (!seconds) return DEFAULT_DURATION;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const fetchedVideos = await getVideos();
        setVideos(fetchedVideos);
      } catch (error) {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <main className={styles.mainContainer}>
      <div className={styles.videosGrid}>
        {videos.map((video) => (
          <Link 
            key={video.id} 
            href={`/watch?v=${video.videoFileName}`}
            className={styles.videoCard}
          >
            <div className={styles.thumbnailContainer}>
              <VideoThumbnail 
                src={video.thumbnailFileName ? 
                  `${THUMBNAIL_BUCKET}${video.thumbnailFileName}` : 
                  DEFAULT_THUMBNAIL
                }
                alt={video.title || DEFAULT_TITLE}
                width={640}
                height={360}
                className={styles.thumbnail}
                defaultThumbnail={DEFAULT_THUMBNAIL}
              />
              <div className={styles.duration}>
                {video.duration ? formatDuration(video.duration) : DEFAULT_DURATION}
              </div>
            </div>
            <div className={styles.videoInfo}>
              <h3 className={styles.videoTitle}>
                {video.title || DEFAULT_TITLE}
              </h3>
              <p className={styles.videoDescription}>
                {video.description || DEFAULT_DESCRIPTION}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}