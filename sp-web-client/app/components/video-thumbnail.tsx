'use client';

import Image from "next/image";
import { useState } from "react";

interface VideoThumbnailProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  defaultThumbnail: string;
}

export default function VideoThumbnail({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  defaultThumbnail 
}: VideoThumbnailProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => setImgSrc(defaultThumbnail)}
        onLoad={() => setIsLoading(false)}
        priority
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </>
  );
} 