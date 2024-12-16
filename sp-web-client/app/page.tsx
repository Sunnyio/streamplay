// page.tsx
import Image from "next/image";
import { getVideos } from "./firebase/functions";
import Link from "next/link";
import styles from "./page.module.css";

const dummyTitles = [
  "The Art of Creative Coding: A Beginner's Guide",
  "Understanding Modern Web Development in 2024",
  "Machine Learning Fundamentals Explained Simply",
  "Building Scalable Applications with React",
  "The Future of Cloud Computing: What's Next?",
  "DevOps Best Practices for Startups",
  "Full Stack Development: From Zero to Hero",
  "UI/UX Design Principles for Developers",
  "Blockchain Technology: Beyond Cryptocurrency",
  "Artificial Intelligence in Everyday Life"
];

const dummyDescriptions = [
  "Learn how to blend creativity with code in this comprehensive guide",
  "Explore the latest trends and tools in modern web development",
  "Demystifying machine learning concepts for beginners",
  "Master React.js with practical examples and best practices",
  "Discover emerging trends in cloud computing technology",
  "Essential DevOps practices for growing development teams",
  "Complete guide to becoming a full stack developer",
  "Design principles that every developer should know",
  "Understanding blockchain beyond cryptocurrency applications",
  "Real-world applications of AI in daily life"
];

export default async function Home() {
  const videos = await getVideos();

  return (
    <main className={styles.mainContainer}>
      <div className={styles.videosGrid}>
        {videos.map((video, index) => (
          <Link 
            key={video.id} 
            href={`/watch?v=${video.fileName}`}
            className={styles.videoCard}
          >
            <div className={styles.thumbnailContainer}>
              <Image 
                src="/dummy-thumbnail.svg"
                alt={dummyTitles[index % dummyTitles.length]}
                width={640}
                height={360}
                className={styles.thumbnail}
              />
              <div className={styles.duration}>
                {`${Math.floor(Math.random() * 10 + 1)}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`}
              </div>
            </div>
            <div className={styles.videoInfo}>
              <h3 className={styles.videoTitle}>
                {dummyTitles[index % dummyTitles.length]}
              </h3>
              <p className={styles.videoDescription}>
                {dummyDescriptions[index % dummyDescriptions.length]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}