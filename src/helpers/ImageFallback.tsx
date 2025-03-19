"use client";

import Image from "next/image";
import { memo, useState, useCallback } from "react";

interface ImageFallbackProps {
  src: string;
  fallback?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  [key: string]: any;
}

const ImageFallback = memo((props: ImageFallbackProps) => {
  const { 
    src, 
    fallback = "/images/image-placeholder.png", 
    alt,
    width,
    height,
    className,
    priority = false,
    loading = "lazy",
    ...rest 
  } = props;
  
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  const handleError = useCallback(() => {
    if (!error) {
      setImgSrc(fallback);
      setError(true);
    }
  }, [error, fallback]);

  // Ensure we have a valid src
  const validSrc = imgSrc || fallback;

  return (
    <Image
      {...rest}
      src={validSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={loading}
      onError={handleError}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      quality={85}
    />
  );
});

ImageFallback.displayName = 'ImageFallback';

export default ImageFallback;
