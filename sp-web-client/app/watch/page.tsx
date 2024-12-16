// sp-web-client/app/watch/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import styles from './watch.module.css';
import { useEffect, useState, useRef } from 'react';
import { Video, getVideos } from '../firebase/functions';
import Image from 'next/image';
import Link from 'next/link';

// Dummy data for current video
const dummyCurrentVideos = [
  {
    title: "Complete Guide to Modern Web Development",
    description: "In this comprehensive tutorial, we dive deep into modern web development practices. Learn about the latest frameworks, tools, and techniques used by professional developers. Topics covered include React, Next.js, TypeScript, and modern CSS practices. Perfect for both beginners and intermediate developers looking to level up their skills.\n\nKey Topics Covered:\n- Frontend Architecture\n- State Management\n- Performance Optimization\n- Responsive Design\n- Best Practices and Common Patterns"
  },
  {
    title: "Advanced TypeScript Patterns in 2024",
    description: "Explore advanced TypeScript patterns and techniques used in production applications. This in-depth guide covers generic types, utility types, conditional types, and real-world examples of complex type systems. Learn how to write more maintainable and type-safe code while leveraging TypeScript's powerful type system."
  },
  {
    title: "Building Scalable Backend Systems",
    description: "Learn how to design and implement scalable backend systems using modern technologies. This tutorial covers microservices architecture, database optimization, caching strategies, and deployment best practices. Perfect for developers looking to build robust and scalable applications."
  }
];

// Existing dummy data for recommended videos
const dummyTitles = [
  "The Art of Creative Coding: A Beginner's Guide",
  "Understanding Modern Web Development in 2024",
  "Machine Learning Fundamentals Explained Simply",
  "Building Scalable Applications with React",
  "The Future of Cloud Computing: What's Next?"
];

const dummyDescriptions = [
  "Learn how to blend creativity with code in this comprehensive guide",
  "Explore the latest trends and tools in modern web development",
  "Demystifying machine learning concepts for beginners",
  "Master React.js with practical examples and best practices",
  "Discover emerging trends in cloud computing technology"
];

export default function Watch() {
  const videoPrefix = 'https://storage.googleapis.com/streamplay-processed-vid/';
  const searchParams = useSearchParams();
  const videoSrc = searchParams.get('v');
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get random dummy content for current video
  const dummyCurrentVideo = dummyCurrentVideos[Math.floor(Math.random() * dummyCurrentVideos.length)];

  useEffect(() => {
    const fetchVideos = async () => {
      const allVideos = await getVideos();
      setVideos(allVideos.filter(v => v.fileName !== videoSrc).slice(0, 5));
      setCurrentVideo(allVideos.find(v => v.fileName === videoSrc) || null);
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
          <video 
            ref={videoRef}
            controls 
            autoPlay
            muted
            src={videoPrefix + videoSrc}
            className={styles.videoPlayer}
          />
        </div>
        <div className={styles.videoInfo}>
          <h1 className={styles.videoTitle}>
            {currentVideo?.title || dummyCurrentVideo.title}
          </h1>
          <p className={styles.videoDescription}>
            {currentVideo?.description || dummyCurrentVideo.description}
          </p>
        </div>
      </div>
      
      <aside className={styles.sidebar}>
        <h2 className={styles.recommendedTitle}>Recommended Videos</h2>
        <div className={styles.recommendedVideos}>
          {videos.map((video, index) => (
            <Link 
              key={video.id} 
              href={`/watch?v=${video.fileName}`}
              className={styles.recommendedVideo}
            >
              <div className={styles.thumbnailContainer}>
                <Image
                  src="/default-thumbnail.svg"
                  alt={video.title || dummyTitles[index % dummyTitles.length]}
                  width={168}
                  height={94}
                  className={styles.thumbnail}
                />
              </div>
              <div className={styles.recommendedInfo}>
                <h3 className={styles.recommendedVideoTitle}>
                  {video.title || dummyTitles[index % dummyTitles.length]}
                </h3>
                <p className={styles.recommendedVideoDescription}>
                  {video.description || dummyDescriptions[index % dummyDescriptions.length]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}