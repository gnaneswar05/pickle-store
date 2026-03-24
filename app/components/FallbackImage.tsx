"use client";

import Image, { ImageProps } from "next/image";
import { useState, useMemo } from "react";

interface FallbackImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
}

const isValidImageSrc = (src: string): boolean => {
  if (!src) return false;
  try {
    new URL(src);
    return true;
  } catch {
    return src.startsWith("/");
  }
};

export default function FallbackImage({
  src,
  fallbackSrc = "/logo.jpeg",
  alt,
  onError,
  ...props
}: FallbackImageProps) {
  const validSrc = useMemo(
    () => (isValidImageSrc(src) ? src : fallbackSrc),
    [src, fallbackSrc],
  );
  const [hasError, setHasError] = useState(false);

  const handleError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    setHasError(true);
    if (onError) {
      onError(event);
    }
  };

  const imageSrc = hasError ? fallbackSrc : validSrc;

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt || "image"}
      onError={handleError}
      unoptimized={false}
    />
  );
}
