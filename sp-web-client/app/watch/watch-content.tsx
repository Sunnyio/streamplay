'use client';

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getVideos, Video } from "../firebase/functions";
import Link from "next/link";
import styles from "./watch.module.css";
import VideoThumbnail from "../components/video-thumbnail";


const DEFAULT_TITLE = "Title not provided";
const DEFAULT_DESCRIPTION = "Description not provided";
const DEFAULT_THUMBNAIL = "/default-thumbnail.svg";
const VIDEO_BUCKET = process.env.NEXT_PUBLIC_VIDEO_BUCKET;
const THUMBNAIL_BUCKET = process.env.NEXT_PUBLIC_THUMBNAIL_BUCKET;
// Move all your existing Watch component code here
export default function WatchContent() {
  const searchParams = useSearchParams();
  const videoSrc = searchParams.get('v');
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const allVideos = await getVideos();
      const current = allVideos.find(v => v.videoFileName === videoSrc);
      setVideos(allVideos.filter(v => v.videoFileName !== videoSrc).slice(0, 5));
      setCurrentVideo(current || null);
    };
    fetchVideos();
  }, [videoSrc]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        document.removeEventListener('click', handleFirstInteraction);
      }
    };

    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, []);

  return (
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.videoWrapper}>
          {!currentVideo ? (
            <div>Loading...</div>
          ) : currentVideo.status !== "processed" ? (
            <div>Video is still processing...</div>
          ) : (
            <video 
              ref={videoRef}
              controls 
              autoPlay
              muted
              src={`${VIDEO_BUCKET}${currentVideo.videoFileName}`}
              className={styles.videoPlayer}
              onError={(e) => console.error('Video error:', e)}
            />
          )}
        </div>
        <div className={styles.videoInfo}>
          <h1 className={styles.videoTitle}>
            {currentVideo?.title || DEFAULT_TITLE}
          </h1>
          <p className={styles.videoDescription}>
            {currentVideo?.description || DEFAULT_DESCRIPTION}
          </p>
        </div>
      </div>
      
      <aside className={styles.sidebar}>
        <h2 className={styles.recommendedTitle}>Recommended Videos</h2>
        <div className={styles.recommendedVideos}>
          {videos.map((video) => (
            <Link 
              key={video.id} 
              href={`/watch?v=${video.videoFileName}`}
              className={styles.recommendedVideo}
            >
              <div className={styles.thumbnailContainer}>
                <VideoThumbnail
                  src={video.thumbnailFileName ? 
                    `${THUMBNAIL_BUCKET}${video.thumbnailFileName}` : 
                    DEFAULT_THUMBNAIL
                  }
                  alt={video.title || DEFAULT_TITLE}
                  width={168}
                  height={94}
                  className={styles.thumbnail}
                  defaultThumbnail={DEFAULT_THUMBNAIL}
                />
              </div>
              <div className={styles.recommendedInfo}>
                <h3 className={styles.recommendedVideoTitle}>
                  {video.title || DEFAULT_TITLE}
                </h3>
                <p className={styles.recommendedVideoDescription}>
                  {video.description || DEFAULT_DESCRIPTION}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  )
} 