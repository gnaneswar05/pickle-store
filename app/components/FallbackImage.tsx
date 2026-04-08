"use client";

import Image, { ImageProps } from "next/image";
import { useState, useMemo } from "react";

interface FallbackImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
}

const isValidImageSrc = (src: string): boolean => {
  if (!src) return false;

  if (
    src.startsWith("/") ||
    src.startsWith("data:image/") ||
    src.startsWith("blob:")
  ) {
    return true;
  }

  try {
    new URL(src);
    return true;
  } catch {
    return false;
  }
};

export default function FallbackImage({
  src,
  fallbackSrc = "/logo.jpeg",
  alt,
  onError,
  unoptimized,
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
  const shouldBypassOptimization =
    unoptimized ??
    (imageSrc.startsWith("data:image/") || imageSrc.startsWith("blob:"));

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt || "image"}
      onError={handleError}
      unoptimized={shouldBypassOptimization}
    />
  );
}
