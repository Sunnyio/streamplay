import Image from "next/image";
import { getVideos } from "./firebase/functions";
import Link from "next/link";

export default async function Home() {
  const videos = await getVideos();
  console.log(videos);
  return (
    <main>
      {
        videos.map((video) => (
          <Link key={video.id} href={`/watch?v=${video.fileName}`}>
            <Image 
              src="/youtube-logo.svg" 
              alt="video thumbnail" 
              width={100} 
              height={100} 
              className="rounded-lg"
            />
          </Link>
        ))
      }
    </main>
  );
}
