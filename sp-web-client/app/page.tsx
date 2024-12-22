// page.tsx
import { getVideos } from "./firebase/functions";
import styles from "./page.module.css";
import VideoGrid from "./components/VideoGrid";

// Add revalidation time (20 seconds)
export const revalidate = 20;

export default async function Home() {
  const videos = await getVideos();

  return (
    <main className={styles.mainContainer}>
      <VideoGrid videos={videos} />
    </main>
  );
}