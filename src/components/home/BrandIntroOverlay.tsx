"use client";

import { useCallback, useEffect, useRef } from "react";
import { brandAssets } from "@/data/brand";
import { portfolioAssetPath } from "@/data/portfolioCategories";

const EXIT_DURATION_MS = 780;

type BrandIntroOverlayProps = {
  phase: "playing" | "exiting";
  onSkip: () => void;
  onExitComplete: () => void;
};

export function BrandIntroOverlay({
  phase,
  onSkip,
  onExitComplete,
}: BrandIntroOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const skipLockRef = useRef(false);

  const requestSkip = useCallback(() => {
    if (skipLockRef.current || phase !== "playing") return;
    skipLockRef.current = true;
    onSkip();
  }, [onSkip, phase]);

  useEffect(() => {
    if (phase !== "exiting") return;

    const timer = window.setTimeout(onExitComplete, EXIT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onExitComplete, phase]);

  useEffect(() => {
    if (phase !== "playing") return;

    skipLockRef.current = false;
    const video = videoRef.current;
    if (!video) return;

    void video.play().catch(() => {
      requestSkip();
    });
  }, [phase, requestSkip]);

  return (
    <button
      type="button"
      className={`brand-intro-overlay is-${phase}`}
      aria-label="跳过品牌开场动画"
      onClick={(event) => {
        event.stopPropagation();
        requestSkip();
      }}
    >
      <video
        ref={videoRef}
        className="brand-intro-video"
        src={portfolioAssetPath(brandAssets.brandIntroVideo)}
        muted
        playsInline
        preload="auto"
        onEnded={requestSkip}
      />
    </button>
  );
}

export const BRAND_INTRO_EXIT_MS = EXIT_DURATION_MS;
