"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioPreview } from "@/data/portfolioCategories";

type CategoryPreviewMediaProps = {
  media?: PortfolioPreview;
  isActive: boolean;
  isAwaitingAsset: boolean;
};

export function CategoryPreviewMedia({
  media,
  isActive,
  isAwaitingAsset,
}: CategoryPreviewMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (!isActive) {
      video.pause();
      return;
    }

    void video.play().catch(() => {
      // The poster remains visible when autoplay is unavailable.
    });
  }, [isActive]);

  if (!media || isAwaitingAsset) {
    return (
      <div className="category-preview category-preview-empty" aria-hidden="true">
        <span>CASE ASSETS</span>
        <span>IN PREPARATION</span>
      </div>
    );
  }

  return (
    <div
      className={`category-preview${hasError ? " has-error" : ""}`}
      style={{ backgroundImage: `url("${media.poster}")` }}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="category-preview-video"
        muted
        loop
        playsInline
        preload="metadata"
        poster={media.poster}
        style={{ objectPosition: media.objectPosition }}
        onLoadedData={() => setHasError(false)}
        onError={() => setHasError(true)}
      >
        <source src={media.src} type="video/mp4" />
      </video>
    </div>
  );
}
